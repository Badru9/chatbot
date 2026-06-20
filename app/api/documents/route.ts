export const runtime = 'nodejs';

export async function DELETE(request: Request) {
  let body: { documentId?: unknown };

  try {
    body = (await request.json()) as { documentId?: unknown };
  } catch {
    return Response.json({ error: 'Request body harus berupa JSON.' }, { status: 400 });
  }

  if (typeof body.documentId !== 'string' || !body.documentId.trim()) {
    return Response.json({ error: 'Field documentId wajib diisi.' }, { status: 400 });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const res = await fetch(`${backendUrl}/api/documents/${body.documentId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Backend error: ${errText}` }, { status: res.status });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('DELETE documents error:', error);
    return Response.json({ error: 'Gagal menghubungi backend.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Request harus berupa multipart/form-data.' }, { status: 400 });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return Response.json({ error: 'Field file wajib diisi.' }, { status: 400 });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const res = await fetch(`${backendUrl}/api/documents`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = 'Gagal memproses PDF di backend.';
      try {
        const parsed = JSON.parse(errText);
        errorMsg = parsed.error || errorMsg;
      } catch {}
      return Response.json({ error: errorMsg }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('POST documents error:', error);
    return Response.json({ error: 'Gagal menghubungi backend.' }, { status: 500 });
  }
}
