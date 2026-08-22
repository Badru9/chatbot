"use server";

import { prisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/middleware/auth";
import {
  datasetSchema,
  datasetUpdateSchema,
} from "@/lib/server/middleware/validators";

export interface DatasetItem {
  id: string;
  name: string;
  description: string | null;
  content: string;
  source: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch all datasets (Admin view or internal server view)
 */
export async function fetchDatasetsAction(): Promise<DatasetItem[]> {
  await requireAdmin();

  const datasets = await prisma.dataset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return datasets;
}

/**
 * Create a new system dataset (Admin only)
 */
export async function createDatasetAction(input: {
  name: string;
  description?: string;
  content: string;
  source?: string;
  isActive?: boolean;
}): Promise<DatasetItem> {
  const { user } = await requireAdmin();

  const validated = datasetSchema.parse(input);

  const dataset = await prisma.dataset.create({
    data: {
      name: validated.name.trim(),
      description: validated.description?.trim() || null,
      content: validated.content.trim(),
      source: validated.source?.trim() || null,
      isActive: validated.isActive !== undefined ? validated.isActive : true,
      createdBy: user.id,
    },
  });

  return dataset;
}

/**
 * Update an existing system dataset (Admin only)
 */
export async function updateDatasetAction(
  id: string,
  input: {
    name?: string;
    description?: string;
    content?: string;
    source?: string;
    isActive?: boolean;
  },
): Promise<DatasetItem> {
  await requireAdmin();

  const validated = datasetUpdateSchema.parse(input);

  const dataset = await prisma.dataset.update({
    where: { id },
    data: {
      ...(validated.name !== undefined && { name: validated.name.trim() }),
      ...(validated.description !== undefined && {
        description: validated.description.trim() || null,
      }),
      ...(validated.content !== undefined && { content: validated.content.trim() }),
      ...(validated.source !== undefined && {
        source: validated.source.trim() || null,
      }),
      ...(validated.isActive !== undefined && { isActive: validated.isActive }),
    },
  });

  return dataset;
}

/**
 * Toggle active status of a dataset (Admin only)
 */
export async function toggleDatasetStatusAction(
  id: string,
  isActive: boolean,
): Promise<DatasetItem> {
  await requireAdmin();

  const dataset = await prisma.dataset.update({
    where: { id },
    data: { isActive },
  });

  return dataset;
}

/**
 * Delete a dataset (Admin only)
 */
export async function deleteDatasetAction(id: string): Promise<{ success: boolean }> {
  await requireAdmin();

  await prisma.dataset.delete({
    where: { id },
  });

  return { success: true };
}

/**
 * Get active datasets formatted as a markdown context string for LLM systemPrompt
 */
export async function getActiveDatasetsContext(): Promise<string> {
  const activeDatasets = await prisma.dataset.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (activeDatasets.length === 0) return "";

  const sections = activeDatasets.map((d) => {
    const metaParts = [];
    if (d.description) metaParts.push(`Deskripsi: ${d.description}`);
    if (d.source) metaParts.push(`Sumber: ${d.source}`);
    const metaStr = metaParts.length > 0 ? `\n${metaParts.join(" | ")}` : "";

    return `### Dataset: ${d.name}${metaStr}\n\n${d.content}`;
  });

  return `\n\n<system_knowledge_datasets>\n${sections.join("\n\n---\n\n")}\n</system_knowledge_datasets>`;
}
