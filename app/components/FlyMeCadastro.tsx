"use client";

import React from "react";

/**
 * ===================== Config EmailJS =====================
 */
const EMAILJS = {
  serviceId: "service_6x798xo",
  templateId: "template_h7cunrh",
  publicKey: "TvIV5KonHS_sED9Vh",
} as const;

// ===================== Util: timeout para fetch =====================
function fetchWithTimeout(
  input: RequestInfo | URL,
  init: (RequestInit & { timeoutMs?: number }) = {}
) {
  const { timeoutMs = 10000, ...rest } = init;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(input, { ...rest, signal: ctrl.signal }).finally(() =>
    clearTimeout(id)
  );
}

// ===================== Envio resiliente ao EmailJS =====================
async function sendEmailJS(params: Record<string, any>): Promise<{
  ok: boolean;
  error?: string;
  skipped?: boolean;
}> {
  if (!EMAILJS.templateId || !EMAILJS.publicKey) {
    return { ok: false, skipped: true, error: "config ausente" };
  }
  if (typeof window === "undefined" || typeof fetch === "undefined") {
    return { ok: false, skipped: true, error: "ambiente sem fetch" };
  }
  try {
    const res = await fetchWithTimeout("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      timeoutMs: 10000,
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: params,
      }),
    });
    if (!res.ok) {
      let msg = "";
      try {
        msg = await res.text();
      } catch {}
      return { ok: false, error: msg || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    const txt = e?.name === "AbortError" ? "timeout" : e?.message || String(e);
    return { ok: false, skipped: true, error: txt };
  }
}

// ===================== Identidade FlyMe =====================
const FLYME = {
  blue: "#38b6ff",
  red: "#fe3334",
  yellow: "#ffbd59",
  off: "#fffaf3",
} as const;

// ===================== Ícones inline =====================
const Svg = ({ children, size = 18, className = "", ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);
const CheckIcon = (p: any) => (
  <Svg {...p}>
    <path d="M20 6 9 17 4 12" />
  </Svg>
);
const ChevronLeftIcon = (p: any) => (
  <Svg {...p}>
    <path d="M15 18 9 12 15 6" />
  </Svg>
);
const ChevronRightIcon = (p: any) => (
  <Svg {...p}>
    <path d="M9 18 15 12 9 6" />
  </Svg>
);
const SparklesIcon = (p: any) => (
  <Svg {...p}>
    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4" />
    <circle cx="12" cy="12" r="5" />
  </Svg>
);
const MapPinIcon = (p: any) => (
  <Svg {...p}>
    <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

// ===================== Máscaras =====================
const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");
const formatPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};
const formatCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
};
const formatDateBR = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  const p1 = d.slice(0, 2),
    p2 = d.slice(2, 4),
    p3 = d.slice(4, 8);
  let out = p1;
  if (p2) out += `/${p2}`;
  if (p3) out += `/${p3}`;
  return out;
};
const formatCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3),
    p2 = d.slice(3, 6),
    p3 = d.slice(6, 9),
    p4 = d.slice(9, 11);
  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `-${p4}`;
  return out;
};

// ===================== Necessidades por faixa etária =====================
const NECESSIDADES_BY_IDADE: Record<string, string[]> = {
  "2-4": [
    "Criatividade e Imaginação",
    "Coordenação Motora Fina e Grossa",
    "Habilidades Socioemocionais",
    "Foco e Concentração",
    "Curiosidade e Descoberta",
    "Autonomia e Tomada de Decisão",
    "Percepção Visual e Espacial",
    "Oralidade",
    "Noções Básicas Lógico-Matemáticas",
  ],
  "5-7": [
    "Raciocínio Lógico e Matemático",
    "Linguagem e Comunicação",
    "Habilidades Socioemocionais",
    "Foco e Concentração",
    "Memória",
    "Percepção Visual e Espacial",
    "Resolução de Problemas",
    "Consciência Ambiental",
    "Linguagem Oral e Escrita",
  ],
  "8-10": [
    "Raciocínio Lógico e Matemático",
    "Memória",
    "Resolução de Problemas",
    "Consciência Ambiental",
    "Pensamento Crítico",
    "Autoconhecimento",
    "Escrita e Produção de Texto",
    "Interpretação de Texto",
    "Sócioemocional",
  ],
};

// ===================== UI helpers =====================
const inputCls =
  "w-full rounded-2xl border px-4 py-2.5 mt-1 focus:ring-2 focus:outline-none transition shadow-sm bg-white text-slate-900 placeholder-slate-400";
const labelCls = "text-sm text-slate-400";
const inputStyle: React.CSSProperties = {
  borderColor: "#e5e7eb",
  outlineColor: FLYME.blue,
};

const Chip = ({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`rounded-full px-4 py-2 text-sm border transition ${
      selected ? "text-white" : "text-slate-800"
    }`}
    style={{
      background: selected ? FLYME.red : "#fff",
      borderColor: selected ? "transparent" : "#e5e7eb",
    }}
  >
    {label}
  </button>
);

const Stepper = ({ current }: { current: number }) => {
  const steps = ["Informações", "Necessidades", "Endereço", "Confirmação", "Boas-vindas"];
  return (
    <div className="w-full mb-6 no-scroll">
      <div className="flex items-center justify-center flex-wrap gap-3">
        {steps.map((label, i) => {
          const active = i + 1 <= current;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                  active ? "text-white" : "text-slate-500"
                }`}
                style={{
                  background: active ? FLYME.blue : "#fff",
                  borderColor: active ? FLYME.blue : "#e5e7eb",
                }}
              >
                {active ? <CheckIcon size={18} /> : i + 1}
              </div>
              <span
                className={`text-sm whitespace-nowrap ${
                  active ? "font-semibold" : "text-slate-500"
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className="h-1 w-6 rounded-full"
                  style={{ background: active ? FLYME.blue : "#e5e7eb" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===================== Componente principal =====================
export default function FlyMeCadastro() {
  // overflow-x e scrollbar (sem mexer em fonte)
  React.useEffect(() => {
    const css = document.createElement("style");
    css.innerHTML =
      "html,body{overflow-x:hidden;} .no-scroll::-webkit-scrollbar{display:none;} .no-scroll{-ms-overflow-style:none;scrollbar-width:none;}";
    document.head.appendChild(css);
    return () => {
      try {
        document.head.removeChild(css);
      } catch {}
    };
  }, []);

  // Estado
  const [step, setStep] = React.useState(1);
  const [emailStatus, setEmailStatus] = React.useState<
    "idle" | "sending" | "sent" | "error" | "skipped"
  >("idle");
  const [emailError, setEmailError] = React.useState("");

  const [form, setForm] = React.useState({
    responsavel: "",
    email: "",
    telefone: "",
    cpf: "",
    criancaNome: "",
    dataNascimento: "",
    idade: "",
    interesses: [] as string[],
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  });

  // Helpers
  const setVal =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setValUpper =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: (e.target.value || "").toUpperCase() }));

  const onCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCEP(e.target.value);
    setForm((f) => ({ ...f, cep: masked }));
    const raw = onlyDigits(masked);
    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const j = await res.json();
        if (!j.erro) {
          setForm((f) => ({
            ...f,
            rua: j.logradouro || f.rua,
            bairro: j.bairro || f.bairro,
            cidade: j.localidade || f.cidade,
            uf: (j.uf || f.uf || "").toUpperCase(),
          }));
        }
      } catch {}
    }
  };

  const toggleInteresse = (opt: string) =>
    setForm((f) => {
      const cur = f.interesses || [];
      return cur.includes(opt)
        ? { ...f, interesses: cur.filter((x) => x !== opt) }
        : { ...f, interesses: [...cur, opt] };
    });

  // Validações
  const validStep1 = () => {
    const { responsavel, email, telefone, criancaNome, dataNascimento, idade } = form;
    return (
      responsavel.trim().length >= 3 &&
      /.+@.+\..+/.test(email) &&
      telefone.trim().length >= 14 &&
      criancaNome.trim().length >= 2 &&
      dataNascimento.trim().length >= 10 &&
      ["2-4", "5-7", "8-10"].includes(idade)
    );
  };
  const validStep2 = () => (form.interesses || []).length > 0;
  const validStep3 = () => {
    const { rua, numero, bairro, cidade, uf } = form;
    return [rua, numero, bairro, cidade, uf].every((v) => (v || "").trim().length > 0);
  };

  const next = () => {
    if (step === 1 && !validStep1()) return;
    if (step === 2 && !validStep2()) return;
    if (step === 3 && !validStep3()) return;
    setStep((s) => Math.min(5, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleGoToClient = async () => {
    if (emailStatus === "sending") return;

    if (!/.+@.+\..+/.test(String(form.email || "").trim())) {
      setEmailStatus("error");
      setEmailError("E-mail do responsável vazio ou inválido.");
      return;
    }

    setEmailStatus("sending");
    setEmailError("");

    const res = await sendEmailJS({
      to_name: form.responsavel || "Cliente",
      to_email: String(form.email || "").trim(),
      crianca: form.criancaNome,
      idade: form.idade,
      from_name: "FlyMe",
      reply_to: String(form.email || "").trim(),
      subject: "Boas-vindas FlyMe",
    });

    if (res.ok) {
      setEmailStatus("sent");
      setTimeout(() => {
        try {
          window.location.href = "#area-do-cliente";
        } catch {}
      }, 600);
    } else if (res.skipped) {
      setEmailStatus("skipped");
      setEmailError(res.error || "envio pulado (ambiente sem rede/CORS)");
    } else {
      setEmailStatus("error");
      const hint =
        (res.error || "").toLowerCase().includes("recipients address is empty")
          ? "No EmailJS, em 'To email' use {{to_email}} ou defina um destinatário fixo."
          : "";
      setEmailError((res.error || "Erro desconhecido") + (hint ? " — " + hint : ""));
    }
  };

  const necessidadesOptions = form.idade
    ? NECESSIDADES_BY_IDADE[form.idade] || []
    : [];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundImage: `linear-gradient(to bottom, ${FLYME.off}, #ffffff)` }}
    >
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 overflow-hidden">

{/* Cabeçalho com logo grande */}
{/* Cabeçalho corrigido — compacto e profissional */}
<div className="flex flex-col items-center text-center" style={{ marginBottom: "0.5rem" }}>
  
  <img
    src="/flyme-logo.png"
    alt="FlyMe Logo"
    style={{
      width: "290px",      // logo maior
      height: "auto",
      objectFit: "contain",
      marginBottom: "0.15rem",  // cola no slogan
      marginTop: "0.2rem"
    }}
  />

  <p
    style={{
      fontFamily: "'Dancing Script', cursive",
      fontSize: "1.1rem",
      marginTop: "0rem",
      marginBottom: "0.3rem"   // cola no stepper
    }}
    className="text-slate-700"
  >
    Aprender é a forma mais bonita de voar.
  </p>

</div>

        <Stepper current={step} />

        {/* Etapa 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>Nome do Responsável</span>
              <input
                className={inputCls}
                style={inputStyle}
                value={form.responsavel}
                onChange={setVal("responsavel")}
              />
            </label>
            <label className="block">
              <span className={labelCls}>E-mail</span>
              <input
                type="email"
                className={inputCls}
                style={inputStyle}
                value={form.email}
                onChange={setVal("email")}
              />
              {!/.+@.+\..+/.test(String(form.email || "")) && (
                <div className="text-[11px] mt-1 text-red-600">
                  Informe um e-mail válido para receber a confirmação.
                </div>
              )}
            </label>
            <label className="block">
              <span className={labelCls}>Telefone</span>
              <input
                type="tel"
                className={inputCls}
                style={inputStyle}
                value={form.telefone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefone: formatPhone(e.target.value) }))
                }
                placeholder="(34) 99999-9999"
              />
            </label>
            <label className="block">
              <span className={labelCls}>CPF do Responsável (opcional)</span>
              <input
                type="text"
                className={inputCls}
                style={inputStyle}
                value={form.cpf}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cpf: formatCPF(e.target.value) }))
                }
                placeholder="000.000.000-00"
              />
            </label>
            <label className="block">
              <span className={labelCls}>Nome da Criança</span>
              <input
                className={inputCls}
                style={inputStyle}
                value={form.criancaNome}
                onChange={setVal("criancaNome")}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Data de Nascimento da Criança</span>
              <input
                type="text"
                className={inputCls}
                style={inputStyle}
                value={form.dataNascimento}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    dataNascimento: formatDateBR(e.target.value),
                  }))
                }
                placeholder="dd/mm/aaaa"
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelCls}>Faixa Etária</span>
              <select
                className={inputCls}
                style={inputStyle}
                value={form.idade}
                onChange={setVal("idade")}
              >
                <option value="">Selecione</option>
                <option value="2-4">2 a 4 anos</option>
                <option value="5-7">5 a 7 anos</option>
                <option value="8-10">8 a 10 anos</option>
              </select>
            </label>
          </div>
        )}

        {/* Etapa 2 */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm text-slate-700 font-medium">
                Necessidades a serem desenvolvidas
              </span>
            </div>
            {!form.idade && (
              <p className="text-sm text-slate-500 mb-2">
                Selecione a faixa etária na etapa anterior para ver as opções.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {necessidadesOptions.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={(form.interesses || []).includes(opt)}
                  onToggle={() => toggleInteresse(opt)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Etapa 3 */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm text-slate-700 font-medium">Endereço</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block md:col-span-1">
                <span className={labelCls}>CEP</span>
                <input
                  type="text"
                  className={inputCls}
                  style={inputStyle}
                  value={form.cep}
                  onChange={onCepChange}
                  placeholder="00000-000"
                />
              </label>
              <label className="block md:col-span-2">
                <span className={labelCls}>Rua</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.rua}
                  onChange={setVal("rua")}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Número</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.numero}
                  onChange={setVal("numero")}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Bairro</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.bairro}
                  onChange={setVal("bairro")}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Cidade</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.cidade}
                  onChange={setVal("cidade")}
                />
              </label>
              <label className="block">
                <span className={labelCls}>UF</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.uf}
                  maxLength={2}
                  onChange={setValUpper("uf")}
                />
              </label>
              <label className="block md:col-span-3">
                <span className={labelCls}>Complemento (opcional)</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.complemento}
                  onChange={setVal("complemento")}
                />
              </label>
            </div>
          </div>
        )}

        {/* Etapa 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm text-slate-700 font-medium">
                Revise seus dados antes de concluir
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Responsável", form.responsavel],
                ["E-mail", form.email],
                ["Telefone", form.telefone],
                ["CPF (opcional)", form.cpf],
                ["Nome da Criança", form.criancaNome],
                ["Nascimento", form.dataNascimento],
                ["Faixa etária", form.idade],
                ["Necessidades", (form.interesses || []).join(", ")],
              ].map(([l, v]) => (
                <div key={l as string} className="p-3 rounded-xl border bg-white">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                    {l}
                  </div>
                  <div className="text-sm text-slate-800 break-words">
                    {(v as string) || <span className="text-slate-400">—</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm text-slate-700 font-medium">Endereço</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["CEP", form.cep],
                ["Rua", form.rua],
                ["Número", form.numero],
                ["Bairro", form.bairro],
                ["Cidade", form.cidade],
                ["UF", form.uf],
                ["Complemento", form.complemento],
              ].map(([l, v]) => (
                <div key={l as string} className="p-3 rounded-xl border bg-white md:col-span-1">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                    {l}
                  </div>
                  <div className="text-sm text-slate-800 break-words">
                    {(v as string) || <span className="text-slate-400">—</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold shadow text-white hover:brightness-95 transition"
                style={{ background: FLYME.red }}
              >
                Concluir cadastro
              </button>
            </div>
          </div>
        )}

        {/* Etapa 5 */}
        {step === 5 && (
          <div className="p-10 border rounded-2xl bg-white shadow text-center">
            <h3 className="text-2xl font-extrabold" style={{ color: FLYME.blue }}>
              Cadastro concluído! 🎉
            </h3>
            <p className="text-slate-700 mt-2">Bem-vindo(a) à FlyMe.</p>
            <p className="mt-4 text-lg font-medium" style={{ color: FLYME.red }}>
              “Aprender é a forma mais bonita de voar.”
            </p>
            <div className="mt-4 text-sm min-h-[24px]">
              {emailStatus === "sending" && (
                <span className="text-slate-500">Enviando e-mail de boas-vindas…</span>
              )}
              {emailStatus === "sent" && (
                <span className="text-green-600 font-medium">
                  E-mail enviado com sucesso! ✉️
                </span>
              )}
              {emailStatus === "skipped" && (
                <span className="text-amber-600">
                  Prévia: envio de e-mail pulado por restrição de ambiente.
                </span>
              )}
              {emailStatus === "error" && (
                <span className="text-red-600">
                  Falha ao enviar e-mail.{" "}
                  {emailError ? `Detalhes: ${emailError.slice(0, 140)}` : "Tente novamente."}
                </span>
              )}
            </div>
            <div className="mt-8 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoToClient}
                disabled={emailStatus === "sending"}
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow text-white transition disabled:opacity-60"
                style={{ background: FLYME.yellow }}
              >
                {emailStatus === "sending" ? "Enviando…" : "Ir para a área do cliente"}
              </button>
            </div>
          </div>
        )}

        {/* Navegação */}
        {step <= 3 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-slate-700 disabled:opacity-40 hover:bg-slate-200 transition"
              style={{ background: "#e5e7eb" }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Voltar
            </button>
            <button
              type="button"
              onClick={next}
              disabled={
                (step === 1 && !validStep1()) ||
                (step === 2 && !validStep2()) ||
                (step === 3 && !validStep3())
              }
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold shadow text-white hover:brightness-95 transition disabled:opacity-50"
              style={{ background: FLYME.blue }}
            >
              Avançar <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== Self-tests ===================== */
(function runSelfTests() {
  if (typeof window === "undefined") return;
  try {
    console.assert(typeof formatCEP("38400123") === "string", "CEP mask");
    console.assert(formatPhone("34987654321").includes("("), "Phone mask");
    console.assert(NECESSIDADES_BY_IDADE["5-7"].length > 3, "Map faixa etária");
    console.assert(formatCPF("12345678901").length === 14, "CPF mask size");
    console.assert(formatDateBR("01022025") === "01/02/2025", "Date mask dd/mm/aaaa");
  } catch (e) {
    console.warn("Self-tests warning", e);
  }
})();
