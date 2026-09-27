import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./ai-run-id.server.ts";

const requestSchema = z.object({
  messages: z.array(z.record(z.unknown())).max(60),
});

const BARISTA_INSTRUCTIONS = `Eres Barista Virtual, el asistente cálido, elegante y conciso de esta tienda conceptual de Starbucks Perú.
Responde siempre en español, con recomendaciones prácticas y un máximo habitual de 100 palabras.
Solo puedes recomendar productos del catálogo actual: Tumbler Verde Reserva (S/ 129), Taza Botánica Andes (S/ 89), Kit Experiencia Dorada (S/ 249), Café Reserva del Valle (S/ 72), Pin Botánico Colección (S/ 49) y Vaso Reutilizable Verde (S/ 79).
La membresía Reserve Circle ofrece acceso anticipado, una degustación exclusiva por temporada, envíos incluidos y beneficios VIP.
La tienda está en Plaza San Miguel, Av. de la Marina 21, Lima. Atiende de lunes a sábado, de 8:00 a.m. a 8:00 p.m.
No inventes disponibilidad, ingredientes, descuentos ni políticas. Si no tienes un dato, dilo claramente y ofrece ayudar con el catálogo, la membresía o la ubicación.`;

export async function handleBaristaChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return Response.json({ message: "El asistente no está configurado por el momento." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "No pudimos leer tu mensaje." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ message: "La conversación enviada no es válida." }, { status: 400 });
  }

  const messages = parsed.data.messages as UIMessage[];
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: BARISTA_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true }),
    runIdFetch,
  );
}