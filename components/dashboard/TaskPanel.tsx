"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, X, ChevronRight, Loader2,
  PanelLeftClose, Calendar, Flag
} from "lucide-react";

type TaskPriority = "low" | "normal" | "high";

type Task = {
  id: string;
  text: string;
  done: boolean;
  topic_id: string | null;
  priority: TaskPriority;
  due_date: string | null;
  notes: string | null;
};
type Topic = { id: string; name: string };

type Props = {
  tasks: Task[];
  topics: Topic[];
  currentTaskId: string;
  currentTopicId: string;
  onSelectTask: (taskId: string, topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onCreateTask: (form: FormData) => Promise<void>;
  onCreateTopic: (form: FormData) => Promise<void>;
  onToggleTask: (form: FormData) => Promise<void>;
  onDeleteTask: (form: FormData) => Promise<void>;
  onDeleteTopic?: (form: FormData) => Promise<void>;
  onUpdateTask?: (form: FormData) => Promise<void>;
  onHide?: () => void;
};

const PRIORITY_NEXT: Record<TaskPriority, TaskPriority> = {
  low: "normal",
  normal: "high",
  high: "low"
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low priority",
  normal: "Normal priority",
  high: "High priority"
};

function tempId() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function TaskPanel(p: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Local mirror — re-syncs when server data refreshes (after revalidatePath).
  const [tasks, setTasks] = useState<Task[]>(p.tasks);
  const [topics, setTopics] = useState<Topic[]>(p.topics);
  useEffect(() => { setTasks(p.tasks); }, [p.tasks]);
  useEffect(() => { setTopics(p.topics); }, [p.topics]);

  const [newTopicName, setNewTopicName] = useState("");
  const [addingTopicTaskTexts, setAddingTopicTaskTexts] = useState<Record<string, string>>({});
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [confirmingDeleteTopic, setConfirmingDeleteTopic] = useState<string | null>(null);
  const [savingTopic, setSavingTopic] = useState(false);

  const currentTask = tasks.find((t) => t.id === p.currentTaskId);
  const currentTopic = topics.find((t) => t.id === p.currentTopicId);
  const untopiced = tasks.filter((t) => !t.topic_id);

  // ---------------- handlers (all optimistic) ----------------

  const optimisticAdd = (newTask: Task) => setTasks((cur) => [...cur, newTask]);
  const optimisticReplace = (id: string, patch: Partial<Task>) =>
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const optimisticRemove = (id: string) => setTasks((cur) => cur.filter((t) => t.id !== id));

  const handleCreateTopic = () => {
    const name = newTopicName.trim();
    if (!name || savingTopic) return;
    setSavingTopic(true);
    const tmp: Topic = { id: tempId(), name };
    setTopics((cur) => [...cur, tmp]);
    setNewTopicName("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", name);
      try {
        await p.onCreateTopic(fd);
        router.refresh();
      } catch (e) {
        console.error(e);
        setTopics((cur) => cur.filter((t) => t.id !== tmp.id));
      } finally {
        setSavingTopic(false);
      }
    });
  };

  const handleCreateTask = (topicId: string | null) => {
    const key = topicId ?? "__none__";
    const text = (addingTopicTaskTexts[key] || "").trim();
    if (!text) return;
    const tmp: Task = {
      id: tempId(), text, done: false, topic_id: topicId,
      priority: "normal", due_date: null, notes: null
    };
    optimisticAdd(tmp);
    setAddingTopicTaskTexts((prev) => ({ ...prev, [key]: "" }));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("text", text);
      fd.set("priority", "normal");
      if (topicId) fd.set("topic_id", topicId);
      try {
        await p.onCreateTask(fd);
        router.refresh();
      } catch (e) {
        console.error(e);
        optimisticRemove(tmp.id);
      }
    });
  };

  const handleToggle = (task: Task) => {
    optimisticReplace(task.id, { done: !task.done });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", task.id);
      fd.set("done", String(task.done));
      try {
        await p.onToggleTask(fd);
        router.refresh();
      } catch (e) {
        console.error(e);
        optimisticReplace(task.id, { done: task.done });
      }
    });
  };

  const handleDelete = (taskId: string) => {
    const before = tasks.find((t) => t.id === taskId);
    optimisticRemove(taskId);
    if (taskId === p.currentTaskId) p.onSelectTask("", "");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", taskId);
      try {
        await p.onDeleteTask(fd);
        router.refresh();
      } catch (e) {
        console.error(e);
        if (before) optimisticAdd(before);
      }
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    const onDeleteTopic = p.onDeleteTopic;
    if (!onDeleteTopic) return;
    const before = topics.find((t) => t.id === topicId);
    setTopics((cur) => cur.filter((t) => t.id !== topicId));
    setConfirmingDeleteTopic(null);
    if (topicId === p.currentTopicId) p.onSelectTopic("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", topicId);
      try {
        await onDeleteTopic(fd);
        router.refresh();
      } catch (e) {
        console.error(e);
        if (before) setTopics((cur) => [...cur, before]);
      }
    });
  };

  const setPriority = (task: Task, next: TaskPriority) => {
    if (!p.onUpdateTask || task.priority === next) return;
    optimisticReplace(task.id, { priority: next });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", task.id);
      fd.set("priority", next);
      try { await p.onUpdateTask!(fd); router.refresh(); }
      catch (e) { console.error(e); optimisticReplace(task.id, { priority: task.priority }); }
    });
  };

  // The priority dot cycles through low → normal → high for quick toggling.
  const cyclePriority = (task: Task) => setPriority(task, PRIORITY_NEXT[task.priority]);

  const updateDueDate = (task: Task, due: string) => {
    if (!p.onUpdateTask) return;
    optimisticReplace(task.id, { due_date: due || null });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", task.id);
      fd.set("due_date", due);
      try { await p.onUpdateTask!(fd); router.refresh(); }
      catch (e) { console.error(e); optimisticReplace(task.id, { due_date: task.due_date }); }
    });
  };

  const updateText = (task: Task, text: string) => {
    if (!p.onUpdateTask) return;
    if (!text.trim() || text === task.text) return;
    optimisticReplace(task.id, { text });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", task.id);
      fd.set("text", text);
      try { await p.onUpdateTask!(fd); router.refresh(); }
      catch (e) { console.error(e); optimisticReplace(task.id, { text: task.text }); }
    });
  };

  const updateNotes = (task: Task, notes: string) => {
    if (!p.onUpdateTask) return;
    if ((notes || "") === (task.notes || "")) return;
    optimisticReplace(task.id, { notes: notes || null });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", task.id);
      fd.set("notes", notes);
      try { await p.onUpdateTask!(fd); router.refresh(); }
      catch (e) { console.error(e); optimisticReplace(task.id, { notes: task.notes }); }
    });
  };

  const toggleTopicCollapse = (id: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ---------------- render ----------------

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-ink-700">
          Topics &amp; Tasks
        </p>
        {p.onHide && (
          <button
            type="button"
            onClick={p.onHide}
            aria-label="Hide tasks"
            title="Hide tasks (focus mode)"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-900/55 transition hover:bg-cream-50/70 hover:text-ink-900"
          >
            <PanelLeftClose className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Currently studying */}
      {(currentTask || currentTopic) && (
        <section className="rounded-2xl bg-emerald-700/[0.07] px-3 py-2.5 ring-1 ring-emerald-700/25">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.28em] text-emerald-800">Studying</p>
              <p className="mt-1 truncate font-display text-sm italic text-ink-900">
                {currentTask?.text || currentTopic?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { p.onSelectTask("", ""); p.onSelectTopic(""); }}
              className="shrink-0 text-[10px] italic uppercase tracking-widest text-ink-700 underline-offset-4 transition hover:text-ink-900 hover:underline"
            >
              clear
            </button>
          </div>
        </section>
      )}

      {/* Topics */}
      <div className="flex flex-col gap-5">
        {topics.length === 0 && untopiced.length === 0 ? (
          <p className="px-1 text-sm italic text-ink-700">
            No topics yet — start with one below, like <em>&ldquo;English Lit.&rdquo;</em>
          </p>
        ) : (
          <>
            {topics.map((topic) => (
              <TopicSection
                key={topic.id}
                topic={topic}
                tasks={tasks.filter((t) => t.topic_id === topic.id)}
                isCurrent={topic.id === p.currentTopicId}
                currentTaskId={p.currentTaskId}
                expandedTaskId={expandedTaskId}
                collapsed={collapsedTopics.has(topic.id)}
                confirmingDelete={confirmingDeleteTopic === topic.id}
                addingText={addingTopicTaskTexts[topic.id] || ""}
                onAddingTextChange={(v) => setAddingTopicTaskTexts((prev) => ({ ...prev, [topic.id]: v }))}
                onSelectTopic={() => p.onSelectTopic(topic.id)}
                onSelectTask={(tid) => p.onSelectTask(tid, topic.id)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onCyclePriority={cyclePriority}
                onSetPriority={setPriority}
                onUpdateDue={updateDueDate}
                onUpdateText={updateText}
                onUpdateNotes={updateNotes}
                onExpand={(id) => setExpandedTaskId((cur) => (cur === id ? null : id))}
                onCreateTask={() => handleCreateTask(topic.id)}
                onCollapse={() => toggleTopicCollapse(topic.id)}
                onAskDelete={() => setConfirmingDeleteTopic(topic.id)}
                onCancelDelete={() => setConfirmingDeleteTopic(null)}
                onConfirmDelete={() => handleDeleteTopic(topic.id)}
              />
            ))}

            {untopiced.length > 0 && (
              <TopicSection
                key="__none__"
                topic={null}
                tasks={untopiced}
                isCurrent={!p.currentTopicId && !!p.currentTaskId}
                currentTaskId={p.currentTaskId}
                expandedTaskId={expandedTaskId}
                collapsed={collapsedTopics.has("__none__")}
                confirmingDelete={false}
                addingText={addingTopicTaskTexts["__none__"] || ""}
                onAddingTextChange={(v) => setAddingTopicTaskTexts((prev) => ({ ...prev, __none__: v }))}
                onSelectTopic={() => p.onSelectTopic("")}
                onSelectTask={(tid) => p.onSelectTask(tid, "")}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onCyclePriority={cyclePriority}
                onSetPriority={setPriority}
                onUpdateDue={updateDueDate}
                onUpdateText={updateText}
                onUpdateNotes={updateNotes}
                onExpand={(id) => setExpandedTaskId((cur) => (cur === id ? null : id))}
                onCreateTask={() => handleCreateTask(null)}
                onCollapse={() => toggleTopicCollapse("__none__")}
                onAskDelete={() => {}}
                onCancelDelete={() => {}}
                onConfirmDelete={() => {}}
              />
            )}
          </>
        )}
      </div>

      {/* Add new topic */}
      <div className="mt-1 flex items-center gap-2 rounded-2xl bg-cream-50/60 px-3 py-2 ring-1 ring-ink-900/10">
        <Plus className="h-3.5 w-3.5 text-ink-700" strokeWidth={1.75} aria-hidden />
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleCreateTopic(); }
          }}
          placeholder="add topic"
          className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-700/60"
        />
        {newTopicName.trim() && (
          <button
            type="button"
            onClick={handleCreateTopic}
            disabled={savingTopic}
            className="font-display text-[11px] italic uppercase tracking-[0.18em] text-emerald-800 underline-offset-4 hover:underline disabled:opacity-50"
          >
            {savingTopic ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "add"}
          </button>
        )}
      </div>
    </div>
  );
}

// =================================================================

function TopicSection({
  topic, tasks, isCurrent, currentTaskId, expandedTaskId,
  collapsed, confirmingDelete, addingText,
  onAddingTextChange,
  onSelectTopic, onSelectTask, onToggle, onDelete,
  onCyclePriority, onSetPriority, onUpdateDue, onUpdateText, onUpdateNotes,
  onExpand, onCreateTask, onCollapse,
  onAskDelete, onCancelDelete, onConfirmDelete
}: {
  topic: Topic | null;
  tasks: Task[];
  isCurrent: boolean;
  currentTaskId: string;
  expandedTaskId: string | null;
  collapsed: boolean;
  confirmingDelete: boolean;
  addingText: string;
  onAddingTextChange: (v: string) => void;
  onSelectTopic: () => void;
  onSelectTask: (id: string) => void;
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onCyclePriority: (task: Task) => void;
  onSetPriority: (task: Task, priority: TaskPriority) => void;
  onUpdateDue: (task: Task, value: string) => void;
  onUpdateText: (task: Task, value: string) => void;
  onUpdateNotes: (task: Task, value: string) => void;
  onExpand: (taskId: string) => void;
  onCreateTask: () => void;
  onCollapse: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const openCount = tasks.filter((t) => !t.done).length;
  const name = topic?.name || "No topic";

  return (
    <section className="group/topic">
      {/* Topic header */}
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCollapse}
          aria-label={collapsed ? "Expand topic" : "Collapse topic"}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-ink-900/45 transition hover:bg-cream-50/60 hover:text-ink-900"
        >
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${collapsed ? "" : "rotate-90"}`}
            strokeWidth={2}
          />
        </button>
        <button
          type="button"
          onClick={onSelectTopic}
          disabled={!topic}
          className={`flex flex-1 items-baseline gap-2 text-left transition ${
            isCurrent ? "text-ink-900" : "text-ink-900/85 hover:text-ink-900"
          }`}
        >
          <span className="font-display text-base italic">{name}</span>
          <span className="text-[10px] italic text-ink-700/70">
            {openCount === 0 ? "all clear" : `${openCount} open`}
          </span>
        </button>
        {topic && (
          <button
            type="button"
            onClick={onAskDelete}
            className="opacity-0 transition group-hover/topic:opacity-100 text-ink-900/35 hover:text-rose-700"
            aria-label="Delete topic"
            title="Delete topic"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </header>

      {confirmingDelete && (
        <div className="mt-2 ml-7 flex items-center justify-between gap-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-900/90">
          <span className="italic">delete <em className="font-semibold not-italic">{name}</em>?</span>
          <span className="flex gap-3">
            <button onClick={onCancelDelete} className="italic text-ink-700 hover:text-ink-900">cancel</button>
            <button onClick={onConfirmDelete} className="italic uppercase tracking-[0.16em] text-rose-700 underline-offset-4 hover:underline">delete</button>
          </span>
        </div>
      )}

      {/* Tasks */}
      {!collapsed && (
        <ul className="mt-1.5 flex flex-col gap-0.5 pl-7">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isCurrent={task.id === currentTaskId}
              expanded={expandedTaskId === task.id}
              onSelect={() => onSelectTask(task.id)}
              onToggle={() => onToggle(task)}
              onDelete={() => onDelete(task.id)}
              onCyclePriority={() => onCyclePriority(task)}
              onSetPriority={(p) => onSetPriority(task, p)}
              onUpdateDue={(v) => onUpdateDue(task, v)}
              onUpdateText={(v) => onUpdateText(task, v)}
              onUpdateNotes={(v) => onUpdateNotes(task, v)}
              onExpand={() => onExpand(task.id)}
            />
          ))}

          {/* Always-visible add row at the BOTTOM of the topic */}
          <li className="mt-1 flex items-center gap-2 rounded-lg px-2 py-1.5 ring-1 ring-transparent transition hover:ring-ink-900/10">
            <Plus className="h-3.5 w-3.5 text-ink-700/70" strokeWidth={1.75} aria-hidden />
            <input
              type="text"
              value={addingText}
              onChange={(e) => onAddingTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); onCreateTask(); }
                if (e.key === "Escape") onAddingTextChange("");
              }}
              placeholder="add task"
              className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-700/55"
            />
            {addingText.trim() && (
              <button
                type="button"
                onClick={onCreateTask}
                className="font-display text-[10px] italic uppercase tracking-[0.18em] text-emerald-800 underline-offset-4 hover:underline"
              >
                add
              </button>
            )}
          </li>
        </ul>
      )}
    </section>
  );
}

// =================================================================

function TaskRow({
  task, isCurrent, expanded,
  onSelect, onToggle, onDelete,
  onCyclePriority, onSetPriority, onUpdateDue, onUpdateText, onUpdateNotes, onExpand
}: {
  task: Task;
  isCurrent: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onCyclePriority: () => void;
  onSetPriority: (priority: TaskPriority) => void;
  onUpdateDue: (value: string) => void;
  onUpdateText: (value: string) => void;
  onUpdateNotes: (value: string) => void;
  onExpand: () => void;
}) {
  const [editingText, setEditingText] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [notesDraft, setNotesDraft] = useState(task.notes || "");
  const [bursting, setBursting] = useState(false);

  useEffect(() => { setDraft(task.text); }, [task.text]);
  useEffect(() => { setNotesDraft(task.notes || ""); }, [task.notes]);

  const commitText = () => {
    setEditingText(false);
    if (draft.trim() && draft !== task.text) onUpdateText(draft.trim());
    else setDraft(task.text);
  };

  const commitNotes = () => {
    if (notesDraft !== (task.notes || "")) onUpdateNotes(notesDraft);
  };

  // Leaf burst — fires only when checking a task done (not when un-checking).
  const handleToggleWithBurst = () => {
    if (!task.done) {
      setBursting(true);
      window.setTimeout(() => setBursting(false), 900);
    }
    onToggle();
  };

  return (
    <li>
      <div
        className={`group/row flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${
          isCurrent ? "bg-emerald-700/[0.08] ring-1 ring-emerald-700/25" : "hover:bg-cream-50/50"
        }`}
      >
        {/* Done checkbox + leaf burst on completion */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={handleToggleWithBurst}
            aria-label={task.done ? "Mark not done" : "Mark done"}
            title={task.done ? "Mark not done" : "Mark done"}
            className="flex h-4 w-4 items-center justify-center rounded-[5px] border border-ink-900/30 transition hover:border-emerald-700/70 active:scale-90"
          >
            {task.done && (
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-emerald-700" aria-hidden>
                <path d="M3 8.5 L7 12 L13 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          {bursting && <LeafBurst />}
        </div>

        {/* Priority dot — clickable */}
        <button
          type="button"
          onClick={onCyclePriority}
          aria-label={`Cycle priority — ${PRIORITY_LABEL[task.priority]}`}
          title={PRIORITY_LABEL[task.priority]}
          className="shrink-0"
        >
          <PriorityDot priority={task.priority} />
        </button>

        {/* Title — click selects, double-click edits */}
        {editingText ? (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitText(); }
              if (e.key === "Escape") { setDraft(task.text); setEditingText(false); }
            }}
            className="flex-1 bg-transparent text-sm text-ink-900 outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={onSelect}
            onDoubleClick={() => setEditingText(true)}
            className={`flex-1 truncate text-left text-sm transition ${
              task.done ? "text-ink-900/45 line-through" : "text-ink-900/90 hover:text-ink-900"
            }`}
            title="Click to study, double-click to rename"
          >
            {task.text}
          </button>
        )}

        {/* Due date pill (compact) */}
        {task.due_date && (
          <span
            className="shrink-0 rounded-md bg-ink-900/[0.05] px-1.5 py-0.5 text-[10px] tabular-nums text-ink-700"
            title={`Due ${task.due_date}`}
          >
            {formatDueShort(task.due_date)}
          </span>
        )}

        {/* Expand toggle */}
        <button
          type="button"
          onClick={onExpand}
          aria-label={expanded ? "Hide details" : "Show details"}
          title="Details"
          className={`shrink-0 text-ink-900/35 transition hover:text-ink-900 ${expanded ? "rotate-90 text-ink-900/70" : ""}`}
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="animate-task-in ml-6 mt-1 flex flex-col gap-3 rounded-xl bg-cream-50/65 px-3 py-3 ring-1 ring-ink-900/10">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <PriorityChips current={task.priority} onSelect={onSetPriority} />
            <label className="flex items-center gap-1.5 text-ink-700">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              <input
                type="date"
                value={task.due_date || ""}
                onChange={(e) => onUpdateDue(e.target.value)}
                className="rounded border border-ink-900/15 bg-cream-50 px-1.5 py-0.5 text-xs text-ink-900 outline-none focus:border-emerald-700/40"
              />
              {task.due_date && (
                <button
                  type="button"
                  onClick={() => onUpdateDue("")}
                  aria-label="Clear due date"
                  className="text-ink-700/50 hover:text-rose-700"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              )}
            </label>
            <button
              type="button"
              onClick={onDelete}
              className="ml-auto flex items-center gap-1 text-rose-700/80 transition hover:text-rose-800"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="italic">delete</span>
            </button>
          </div>

          {/* Notes — saves on blur. Auto-grows up to a max height. */}
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={commitNotes}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                commitNotes();
                (e.target as HTMLTextAreaElement).blur();
              }
            }}
            placeholder="notes — anything you want to remember"
            rows={notesDraft ? Math.min(8, Math.max(2, notesDraft.split("\n").length)) : 2}
            className="w-full resize-y rounded-lg border border-ink-900/10 bg-cream-50 px-2.5 py-2 text-xs leading-relaxed text-ink-900 outline-none placeholder:italic placeholder:text-ink-700/55 focus:border-emerald-700/35 focus:ring-1 focus:ring-emerald-700/20"
          />
        </div>
      )}
    </li>
  );
}

// =================================================================

function LeafBurst() {
  // Six tiny leaves spreading out from the checkbox.
  const leaves = [
    { lx: -22, ly: -28, lr: -30 },
    { lx:  22, ly: -28, lr:  30 },
    { lx: -16, ly: -42, lr: -10 },
    { lx:  16, ly: -42, lr:  10 },
    { lx: -30, ly: -10, lr: -55 },
    { lx:  30, ly: -10, lr:  55 }
  ];
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 block h-0 w-0">
      {leaves.map((l, i) => (
        <span
          key={i}
          className="animate-leaf-burst absolute -left-[5px] -top-[5px] block h-[10px] w-[10px]"
          style={{
            ["--lx" as string]: `${l.lx}px`,
            ["--ly" as string]: `${l.ly}px`,
            ["--lr" as string]: `${l.lr}deg`,
            animationDelay: `${i * 35}ms`
          } as React.CSSProperties}
        >
          <svg viewBox="-6 -6 12 12" className="h-full w-full" aria-hidden>
            <path
              d="M 0 -5 C 4 -3, 4 3, 0 5 C -4 3, -4 -3, 0 -5 Z"
              fill="#5fa05a"
              opacity="0.95"
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  if (priority === "high")
    return <span className="block h-2.5 w-2.5 rounded-full bg-rose-600" aria-hidden />;
  if (priority === "low")
    return <span className="block h-2.5 w-2.5 rounded-full border border-ink-900/30 bg-transparent" aria-hidden />;
  return <span className="block h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />;
}

function PriorityChips({
  current, onSelect
}: {
  current: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
}) {
  const items: { id: TaskPriority; label: string }[] = [
    { id: "low",    label: "Low" },
    { id: "normal", label: "Med" },
    { id: "high",   label: "High" }
  ];
  return (
    <div className="inline-flex items-center gap-1 text-ink-700">
      <Flag className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      <span className="flex rounded-full bg-ink-900/[0.05] p-0.5">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            className={`rounded-full px-2 py-0.5 text-[11px] italic transition ${
              current === it.id ? "bg-cream-50 text-ink-900 shadow-sm" : "text-ink-700/75 hover:text-ink-900"
            }`}
          >
            {it.label}
          </button>
        ))}
      </span>
    </div>
  );
}

function formatDueShort(iso: string) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(y, m - 1, d);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "tmrw";
  if (diff === -1) return "yest";
  if (diff < 0) return `${diff}d`;
  if (diff < 7) return `${diff}d`;
  return target.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
