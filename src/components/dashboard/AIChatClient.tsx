'use client';

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/actions/ai";
import { Send, Bot, User, Loader2, Lightbulb, TrendingUp, Package, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

interface AIChatClientProps {
  locale: string;
  userName: string;
  context: string;
}

const suggestedQuestions = [
  { icon: Package, text: "What should I produce tomorrow?" },
  { icon: IndianRupee, text: "Which customer owes the most?" },
  { icon: TrendingUp, text: "Why did my sales drop?" },
  { icon: Lightbulb, text: "Which product is most profitable?" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatClient({ locale, userName, context }: AIChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${userName}! I'm MithasAI, your business assistant. Ask me anything about your inventory, sales, customers, or production. Here are some things I can help with:`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const result = await askAI(userMsg, context);
    setMessages((prev) => [...prev, { role: "assistant", content: result.answer }]);
    setLoading(false);
  }

  async function handleSuggestion(question: string) {
    if (loading) return;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    const result = await askAI(question, context);
    setMessages((prev) => [...prev, { role: "assistant", content: result.answer }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">AI Business Assistant</h1>
        <p className="text-gray-600">Ask MithasAI about your business</p>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 p-4 space-y-4"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-[#E85D04] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-gray-50 text-gray-800 rounded-tl-none"
                  : "bg-[#E85D04] text-white rounded-tr-none"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        {/* Suggested questions (only shown after welcome message) */}
        {messages.length === 1 && (
          <div className="grid sm:grid-cols-2 gap-2 mt-4">
            {suggestedQuestions.map((q, i) => {
              const Icon = q.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q.text)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#E85D04]/30 hover:bg-[#FFF8F0] transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#E85D04]" />
                  </div>
                  <span className="text-sm text-gray-700">{q.text}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your business..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-3 rounded-xl bg-[#E85D04] text-white hover:bg-[#D00000] transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
