import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";

export const dynamic = "force-dynamic";

function asBuffer(data: unknown) {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "string") {
    const hex = data.startsWith("\\x") ? data.slice(2) : data;
    return Buffer.from(hex, "hex");
  }
  return null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Não encontrado", { status: 404 });
  }

  try {
    const [row] = await getDb().select().from(media).where(eq(media.id, id)).limit(1);
    if (!row) return new Response("Não encontrado", { status: 404 });
    const bytes = asBuffer(row.data);
    if (!bytes) return new Response("Não encontrado", { status: 404 });
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": row.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}
