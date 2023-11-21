import { type DataFunctionArgs } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

export async function loader({ params }: DataFunctionArgs) {
  const image = await prisma.image.findUnique({
    where: { id: params.imageId },
    select: { blob: true, contentType: true },
  });

  if (!image) throw new Response("Not found", { status: 404 });

  return new Response(image.blob, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "max-age=31536000",
    },
  });
}
