"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, X, Minus } from "lucide-react";
import { Squiggle } from "./Squiggle";

type Task = { id: string; text: string; done: boolean; topic_id: string | null };
type Topic = { id: string; name: string };

type Props = {
  tasks: Task[];
  topics: Topic[];
  todayMinutes: number;
  currentTaskId: string;
  currentTopicId: string;
  onSelectTask: (taskId: string, topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onCreateTask: (form: FormData) => Promise<void>;
  onCreateTopic: (form: FormData) => Promise<void>;
  onToggleTask: (form: FormData) => Promise<void>;
  onDeleteTask: (form: FormData) => Promise<void>;
  onDeleteTopic?: (form: FormData) => Promise<void>;
};

export function TaskPanel(p: Props) {
  const router = useRouter();
  const [pending, startPending] = useTransition();

  const [newTopicName, setNewTopicName] = useState("");
  const [addingToTopic, setAddingToTopic] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());
  const [confirmingDeleteTopic, setConfirmingDeleteTopic] = useState<string | null>(null);

  const [pendingTopicName, setPendingTopicName] = useState<string | null>(null);
  const [pendingTaskText, setPendingTaskText] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingTopicName) return;
    const found = p.topics.find((t) => t.name === pendingTopicName);
    if (found) {
      p.onSelectTopic(found.id);
      setPendingTopicName(null);
    }
  }, [p, pendingTopicName]);

  useEffect(() => {
    if (!pendingTaskText) return;
    const found = p.tasks.find((t) => t.text === pendingTaskText);
    if (found) {
      p.onSelectTask(found.id, found.topic_id || "");
      setPendingTaskText(null);
    }
  }, [p, pendingTaskText]);

  const openCount = p.tasks.filter((t) => !t.done).length;
  const doneCount = p.tasks.filter((t) => t.done).length;
  const untopiced = p.tasks.filter((t) => !t.topic_id);
  const currentTask  = p.tasks.find((t) => t.id === p.currentTaskId);
  const currentTopic = p.topics.find((t) => t.id === p.currentTopicId);

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) return;
    const name = newTopicName.trim();
    setPendingTopicName(name);
    startPending(async () => {
      const fd = new FormData();
      fd.set("name", name);
      try { await p.onCreateTopic(fd); setNewTopicName(""); router.refresh(); }
      catch (err) { console.error(err); setPendingTopicName(null); }
    });
  };

  const handleCreateTask = (topicId: string | null) => {
    if (!newTaskText.trim()) return;
    const text = newTaskText.trim();
    setPendingTaskText(text);
    startPending(async () => {
      const fd = new FormData();
      fd.set("text", text);
      fd.set("priority", "normal");
      if (topicId) fd.set("topic_id", topicId);
      try { await p.onCreateTask(fd); setNewTaskText(""); setAddingToTopic(null); router.refresh(); }
      catch (err) { console.error(err); setPendingTaskText(null); }
    });
  };

  const handleToggle = (taskId: string) => {
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", taskId);
      try { await p.onToggleTask(fd); router.refresh(); } catch (err) { console.error(err); }
    });
  };

  const handleDelete = (taskId: string) => {
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", taskId);
      try {
        await p.onDeleteTask(fd);
        if (taskId === p.currentTaskId) p.onSelectTask("", "");
        router.refresh();
      } catch (err) { console.error(err); }
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    const onDeleteTopic = p.onDeleteTopic;
    if (!onDeleteTopic) return;
    setConfirmingDeleteTopic(null);
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", topicId);
      try {
        await onDeleteTopic(fd);
        if (topicId === p.currentTopicId) p.onSelectTopic("");
        router.refresh();
      } catch (err) { console.error(err); }
    });
  };

  const toggleCollapse = (id: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hours = Math.floor(p.todayMinutes / 60);
  const mins = p.todayMinutes % 60;

  return (
    <div className="relative flex flex-col gap-7">
      {/* Today header */}
      <header className="journal-rise jrise-1">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">today</p>
        <h2 className="mt-3 font-display text-[clamp(2.25rem,3.6vw,3.5rem)] leading-[1.05] text-ink-900">
          {p.todayMinutes > 0 ? (
            <>
              <em className="italic">
                {hours > 0 && <>{hours}h </>}
                {mins}m
              </em>
              <span className="text-ink-700"> of focus,</span>
              <br />
              <em className="italic">{doneCount}</em>
              <span className="text-ink-700"> task{doneCount === 1 ? "" : "s"} done.</span>
            </>
          ) : (
            <>
              <em className="italic">A fresh page.</em>
              <br />
              <span className="text-ink-700">
                {openCount} task{openCount === 1 ? "" : "s"} ahead.
              </span>
            </>
          )}
        </h2>
      </header>

      <Squiggle className="journal-rise jrise-2" />

      {/* Currently studying */}
      {(currentTask || currentTopic) && (
        <section className="journal-rise jrise-2 relative">
          <div
            aria-hidden
            className="halo-sage animate-halo absolute -inset-x-6 -inset-y-3 -z-10 rounded-full blur-3xl"
          />
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">currently</p>
          {currentTask ? (
            <p className="mt-2 font-display text-[clamp(1.5rem,2.2vw,2rem)] italic leading-tight text-ink-900">
              {currentTask.text}
            </p>
          ) : (
            <p className="mt-2 font-display text-[clamp(1.5rem,2.2vw,2rem)] italic leading-tight text-ink-900">
              {currentTopic?.name}
            </p>
          )}
          {currentTask && currentTopic && (
            <p className="mt-1 text-sm text-ink-700">
              for <span className="italic">{currentTopic.name}</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => { p.onSelectTask("", ""); p.onSelectTopic(""); }}
            className="mt-3 text-[10px] italic uppercase tracking-widest text-ink-700 underline-offset-4 transition hover:text-ink-900 hover:underline"
          >
            clear selection
          </button>
        </section>
      )}

      <Squiggle className="journal-rise jrise-3" />

      {/* Topics */}
      <section className="journal-rise jrise-3">
        <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-ink-700">topics & tasks</p>

        {p.topics.length === 0 && untopiced.length === 0 ? (
          <p className="text-base italic text-ink-700">
            No topics yet — start with one below, like <em>&ldquo;English Literature&rdquo;</em> or <em>&ldquo;Calculus.&rdquo;</em>
          </p>
        ) : (
          <div className="flex flex-col gap-7">
            {p.topics.map((topic) => (
              <TopicSection
                key={topic.id}
                topic={topic}
                tasks={p.tasks.filter((t) => t.topic_id === topic.id)}
                isCurrent={topic.id === p.currentTopicId}
                currentTaskId={p.currentTaskId}
                collapsed={collapsedTopics.has(topic.id)}
                isAddingHere={addingToTopic === topic.id}
                newTaskText={newTaskText}
                pending={pending}
                confirmingDelete={confirmingDeleteTopic === topic.id}
                onSelectTopic={() => p.onSelectTopic(topic.id)}
                onSelectTask={(tid) => p.onSelectTask(tid, topic.id)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onDeleteTopicConfirm={() => handleDeleteTopic(topic.id)}
                onAskDeleteTopic={() => setConfirmingDeleteTopic(topic.id)}
                onCancelDeleteTopic={() => setConfirmingDeleteTopic(null)}
                onCollapse={() => toggleCollapse(topic.id)}
                onStartAdd={() => { setAddingToTopic(addingToTopic === topic.id ? null : topic.id); setNewTaskText(""); }}
                setNewTaskText={setNewTaskText}
                handleCreateTask={() => handleCreateTask(topic.id)}
                cancelAdd={() => setAddingToTopic(null)}
              />
            ))}

            {untopiced.length > 0 && (
              <TopicSection
                key="untopiced"
                topic={null}
                tasks={untopiced}
                isCurrent={!p.currentTopicId && !!p.currentTaskId}
                currentTaskId={p.currentTaskId}
                collapsed={collapsedTopics.has("untopiced")}
                isAddingHere={addingToTopic === "untopiced"}
                newTaskText={newTaskText}
                pending={pending}
                confirmingDelete={false}
                onSelectTopic={() => p.onSelectTopic("")}
                onSelectTask={(tid) => p.onSelectTask(tid, "")}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onDeleteTopicConfirm={() => {}}
                onAskDeleteTopic={() => {}}
                onCancelDeleteTopic={() => {}}
                onCollapse={() => toggleCollapse("untopiced")}
                onStartAdd={() => { setAddingToTopic(addingToTopic === "untopiced" ? null : "untopiced"); setNewTaskText(""); }}
                setNewTaskText={setNewTaskText}
                handleCreateTask={() => handleCreateTask(null)}
                cancelAdd={() => setAddingToTopic(null)}
              />
            )}
          </div>
        )}
      </section>

      {/* Add new topic */}
      <section className="journal-rise jrise-4 mt-2">
        <div className="flex items-baseline gap-3">
          <Plus className="h-3.5 w-3.5 text-ink-700" strokeWidth={1.75} />
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleCreateTopic(); }
            }}
            placeholder="new topic, like Cognitive Psychology"
            disabled={pending}
            className="flex-1 border-0 border-b border-dashed border-ink-900/20 bg-transparent pb-1 font-display text-base italic text-ink-900 outline-none placeholder:text-ink-700/55 focus:border-ink-900/45 disabled:opacity-50"
          />
          {newTopicName.trim() && (
            <button
              type="button"
              onClick={handleCreateTopic}
              disabled={pending}
              className="font-display text-xs italic uppercase tracking-[0.2em] text-ink-900 underline-offset-4 hover:underline disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "save"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function TopicSection({
  topic, tasks, isCurrent, currentTaskId, collapsed, isAddingHere,
  newTaskText, pending, confirmingDelete,
  onSelectTopic, onSelectTask, onToggle, onDelete,
  onDeleteTopicConfirm, onAskDeleteTopic, onCancelDeleteTopic,
  onCollapse, onStartAdd, setNewTaskText, handleCreateTask, cancelAdd
}: {
  topic: Topic | null;
  tasks: Task[];
  isCurrent: boolean;
  currentTaskId: string;
  collapsed: boolean;
  isAddingHere: boolean;
  newTaskText: string;
  pending: boolean;
  confirmingDelete: boolean;
  onSelectTopic: () => void;
  onSelectTask: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteTopicConfirm: () => void;
  onAskDeleteTopic: () => void;
  onCancelDeleteTopic: () => void;
  onCollapse: () => void;
  onStartAdd: () => void;
  setNewTaskText: (s: string) => void;
  handleCreateTask: () => void;
  cancelAdd: () => void;
}) {
  const openCount = tasks.filter((t) => !t.done).length;
  const name = topic?.name || "No topic";

  return (
    <div className="group/topic relative">
      <div className="flex items-baseline gap-3 border-b border-ink-900/10 pb-2.5">
        <button
          type="button"
          onClick={onCollapse}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink-900/55 transition hover:bg-cream-50/60 hover:text-ink-900"
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <Plus className="h-3 w-3" strokeWidth={1.75} /> : <Minus className="h-3 w-3" strokeWidth={1.75} />}
        </button>

        <button
          type="button"
          onClick={onSelectTopic}
          disabled={!topic}
          className={`flex flex-1 items-baseline gap-2 text-left transition ${
            isCurrent ? "text-ink-900" : "text-ink-900/85 hover:text-ink-900"
          }`}
        >
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "animate-pulse bg-emerald-700" : "bg-ink-900/30"}`} />
          <span className="font-display text-xl italic">{name}</span>
          <span className="text-[11px] italic text-ink-700">
            {openCount > 0 ? `${openCount} open` : "all clear"}
          </span>
        </button>

        <button
          type="button"
          onClick={onStartAdd}
          disabled={pending}
          className="text-ink-900/55 transition hover:rotate-90 hover:text-ink-900"
          aria-label="Add task"
          title="Add task"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {topic && (
          <button
            type="button"
            onClick={onAskDeleteTopic}
            disabled={pending}
            className="text-ink-900/35 opacity-0 transition group-hover/topic:opacity-100 hover:text-rose-700"
            aria-label="Delete topic"
            title="Delete topic"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {confirmingDelete && (
        <div className="animate-task-in mt-3 flex items-center justify-between gap-3 px-1 text-sm text-rose-900/90">
          <span className="italic">
            delete <em className="font-semibold not-italic">{name}</em>? tasks fall back to no topic.
          </span>
          <span className="flex items-center gap-3 text-xs">
            <button onClick={onCancelDeleteTopic} className="font-display italic text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline">
              cancel
            </button>
            <button
              onClick={onDeleteTopicConfirm}
              disabled={pending}
              className="font-display italic uppercase tracking-[0.18em] text-rose-700 underline-offset-4 hover:underline disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "delete"}
            </button>
          </span>
        </div>
      )}

      {!collapsed && (
        <ul className="mt-3 flex flex-col">
          {tasks.length === 0 && !isAddingHere && (
            <li className="px-1 py-1 text-sm italic text-ink-700/70">No tasks yet.</li>
          )}
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isCurrent={task.id === currentTaskId}
              pending={pending}
              onToggle={() => onToggle(task.id)}
              onSelect={() => onSelectTask(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          ))}

          {isAddingHere && (
            <li className="animate-task-in mt-2 flex items-baseline gap-3 px-1">
              <Plus className="h-3.5 w-3.5 text-ink-700" strokeWidth={1.75} />
              <input
                autoFocus
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleCreateTask(); }
                  if (e.key === "Escape") cancelAdd();
                }}
                placeholder={`new task${topic ? ` in ${topic.name}` : ""}`}
                disabled={pending}
                className="flex-1 border-0 border-b border-dashed border-ink-900/20 bg-transparent pb-1 text-sm italic text-ink-900 outline-none placeholder:text-ink-700/55 focus:border-ink-900/45 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={!newTaskText.trim() || pending}
                className="font-display text-xs italic uppercase tracking-[0.2em] text-ink-900 underline-offset-4 hover:underline disabled:opacity-50"
              >
                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "save"}
              </button>
              <button
                type="button"
                onClick={cancelAdd}
                className="text-ink-700/60 transition hover:text-ink-900"
                aria-label="Cancel"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function TaskRow({
  task, isCurrent, pending, onToggle, onSelect, onDelete
}: {
  task: Task;
  isCurrent: boolean;
  pending: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="group/row relative flex items-center gap-3 py-1.5">
      {isCurrent && (
        <div
          aria-hidden
          className="halo-sage animate-halo absolute -inset-x-3 -inset-y-1 -z-10 rounded-full blur-xl"
        />
      )}

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        disabled={pending}
        className="flex h-5 w-5 shrink-0 items-center justify-center transition hover:scale-110 active:scale-95"
        aria-label={task.done ? "Mark incomplete" : "Mark done"}
        title={task.done ? "Mark incomplete" : "Mark done"}
      >
        <LeafBullet filled={task.done} />
      </button>

      <button
        type="button"
        onClick={onSelect}
        className={`draw-underline flex-1 text-left transition ${
          task.done ? "line-through opacity-50" : ""
        } ${
          isCurrent
            ? "font-display text-base font-semibold italic text-ink-900"
            : "text-sm text-ink-900/90 hover:text-ink-900"
        }`}
      >
        {task.text}
      </button>

      {!isCurrent && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={pending}
          className="text-ink-900/35 opacity-0 transition group-hover/row:opacity-70 hover:!opacity-100 hover:text-rose-700"
          aria-label="Delete"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}
    </li>
  );
}

function LeafBullet({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className={filled ? "text-emerald-700" : "text-ink-900/35"}>
      <path
        d="M3 21 C 3 12, 12 3, 21 3 C 21 12, 12 21, 3 21 Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {filled && <path d="M5.5 18.5 L 18.5 5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round" />}
    </svg>
  );
}
