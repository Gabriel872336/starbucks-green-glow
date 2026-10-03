import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import baristaAvatar from "@/assets/barista-avatar.png";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/lib/auth";

const CHAT_KEY = "sbx-barista-chat";
const WHATSAPP_URL = "https://wa.me/51999999999";

function greeting(user: AuthUser | null): UIMessage {
  const text = user
    ? `¡Hola ${user.name}! Bienvenid@ a Starbucks Perú. ¿En qué puedo ayudarte hoy? ☕`
    : "¡Hola! Bienvenid@ a Starbucks Perú. ¿En qué te puedo ayudar hoy? ☕";
  return { id: "barista-welcome", role: "assistant", parts: [{ type: "text", text }] };
}

function loadMessages(user: AuthUser | null) {
  try {
    const stored = window.localStorage.getItem(CHAT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UIMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    window.localStorage.removeItem(CHAT_KEY);
  }
  return [greeting(user)];
}

export function BaristaChat({ user }: { user: AuthUser | null }) {
  const [open, setOpen] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  useEffect(() => setInitialMessages(loadMessages(user)), [user]);

  if (!initialMessages) return null;
  return <BaristaChatSession key={user?.email ?? "guest"} user={user} initialMessages={initialMessages} open={open} setOpen={setOpen} />;
}

function BaristaChatSession({
  user,
  initialMessages,
  open,
  setOpen,
}: {
  user: AuthUser | null;
  initialMessages: UIMessage[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, error } = useChat({
    id: "starbucks-barista",
    messages: initialMessages,
    transport,
    onError: (chatError) => toast.error(chatError.message || "No pudimos responder. Inténtalo nuevamente."),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    } catch {
      // Chat remains usable if browser storage is unavailable.
    }
  }, [messages]);

  useEffect(() => {
    if (open && !busy) textareaRef.current?.focus();
  }, [open, busy, messages.length]);

  async function handleSubmit({ text }: { text: string }) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    await sendMessage({ text: prompt });
  }

  return (
    <>
      {open && (
        <section
          aria-label="Chat con el Barista virtual"
          className="fixed bottom-24 right-3 z-50 flex h-[min(620px,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl sm:right-5"
        >
          <header className="flex min-h-18 items-center gap-3 bg-forest px-4 py-3 text-primary-foreground">
            <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-gold bg-cream">
              <img src={baristaAvatar} alt="Barista virtual" width={816} height={816} className="size-full object-cover object-top" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold">Barista virtual</h2>
              <p className="text-xs text-primary-foreground/75">Starbucks Perú · En línea</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Cerrar chat" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </header>

          <Conversation className="min-h-0 bg-cream">
            <ConversationContent className="gap-4 p-4">
              {messages.map((message) => {
                const text = message.parts.filter((part) => part.type === "text").map((part) => part.text).join("\n");
                return (
                  <Message key={message.id} from={message.role} className={message.role === "user" ? "max-w-[84%]" : "max-w-[92%]"}>
                    <MessageContent className={message.role === "user" ? "rounded-lg bg-primary px-3.5 py-2.5 text-primary-foreground" : "rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-sm"}>
                      {message.parts.map((part, index) => {
                        if (part.type === "text") return <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>;
                        return null;
                      })}
                      {message.role === "assistant" && text.includes(WHATSAPP_URL) && (
                        <Button size="sm" className="mt-2 w-fit" asChild>
                          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
                        </Button>
                      )}
                    </MessageContent>
                  </Message>
                );
              })}
              {status === "submitted" && (
                <Message from="assistant">
                  <MessageContent className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-sm">
                    <Shimmer className="text-sm">El Barista está preparando tu respuesta…</Shimmer>
                  </MessageContent>
                </Message>
              )}
              {error && <p role="alert" className="text-center text-xs text-destructive">{error.message}</p>}
            </ConversationContent>
            <ConversationScrollButton aria-label="Ir al mensaje más reciente" />
          </Conversation>

          <div className="border-t border-border bg-background p-3">
            <PromptInput onSubmit={handleSubmit} className="rounded-lg bg-card">
              <PromptInputTextarea ref={textareaRef} aria-label="Escribe tu consulta" placeholder="Escribe tu consulta…" className="min-h-14 max-h-28" disabled={busy} />
              <PromptInputFooter className="justify-end pt-0">
                <PromptInputSubmit aria-label={busy ? "Detener respuesta" : "Enviar mensaje"} status={status} onStop={stop} disabled={!busy && status === "error"} className="bg-primary text-primary-foreground hover:bg-primary/90" />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      )}

      <Button
        size="icon"
        aria-label={open ? "Cerrar Barista virtual" : "Abrir Barista virtual"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 size-16 overflow-hidden border-2 border-gold bg-forest p-0 shadow-xl hover:bg-forest hover:shadow-2xl"
        onClick={() => setOpen(!open)}
      >
        {open ? <MessageCircle className="size-7" /> : <img src={baristaAvatar} alt="" width={816} height={816} className="size-full object-cover object-top" />}
      </Button>
    </>
  );
}