"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sent">("idle");

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <span className="blob" style={{ left: "10%", top: "-40px", width: 280, height: 280, background: "#fbe9a5" }} />
      <span className="blob" style={{ right: "8%", bottom: "-60px", width: 260, height: 260, background: "#f3c6c2" }} />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft sm:p-12 lg:p-16">
          <div className="max-w-xl">
            <Reveal>
              <p className="eyebrow-squiggle mb-3 inline-flex flex-col text-xs uppercase tracking-[0.25em] text-ink-700">
                Semi-weekly newsletter
              </p>
              <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
                Subscribe to <em className="italic">StudyPuff news</em>.
              </h2>
              <p className="mt-5 text-lg text-ink-700">
                Join the semi-weekly email newsletter to get practical study and productivity
                tips that help you stay focused and get more done.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <form
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setState("sent");
                }}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  required
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-ink-900/15 bg-white px-6 py-4 text-base outline-none transition focus:border-ink-900/40"
                />
                <button className="btn-primary" type="submit">
                  {state === "sent" ? "You're in ✨" : "Sign me up"}
                </button>
              </form>
              {state === "sent" && (
                <p className="mt-3 text-sm text-ink-700">
                  Thanks — keep an eye on your inbox for the first letter.
                </p>
              )}
              <p className="mt-4 text-xs text-ink-700">
                By submitting this form, you will receive our free newsletter. We may also send
                you other emails about StudyPuff resources and projects. You can opt-out at any
                time.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
