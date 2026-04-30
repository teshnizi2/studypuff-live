import Link from "next/link";
import { MessageCircle } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const REQUEST_FORM = "https://forms.gle/xKZnXvzZUKL843D5A";

const RESOURCES: { title: string; body: string; tone: string }[] = [
  {
    title: "Cornell Note Taking Template",
    body: "Turn note-taking into a way to already get a deeper understanding of the material and actually remember what the content was about.",
    tone: "bg-brand-pink"
  },
  {
    title: "Planning Fallacy Test",
    body: "Discover how well you can plan tasks by comparing your optimistic, intuitive prediction of how long a task will take, to how long it takes in reality.",
    tone: "bg-brand-butter"
  },
  {
    title: "Urgent-Important Matrix",
    body: "A productivity tool that prioritizes tasks by assessing urgency and importance, helping you move from reactive firefighting to proactive, strategic work.",
    tone: "bg-brand-mint"
  },
  {
    title: "Starting Ritual",
    body: "Works as a mental cue or ignition switch that signals to your brain that it is time to shift from rest or distraction into focused action.",
    tone: "bg-brand-sky"
  },
  {
    title: "Task Chunking",
    body: "Breaking large, overwhelming projects into smaller, manageable, and actionable steps.",
    tone: "bg-brand-lilac"
  },
  {
    title: "Task List",
    body: "Organize your tasks in different lists.",
    tone: "bg-brand-peach"
  },
  {
    title: "Monthly Task List",
    body: "Organize your monthly tasks in different lists.",
    tone: "bg-brand-pink"
  },
  {
    title: "Weekly Planning Ritual",
    body: "A dedicated, recurring time (often on Sunday or Monday) to review the past week, set goals, and map out study tasks, classes, and breaks for the week ahead.",
    tone: "bg-brand-butter"
  },
  {
    title: "Course Overview",
    body: "Centralized, organized system that outlines all academic tasks for a block or semester in one place.",
    tone: "bg-brand-mint"
  },
  {
    title: "Assignment Tracker",
    body: "Centralized, organized system that outlines all academic tasks for a block or semester in one place.",
    tone: "bg-brand-sky"
  },
  {
    title: "Pomodoro Tracker",
    body: "A time-management tool used to boost focus and productivity by breaking work into high-intensity intervals (called pomodoros) separated by short breaks.",
    tone: "bg-brand-lilac"
  },
  {
    title: "Deep Focus Log",
    body: "Logging how well you were able to focus on a specific task, and analysing what improved or decreased your focus.",
    tone: "bg-brand-peach"
  },
  {
    title: "Motivation Log",
    body: "Turning abstract tasks into more personal goals, making it more clear why you're actually doing them.",
    tone: "bg-brand-pink"
  }
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Free resources"
        title="Tools for a calmer term."
        subtitle="Free printables, templates, and rituals you can request and use. Made with love, backed by research."
        accent="mint"
      />

      <section className="relative pb-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 60}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl ${r.tone} p-6 transition hover:-translate-y-1 hover:shadow-soft`}
                >
                  <h3 className="font-display text-xl text-ink-900">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-900/80">{r.body}</p>
                  <a
                    href={REQUEST_FORM}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream-50 hover:bg-ink-700"
                  >
                    Request the PDF
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <a
              href="https://discord.gg/hb8bKpbjEz"
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-peach p-6 transition hover:-translate-y-1 hover:shadow-soft sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50/70 text-emerald-800">
                  <MessageCircle className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <span className="rounded-full bg-cream-50/70 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-ink-900">
                    Community · Free
                  </span>
                  <h3 className="mt-2 font-display text-2xl text-ink-900">Join the Discord</h3>
                  <p className="text-sm text-ink-900/80">
                    Hang out with other StudyPuffs between livestreams. Share wins, ask for
                    accountability, find a study buddy.
                  </p>
                </div>
              </div>
              <span className="btn-primary">
                Open Discord <span aria-hidden>→</span>
              </span>
            </a>
          </Reveal>

          <Reveal className="mt-12 rounded-[28px] border border-ink-900/10 bg-cream-50 p-8 text-center shadow-soft">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">Looking for more?</p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Paid workshops go deeper, faster.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-700">
              Our cohorts take these free tools and build a full practice around them — with peer
              accountability and coach feedback.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/workshops" className="btn-primary">
                See workshops
              </Link>
              <Link href="/contact" className="btn-outline">
                Ask a question
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
