import { useState, useRef, useEffect } from "react";
import T from "../i18n/translations";
import { getAnswer } from "../i18n/faq";
import { LANGUAGES } from "../i18n/translations";

const SUGGESTED = {
  en: ["What is SIP?", "NIFTY explained?", "How to save tax?", "Stock market basics?", "Emergency Fund?", "What is SENSEX?", "Crypto investing?", "Best investment 2025?"],
  hi: ["SIP क्या है?", "NIFTY क्या है?", "टैक्स कैसे बचाएं?", "शेयर बाजार?", "इमरजेंसी फंड?", "SENSEX क्या है?"],
  ta: ["SIP என்றால்?", "NIFTY என்ன?", "வரி சேமிப்பு?", "பங்கு சந்தை?", "அவசர நிதி?"],
  te: ["SIP అంటే?", "NIFTY అంటే?", "పన్ను ఆదా?", "స్టాక్ మార్కెట్?", "అత్యవసర నిధి?"],
  kn: ["SIP ಅಂದರೆ?", "NIFTY ಎಂದರೇನು?", "ತೆರಿಗೆ ಉಳಿತಾಯ?", "ಷೇರು ಮಾರುಕಟ್ಟೆ?"],
  bn: ["SIP কী?", "NIFTY কী?", "কর বাঁচান?", "শেয়ার বাজার?"],
  mr: ["SIP म्हणजे?", "NIFTY म्हणजे?", "कर बचत?", "शेअर बाजार?"],
};

const FALLBACK = {
  en: "🤔 I don't have a specific answer for that yet. Try asking about: **SIP**, **NIFTY**, **SENSEX**, **mutual funds**, **PPF**, **gold**, **emergency fund**, **insurance**, **stocks**, **tax saving**, or **how to start investing**!",
  hi: "🤔 इसका जवाब मुझे नहीं पता। पूछें: **SIP**, **NIFTY**, **म्यूचुअल फंड**, **PPF**, **इमरजेंसी फंड**, **बीमा**, **टैक्स बचत**!",
  ta: "🤔 தெரியவில்லை. கேளுங்கள்: **SIP**, **NIFTY**, **மியூச்சுவல் ஃபண்ட்**, **PPF**, **தங்கம்**!",
  te: "🤔 తెలియదు. అడగండి: **SIP**, **NIFTY**, **మ్యూచువల్ ఫండ్**, **PPF**, **బంగారం**!",
  kn: "🤔 ಗೊತ್ತಿಲ್ಲ. ಕೇಳಿ: **SIP**, **NIFTY**, **ಮ್ಯೂಚುಯಲ್ ಫಂಡ್**, **PPF**, **ಚಿನ್ನ**!",
  bn: "🤔 জানি না। জিজ্ঞেস করুন: **SIP**, **NIFTY**, **মিউচুয়াল ফান্ড**, **PPF**, **সোনা**!",
  mr: "🤔 माहित नाही. विचारा: **SIP**, **NIFTY**, **म्युच्युअल फंड**, **PPF**, **सोने**!",
};

/* ── Rich message renderer ─────────────────── */
function RichMsg({ text }) {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 4 }} />;

        // numbered list
        const numMatch = line.match(/^(\d+)\.\s*(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg"
                 style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: "rgba(99,102,241,0.5)", color: "#fff" }}>{numMatch[1]}</span>
              <span className="text-xs text-white/80">{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // heading line (starts with emoji + space)
        if (/^[\u{1F300}-\u{1FFFF}]/u.test(line) && line.includes("**")) {
          return (
            <div key={i} className="font-black text-xs px-1 py-0.5" style={{ color: "#f59e0b" }}>
              {renderInline(line)}
            </div>
          );
        }

        return <div key={i} className="text-xs text-white/80 leading-relaxed px-1">{renderInline(line)}</div>;
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <span key={i} className="font-black px-0.5 rounded" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.1)" }}>
          {p.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export default function ChatBot({ lang = "en", onLangChange }) {
  const [open,     setOpen]     = useState(false);
  const [msgs,     setMsgs]     = useState([]);
  const [input,    setInput]    = useState("");
  const [thinking, setThinking] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "bot", text: T.chatGreeting[lang] || T.chatGreeting.en }]);
    }
  }, [open, lang]);

  useEffect(() => {
    if (msgs.length > 0) {
      setMsgs([{ role: "bot", text: T.chatGreeting[lang] || T.chatGreeting.en }]);
    }
  }, [lang]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    setThinking(true);
    setTimeout(() => {
      const ans = getAnswer(q, lang) || FALLBACK[lang] || FALLBACK.en;
      setMsgs(p => [...p, { role: "bot", text: ans }]);
      setThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 600 + Math.random() * 500);
  };

  const t = (key) => T[key]?.[lang] || T[key]?.en || key;

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-all hover:scale-110 animate-borderGlow"
        style={{
          background: open ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
          boxShadow: open ? "0 8px 32px rgba(239,68,68,0.5)" : "0 8px 32px rgba(99,102,241,0.55)",
        }}
        title="AI Financial Assistant"
      >
        {open ? "✕" : "🤖"}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 animate-liveBlink text-xs flex items-center justify-center font-black text-black">
            AI
          </span>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed bottom-28 right-4 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-slideUp"
          style={{
            width: "min(440px, calc(100vw - 2rem))",
            height: "min(640px, calc(100vh - 8rem))",
            background: "rgba(8,6,28,0.98)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(99,102,241,0.45)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.15)",
          }}
        >
          {/* gradient top bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg,#6366f1,#f59e0b,#10b981,#6366f1)", backgroundSize: "300% auto", animation: "gradientFlow 3s ease infinite" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
               style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.2),rgba(245,158,11,0.1))", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg animate-waveFloat"
                   style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                🤖
              </div>
              <div>
                <div className="text-white font-black text-sm">{t("chatTitle")}</div>
                <div className="flex items-center gap-1.5">
                  <span className="animate-liveBlink w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <span className="text-green-400/70 text-xs font-bold">Online · Multilingual</span>
                </div>
              </div>
            </div>
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(l => !l)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition hover:scale-105"
                style={{ background: "rgba(99,102,241,0.4)", border: "1px solid rgba(99,102,241,0.5)" }}
              >
                🌐 {LANGUAGES.find(l => l.code === lang)?.native || "English"} <span className="text-white/40">▾</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-popIn"
                     style={{ background: "rgba(10,8,35,0.99)", border: "1px solid rgba(99,102,241,0.35)", minWidth: 160 }}>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { onLangChange(l.code); setLangOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-500/20 transition flex items-center justify-between"
                      style={{ color: l.code === lang ? "#f59e0b" : "rgba(255,255,255,0.7)" }}>
                      <span>{l.native}</span>
                      {l.code === lang && <span className="text-green-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5"
               style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(99,102,241,0.3) transparent" }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"} animate-slideUp`}
                   style={{ animationDelay: "0ms" }}>
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm mt-0.5"
                       style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>🤖</div>
                )}
                <div className="max-w-[82%]"
                     style={m.role === "user"
                       ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", borderRadius: "16px 16px 4px 16px", padding: "8px 12px", fontSize: "0.78rem", lineHeight: 1.5 }
                       : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "16px 16px 16px 4px", padding: "10px 12px" }
                     }
                >
                  {m.role === "user" ? m.text : <RichMsg text={m.text} />}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black mt-0.5"
                       style={{ background: "rgba(99,102,241,0.4)", color: "#fff" }}>U</div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                     style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>🤖</div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-2 h-2 rounded-full animate-bounce"
                            style={{ background: "#6366f1", animationDelay: `${d}ms` }} />
                    ))}
                    <span className="text-white/30 text-xs ml-1">thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-3 pb-2 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {(SUGGESTED[lang] || SUGGESTED.en).map(q => (
                <button key={q} onClick={() => send(q)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-white/70 transition hover:text-white hover:scale-105"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 pt-1 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("chatPlaceholder")}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 px-3 py-2.5 rounded-xl text-white text-xs placeholder-white/20 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.07)", border: input ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)", boxShadow: input ? "0 0 12px rgba(99,102,241,0.2)" : "none" }}
            />
            <button onClick={() => send()} disabled={!input.trim() || thinking}
              className="px-4 py-2.5 rounded-xl font-black text-white text-xs transition hover:scale-105 disabled:opacity-30"
              style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
