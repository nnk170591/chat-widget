import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  images?: string[];
  error?: boolean;
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const markdownComponents: Components = {
  p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: (props) => {
    const { inline, children } = props as {
      inline?: boolean;
      children?: React.ReactNode;
    };

    if (inline) {
      return (
        <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.8rem] text-slate-900">
          {children}
        </code>
      );
    }

    return (
      <pre className="my-3 overflow-auto rounded-xl bg-slate-900/95 p-3 text-slate-100">
        <code>{children}</code>
      </pre>
    );
  },
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 text-sm",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="hidden sm:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white text-xs font-semibold uppercase">
          AI
        </div>
      )}
      <div className={cn("max-w-[85%] space-y-2", isUser && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-900 ring-1 ring-slate-200"
          )}
        >
          {message.error ? (
            <p className="text-sm text-red-600">
              {message.text || "Something went wrong. Please try again."}
            </p>
          ) : isUser ? (
            <p className="leading-relaxed">{message.text}</p>
          ) : (
            <div className="prose prose-slate prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!!message.images?.length && (
          <div className="grid grid-cols-2 gap-2">
            {message.images.map((src, idx) => (
              <a
                key={`${message.id}-img-${idx}`}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={src}
                  alt="Gemini response visual"
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
