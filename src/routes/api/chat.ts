import { createFileRoute } from "@tanstack/react-router";
import { handleBaristaChat } from "@/lib/barista-chat.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => handleBaristaChat(request),
    },
  },
});