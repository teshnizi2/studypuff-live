"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SheepMascot from "@/components/SheepMascot";

const REASONS = [
  "Workshop questions",
  "Order or shipping",
  "Press & partnerships",
  "I just want to say hi"
];

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    topic: REASONS[0],
    message: ""
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const onChange =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "We'd love to know your name.";
    if (!form.email.includes("@")) next.email = "That email looks off.";
    if (form.message.trim().length < 10)
      next.message = "A little more context would help us respond.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact · 3-workday response"
        title="Workshops, scholarship requests, press, partnerships, or just a kind note."
        subtitle="Email us at info@studypuff.com or send a message below — we'll get back to you within three workdays."
        accent="sky"
      />

      <section className="relative pb-24">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-10">
          {/* Form card */}
          <Reveal className="lg:col-span-7">
            <div className="rounded-3xl border border-ink-900/10 bg-cream-50 p-8 shadow-soft sm:p-10">
              {sent ? (
                <div className="flex flex-col items-center gap-6 py-10 text-center">
                  <SheepMascot tone="mint" className="h-40 w-40 animate-bobble" />
                  <h2 className="display-heading text-3xl text-ink-900">
                    Thanks, {form.name.split(" ")[0] || "friend"}!
                  </h2>
                  <p className="max-w-md text-ink-700">
                    Your message landed safely. We&apos;ll write back within three workdays —
                    usually much sooner.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", topic: REASONS[0], message: "" });
                    }}
                    className="btn-outline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Your name" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={onChange("name")}
                        className="field"
                        placeholder="Ada Lovelace"
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={onChange("email")}
                        className="field"
                        placeholder="you@school.edu"
                      />
                    </Field>
                  </div>
                  <Field label="What's this about?">
                    <select
                      value={form.topic}
                      onChange={onChange("topic")}
                      className="field"
                    >
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Message" error={errors.message}>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={onChange("message")}
                      className="field resize-none"
                      placeholder="Tell us a bit about what you're working on…"
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-ink-700">
                      By sending, you agree to our (imaginary) privacy policy.
                    </p>
                    <button className="btn-primary" type="submit">
                      Send message <span aria-hidden>→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Side info */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <div className="rounded-3xl border border-ink-900/10 bg-brand-butter p-8">
                <h3 className="font-display text-xl text-ink-900">Email us directly</h3>
                <p className="mt-2 text-ink-900/80">
                  <a href="mailto:info@studypuff.com" className="underline underline-offset-4">
                    info@studypuff.com
                  </a>
                </p>
                <p className="mt-3 text-sm text-ink-900/70">
                  We aim to reply within three workdays.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-3xl border border-ink-900/10 bg-brand-pink p-8">
                <h3 className="font-display text-xl text-ink-900">The quick answers</h3>
                <ul className="mt-3 space-y-2 text-ink-900/80">
                  <li>· Workshops, scholarship requests, press, partnerships, or just a kind note.</li>
                  <li>· Livestreams are always free.</li>
                  <li>· Workshops run monthly — small cohorts only (30 max).</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="rounded-3xl border border-ink-900/10 bg-brand-sky p-8">
                <h3 className="font-display text-xl text-ink-900">Find us elsewhere</h3>
                <ul className="mt-3 space-y-2 text-ink-900/80">
                  <li>
                    🎥{" "}
                    <a
                      href="https://www.youtube.com/@StudyPuffAcademy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      YouTube — StudyPuffAcademy
                    </a>
                  </li>
                  <li>
                    💜{" "}
                    <a
                      href="https://www.twitch.tv/studypuffacademy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      Twitch — StudyPuffAcademy
                    </a>
                  </li>
                  <li>
                    📷{" "}
                    <a
                      href="https://www.instagram.com/studypuffacademy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      Instagram — @studypuffacademy
                    </a>
                  </li>
                  <li>
                    💬{" "}
                    <a
                      href="https://discord.gg/hb8bKpbjEz"
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      Discord — StudyPuffAcademy
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
