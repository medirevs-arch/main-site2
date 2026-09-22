"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The Medirevs EHR argument, playable.
 *
 * The whole proposition of this product is one sentence: it keeps working when
 * the connection drops. That was explained in prose beside a static diagram,
 * which asks the reader to take it on trust. Here they can switch the network
 * off themselves, keep working, and watch the queue drain in order when it
 * comes back.
 *
 * No backend and no library. Everything is local state, which is also honest:
 * that is exactly what the real thing does.
 *
 * Under reduced motion the sync is instant rather than staggered, so the
 * mechanism is still legible without anything animating.
 */

type Note = { id: number; text: string; synced: boolean };

const SAMPLES = [
  "Malaria RDT positive, started ACT",
  "BP 148/92, review in two weeks",
  "Referred to lab, full blood count",
  "Prescription sent to pharmacy",
  "Antenatal check, 28 weeks, normal",
];

export default function OfflineDemo() {
  const [online, setOnline] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [value, setValue] = useState("");
  const [reduced, setReduced] = useState(false);

  const seq = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const markSynced = useCallback((id: number) => {
    setNotes((current) => current.map((n) => (n.id === id ? { ...n, synced: true } : n)));
  }, []);

  function toggleNetwork() {
    clearTimers();

    setOnline((wasOnline) => {
      const nowOnline = !wasOnline;

      if (nowOnline) {
        // Drain the queue in the order it was written, which is the part that
        // matters clinically — a record is a sequence, not a set.
        setNotes((current) => {
          const pending = current.filter((n) => !n.synced);
          pending.forEach((note, index) => {
            const id = window.setTimeout(
              () => markSynced(note.id),
              reduced ? 0 : 260 * (index + 1),
            );
            timers.current.push(id);
          });
          return current;
        });
      }

      return nowOnline;
    });
  }

  function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = value.trim() || SAMPLES[seq.current % SAMPLES.length];
    const id = seq.current;
    seq.current += 1;

    setNotes((current) => [...current, { id, text, synced: false }]);
    setValue("");

    if (online) {
      const timer = window.setTimeout(() => markSynced(id), reduced ? 0 : 420);
      timers.current.push(timer);
    }
  }

  const pending = notes.filter((n) => !n.synced).length;

  const caption = !online
    ? pending > 0
      ? `${pending} note${pending === 1 ? "" : "s"} held on the device. Nothing was lost, and nothing is waiting on the network.`
      : "The network is off and the record still works. Save a note and watch where it goes."
    : notes.length > 0
      ? "Everything queued while you were offline has synced, in order. No re-entry, no lost visit."
      : "Every note is written to the device first. Switch the network off and keep working.";

  return (
    <div className="rounded-sm border border-white/10 bg-lab-raised p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="label text-white/40">Consultation notes</p>

        <button
          type="button"
          onClick={toggleNetwork}
          aria-pressed={online}
          className="group/net inline-flex items-center gap-3"
        >
          <span
            className="relative block h-6 w-11 shrink-0 rounded-full border transition-colors duration-300"
            style={{
              background: online ? "rgba(39,192,48,0.22)" : "rgba(255,255,255,0.07)",
              borderColor: online ? "rgba(39,192,48,0.55)" : "rgba(255,255,255,0.16)",
            }}
            aria-hidden="true"
          >
            <span
              className="absolute left-0.5 top-0.5 block h-[1.125rem] w-[1.125rem] rounded-full transition-transform duration-300"
              style={{
                background: online ? "var(--color-signal)" : "rgba(255,255,255,0.45)",
                transform: online ? "translateX(1.25rem)" : "translateX(0)",
              }}
            />
          </span>
          <span className="label w-[6ch] text-left text-white/70">
            {online ? "Online" : "Offline"}
          </span>
        </button>
      </div>

      <form onSubmit={addNote} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="offline-demo-note" className="sr-only">
          Consultation note
        </label>
        <input
          id="offline-demo-note"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Malaria RDT positive, started ACT…"
          autoComplete="off"
          className="w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-bright"
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm bg-white px-5 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white/90"
        >
          Save note
        </button>
      </form>

      <ul className="mt-5 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10" aria-live="polite">
        {notes.length === 0 ? (
          <li className="bg-lab px-4 py-5 text-center text-[0.9375rem] text-white/35">
            No notes yet. Save one, then switch the network off.
          </li>
        ) : (
          notes.map((note) => (
            <li key={note.id} className="flex items-center gap-3 bg-lab px-4 py-3 text-[0.9375rem]">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300"
                style={{ background: note.synced ? "var(--color-signal)" : "#c08a2e" }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-white/80">{note.text}</span>
              <span
                className="label shrink-0"
                style={{ color: note.synced ? "var(--color-signal)" : "rgba(255,255,255,0.35)" }}
              >
                {note.synced ? "Synced" : "On device"}
              </span>
            </li>
          ))
        )}
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-white/50">{caption}</p>
    </div>
  );
}
