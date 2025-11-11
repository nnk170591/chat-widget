"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { MessageBubble, ChatMessage } from "./MessageBubble";
import { cn } from "@/lib/utils";

const apiBase =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "") || "";
const apiPath =
  (process.env.NEXT_PUBLIC_CHAT_PATH || "/api/chat").replace(/^\/?/, "/");

const widgetTitle =
  process.env.NEXT_PUBLIC_CHAT_TITLE || "YourCompany Assistant";
const widgetSubtitle =
  process.env.NEXT_PUBLIC_CHAT_SUBTITLE ||
  "Ask anything about our services, pricing, or products.";
const widgetGreeting =
  process.env.NEXT_PUBLIC_CHAT_GREETING ||
  "Hi there! I’m your AI assistant. How can I help you today?";

const buildEndpoint = () => {
  if (!apiBase) return apiPath;
  return `${apiBase}${apiPath}`;
};

const endpoint = buildEndpoint();

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "greeting",
      role: "assistant",
      text: widgetGreeting,
    },
  ]);
  const [conversationId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`
  );

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue.trim();
    setInputValue("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
    };

    const optimisticMessages = [...messages, userMessage];
    setMessages(optimisticMessages);
    setIsSending(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: userText,
          history: optimisticMessages.map((msg) => ({
            role: msg.role,
            content: msg.text,
            images: msg.images,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        data.replyText ||
        data.reply ||
        data.message ||
        data.content ||
        "Thanks for reaching out!";
      const images =
        data.images ||
        data.imageUrls ||
        (Array.isArray(data.media)
          ? data.media.filter((url: unknown) => typeof url === "string")
          : undefined);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: replyText,
        images,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text:
            "I hit a snag while reaching the server. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [conversationId, inputValue, isSending, messages]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      requestAnimationFrame(() => {
        listRef.current?.focus();
      });
    }
  }, [isOpen]);

  const showLauncher = useMemo(() => !isOpen, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {showLauncher && (
          <motion.button
            key="launcher"
            type="button"
            onClick={toggleOpen}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl transition hover:shadow-emerald-500/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            aria-label="Open chat widget"
          >
            <MessageCircle className="h-7 w-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="widget"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 250 }}
            className="fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:bottom-6 md:right-6"
          >
            <header className="flex items-start justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-white">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70">
                  AI Concierge
                </p>
                <h2 className="text-lg font-semibold">{widgetTitle}</h2>
                <p className="text-sm text-white/80">{widgetSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={toggleOpen}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Close chat widget"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div
              ref={listRef}
              tabIndex={-1}
              className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto bg-slate-50 px-4 py-5"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600 border-opacity-60" />
                  <span>Composing a reply...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-2">
                <textarea
                  value={inputValue}
                  rows={1}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about pricing, docs, or anything else..."
                  className="min-h-[44px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
                  disabled={isSending}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200",
                    (!inputValue.trim() || isSending) &&
                      "cursor-not-allowed opacity-60"
                  )}
                  aria-label="Send message"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-slate-500">
                Powered by Google Gemini File Search • Secure & private
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
