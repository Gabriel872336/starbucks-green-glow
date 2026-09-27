import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Bot, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "starbucks-peru-barista-messages";
const suggestions = ["Recomiéndame un café", "¿Cómo funciona la membresía?"];

function BaristaMark() {
  return <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-display text-lg font-semibold text-forest" aria-hidden="true">B</span>;
}

export function BaristaChat() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, error, setMessages, clearError } = useChat({
    id: "starbucks-virtual-barista",
    transport,
    onFinish: () => window.setTimeout(() => inputRef.current?.focus(), 0),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved) as UIMessage[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, [setMessages]);

  useEffect(() => {
    if (hydrated && status !== "submitted") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [hydrated, messages, status]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const submitText = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;
    clearError();
    void sendMessage({ text: clean });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [busy, clearError, sendMessage]);

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    submitText(message.text);
  }, [submitText]);

  return <>
    {open && <section role="dialog" aria-modal="false" aria-labelledby="barista-title" className="fixed bottom-24 right-4 z-50 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:right-6">
      <header className="flex items-center gap-3 bg-forest px-5 py-4 text-primary-foreground">
        <BaristaMark />
        <div className="min-w-0 flex-1"><h2 id="barista-title" className="font-display text-xl font-semibold">Barista Virtual</h2><p className="text-xs text-primary-foreground/70">Asistente Starbucks</p></div>
        <Button variant="ghost" size="icon" aria-label="Cerrar asistente" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setOpen(false)}><X /></Button>
      </header>

      <Conversation className="min-h-0 bg-cream">
        <ConversationContent className="gap-5 px-4 py-5">
          <Message from="assistant">
            <div className="mb-1 flex items-center gap-2"><BaristaMark /><span className="text-xs font-bold uppercase text-primary">Barista Virtual</span></div>
            <MessageContent><p>¡Hola! Puedo ayudarte a elegir un café, encontrar un regalo o conocer los beneficios de la membresía.</p></MessageContent>
          </Message>
          {messages.map((message) => <Message key={message.id} from={message.role}>
            <MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : undefined}>
              {message.parts.map((part, index) => part.type === "text" ? <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse> : null)}
            </MessageContent>
          </Message>)}
          {status === "submitted" && <Message from="assistant"><MessageContent><Shimmer className="text-primary">Preparando una recomendación…</Shimmer></MessageContent></Message>}
          {error && <div role="alert" className="rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm text-destructive">{error.message || "No pudimos responder en este momento. Inténtalo nuevamente."}</div>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-card p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((suggestion) => <Button key={suggestion} type="button" variant="outline" size="sm" disabled={busy} className="shrink-0" onClick={() => submitText(suggestion)}>{suggestion}</Button>)}
        </div>
        <PromptInput onSubmit={handleSubmit} className="[&_[data-slot=input-group]]:bg-background">
          <PromptInputTextarea ref={inputRef} name="message" placeholder="Escribe tu consulta…" disabled={busy} className="min-h-20" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!hydrated} onStop={stop} aria-label={busy ? "Detener respuesta" : "Enviar mensaje"} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </section>}
    <Button type="button" size="icon" aria-label={open ? "Cerrar Barista Virtual" : "Abrir Barista Virtual"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-50 size-14 bg-primary text-primary-foreground shadow-xl hover:bg-forest sm:right-6">
      {open ? <X className="size-6" /> : <Bot className="size-7" />}
    </Button>
  </>;
}