import { useCallback, useEffect, useState } from "react";
import FieldError from "../../components/FieldError.jsx";
import { notesApi } from "./api.js";

/** Example feature: copy this folder's shape (api.js + page + components) for new features. */
export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState({ title: "", body: "" });
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await notesApi.list();
      setNotes(data.results);
      setStatus("ready");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e) {
    e.preventDefault();
    setError(null);
    try {
      await notesApi.create(form);
      setForm({ title: "", body: "" });
      load();
    } catch (err) {
      setError(err);
    }
  }

  async function togglePin(note) {
    await notesApi.update(note.id, { pinned: !note.pinned });
    load();
  }

  async function remove(note) {
    await notesApi.remove(note.id);
    load();
  }

  return (
    <section className="stack">
      <h1>Notes</h1>
      <form className="card stack" onSubmit={add}>
        <label>Title<input id="note-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FieldError error={error} field="title" />
        </label>
        <label>Body<textarea id="note-body" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
        <button>Add note</button>
      </form>
      {status === "loading" && <p className="muted">Loading notes…</p>}
      {status === "error" && <p className="error">Couldn't load notes. {error?.message}</p>}
      {status === "ready" && notes.length === 0 && <p className="muted">No notes yet. Add your first one above.</p>}
      <ul className="list">
        {notes.map((n) => (
          <li key={n.id} className="card">
            <div className="row">
              <strong>{n.pinned ? "📌 " : ""}{n.title}</strong>
              <span className="spacer" />
              <button className="ghost" onClick={() => togglePin(n)}>{n.pinned ? "Unpin" : "Pin"}</button>
              <button className="ghost" onClick={() => remove(n)}>Delete</button>
            </div>
            {n.body && <p>{n.body}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
