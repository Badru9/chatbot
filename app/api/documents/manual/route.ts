import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("request", body);

  return Response.json(
    { message: "Manual dataset berhasil ditambahkan" },
    { status: 200 },
  );
}
