"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, Plus, Loader2, Trash2, Folder, ChevronDown, ChevronRight, X } from "lucide-react";

type Task = { id: string; text: string; done: boolean; topic_id: string | null };
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
};

export function TaskPanel({
  tasks,
  topics,
  currentTaskId,
  currentTopicId,
  onSelectTask,
  onSelectTopic,
  onCreateTask,
  onCreateTopic,
  onToggleTask,
  onDeleteTask,
  onDeleteTopic
}: Props) {
  const router = useRouter();
  const [pending, startPending] = useTransition();
  const [newTopicName, setNewTopicName] = useState("");
  const [addingToTopic, setAddingToTopic] = useState<string | null>(null); // topic_id or "untopiced"
  const [newTaskText, setNewTaskText] = useState("");
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());
  const [pendingTopicName, setPendingTopicName] = useState<string | null>(null);
  const [pendingTaskText, setPendingTaskText] = useState<string | null>(null);
  const [confirmingDeleteTopic, setConfirmingDeleteTopic] = useState<string | null>(null);

  // Auto-collapse "Untopiced" when there are no untopiced tasks
  const untopicedTasks = tasks.filter((t) => !t.topic_id);

  // Auto-select newly created topic
  useEffect(() => {
    if (!pendingTopicName) return;
    const found = topics.find((t) => t.name === pendingTopicName);
    if (found) {
      onSelectTopic(found.id);
      setPendingTopicName(null);
    }
  }, [topics, pendingTopicName, onSelectTopic]);

  // Auto-select newly created task
  useEffect(() => {
    if (!pendingTaskText) return;
    const found = tasks.find((t) => t.text === pendingTaskText);
    if (found) {
      onSelectTask(found.id, found.topic_id || "");
      setPendingTaskText(null);
    }
  }, [tasks, pendingTaskText, onSelectTask]);

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) return;
    const name = newTopicName.trim();
    setPendingTopicName(name);
    startPending(async () => {
      const fd = new FormData();
      fd.set("name", name);
      try {
        await onCreateTopic(fd);
        setNewTopicName("");
        router.refresh();
      } catch (err) {
        console.error(err);
        setPendingTopicName(null);
      }
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
      try {
        await onCreateTask(fd);
        setNewTaskText("");
        setAddingToTopic(null);
        router.refresh();
      } catch (err) {
        console.error(err);
        setPendingTaskText(null);
      }
    });
  };

  const handleToggle = (taskId: string) => {
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", taskId);
      try {
        await onToggleTask(fd);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = (taskId: string) => {
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", taskId);
      try {
        await onDeleteTask(fd);
        // If we just deleted the current task, clear the selection
        if (taskId === currentTaskId) onSelectTask("", "");
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!onDeleteTopic) return;
    setConfirmingDeleteTopic(null);
    startPending(async () => {
      const fd = new FormData();
      fd.set("id", topicId);
      try {
        await onDeleteTopic(fd);
        if (topicId === currentTopicId) onSelectTopic("");
        router.refresh();
      } catch (err) {
        console.error(err);
      }
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

  const currentTask = tasks.find((t) => t.id === currentTaskId);
  const currentTopic = topics.find((t) => t.id === currentTopicId);

  const renderTaskRow = (task: Task) => {
    const isCurrent = task.id === currentTaskId;
    return (
      <li
        key={task.id}
        className={`group animate-task-in flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-200 ${
          isCurrent
            ? "bg-ink-900 text-cream-50 shadow-soft animate-pulse-ring"
            : "hover:bg-cream-50/70 hover:translate-x-0.5"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle(task.id);
          }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
            task.done
              ? isCurrent
                ? "bg-cream-50 text-ink-900"
                : "bg-ink-900 text-cream-50"
              : isCurrent
                ? "border border-cream-50/50"
                : "border border-ink-900/30 hover:border-ink-900/60"
          }`}
          aria-label={task.done ? "Mark incomplete" : "Mark done"}
          title={task.done ? "Mark incomplete" : "Mark done"}
          disabled={pending}
        >
          {task.done && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>
        <button
          type="button"
          onClick={() => onSelectTask(task.id, task.topic_id || "")}
          className={`flex-1 text-left text-sm leading-tight ${
            task.done ? "line-through opacity-60" : ""
          }`}
        >
          {task.text}
        </button>
        {!isCurrent && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task.id);
            }}
            disabled={pending}
            className="opacity-0 transition group-hover:opacity-60 hover:!opacity-100"
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </li>
    );
  };

  const renderTopicGroup = (topic: Topic | null) => {
    const id = topic?.id || "untopiced";
    const name = topic?.name || "No topic";
    const items = topic ? tasks.filter((t) => t.topic_id === topic.id) : untopicedTasks;
    const collapsed = collapsedTopics.has(id);
    const isCurrentTopic =
      (topic && topic.id === currentTopicId) || (!topic && currentTopicId === "");
    const isAddingHere = addingToTopic === id;

    return (
      <div
        key={id}
        className={`group/topic animate-task-in rounded-3xl bg-cream-50/35 p-3 ring-1 ring-ink-900/5 transition-all duration-200 hover:bg-cream-50/55 hover:ring-ink-900/10 ${
          isCurrentTopic ? "ring-emerald-700/30 bg-cream-50/60" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCollapse(id)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink-900/60 transition hover:bg-cream-50/60"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
          <button
            type="button"
            onClick={() => topic && onSelectTopic(topic.id)}
            className={`flex flex-1 items-center gap-2 text-left text-sm font-semibold transition ${
              isCurrentTopic ? "text-ink-900" : "text-ink-900/80 hover:text-ink-900"
            }`}
            disabled={!topic}
          >
            <Folder className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <span>{name}</span>
            <span className="text-[10px] font-normal text-ink-700">
              · {items.filter((i) => !i.done).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingToTopic(isAddingHere ? null : id);
              setNewTaskText("");
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-900/60 transition hover:rotate-90 hover:bg-cream-50/60 hover:text-ink-900"
            aria-label="Add task to this topic"
            title="Add task"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
          {topic && onDeleteTopic && (
            <button
              type="button"
              onClick={() => setConfirmingDeleteTopic(topic.id)}
              disabled={pending}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-900/40 opacity-0 transition group-hover/topic:opacity-100 hover:bg-rose-100/60 hover:text-rose-700"
              aria-label="Delete topic"
              title="Delete topic"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Inline delete confirmation */}
        {topic && confirmingDeleteTopic === topic.id && (
          <div className="animate-task-in mt-2 flex items-center justify-between gap-2 rounded-2xl bg-rose-50 px-3 py-2 ring-1 ring-rose-200">
            <p className="text-xs text-rose-900">
              Delete <span className="font-semibold">{topic.name}</span>? Tasks move to No topic.
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setConfirmingDeleteTopic(null)}
                className="rounded-full bg-cream-50 px-3 py-1 text-[11px] font-semibold text-ink-900/70 transition hover:text-ink-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTopic(topic.id)}
                disabled={pending}
                className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-cream-50 transition hover:bg-rose-700 disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Trash2 className="h-3 w-3" strokeWidth={2.5} />
                )}
                Delete
              </button>
            </div>
          </div>
        )}

        {!collapsed && (
          <>
            {items.length > 0 && <ul className="mt-2 space-y-1">{items.map(renderTaskRow)}</ul>}
            {items.length === 0 && !isAddingHere && (
              <p className="mt-2 px-3 text-xs text-ink-700">No tasks yet.</p>
            )}
            {isAddingHere && (
              <div className="mt-2 flex gap-1.5 px-1">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateTask(topic?.id || null);
                    }
                    if (e.key === "Escape") {
                      setAddingToTopic(null);
                      setNewTaskText("");
                    }
                  }}
                  autoFocus
                  placeholder={`+ New task${topic ? ` in ${topic.name}` : ""}`}
                  disabled={pending}
                  className="flex-1 rounded-xl border border-dashed border-ink-900/20 bg-cream-50/40 px-3 py-1.5 text-xs disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleCreateTask(topic?.id || null)}
                  disabled={!newTaskText.trim() || pending}
                  className="inline-flex items-center gap-1 rounded-xl bg-ink-900 px-3 py-1.5 text-xs font-semibold text-cream-50 disabled:opacity-40"
                >
                  {pending ? <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} /> : <Plus className="h-3 w-3" strokeWidth={2.5} />}
                  Add
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-ink-900/10 bg-cream-50/70 p-5 shadow-soft backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink-900">Your tasks</h2>
        <span className="text-xs text-ink-700">
          {tasks.filter((t) => !t.done).length} open
        </span>
      </div>

      {/* Currently studying card */}
      {(currentTask || currentTopic) && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#3a8a4c] to-[#1a4d2a] px-4 py-3 text-cream-50 shadow-[0_8px_20px_-8px_rgba(31,77,44,0.5)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-50/70">
            Currently studying
          </p>
          {currentTask ? (
            <p className="mt-1 font-display text-lg leading-tight">{currentTask.text}</p>
          ) : (
            <p className="mt-1 font-display text-lg leading-tight">
              {currentTopic?.name || "—"}
            </p>
          )}
          {currentTask && currentTopic && (
            <p className="text-xs text-cream-50/70">in {currentTopic.name}</p>
          )}
          {(currentTaskId || currentTopicId) && (
            <button
              type="button"
              onClick={() => {
                onSelectTask("", "");
                onSelectTopic("");
              }}
              className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-cream-50/70 underline-offset-4 hover:text-cream-50 hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>
      )}

      {/* Topic groups */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {topics.map((t) => renderTopicGroup(t))}
        {untopicedTasks.length > 0 && renderTopicGroup(null)}
        {topics.length === 0 && untopicedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-cream-50/30 p-8 text-center">
            <Circle className="h-7 w-7 text-ink-900/30" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-ink-700">No tasks yet</p>
            <p className="mt-1 text-xs text-ink-700">Create a topic below to get started.</p>
          </div>
        )}
      </div>

      {/* Add topic */}
      <div className="mt-3 flex gap-1.5 border-t border-ink-900/10 pt-3">
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreateTopic();
            }
          }}
          placeholder="+ New topic"
          disabled={pending}
          className="flex-1 rounded-xl border border-dashed border-ink-900/20 bg-cream-50/40 px-3 py-1.5 text-xs disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleCreateTopic}
          disabled={!newTopicName.trim() || pending}
          className="inline-flex items-center gap-1 rounded-xl bg-ink-900 px-3 py-1.5 text-xs font-semibold text-cream-50 disabled:opacity-40"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} /> : <Plus className="h-3 w-3" strokeWidth={2.5} />}
          Topic
        </button>
      </div>
    </div>
  );
}
