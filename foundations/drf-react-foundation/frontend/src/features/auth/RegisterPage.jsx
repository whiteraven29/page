import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FieldError from "../../components/FieldError.jsx";
import { useAuth } from "./AuthContext.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(form);
      navigate("/notes", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h1>Create an account</h1>
      {error && !error.details && <p role="alert" className="error">{error.message}</p>}
      <label>Name<input id="reg-name" value={form.display_name} onChange={set("display_name")} /></label>
      <label>
        Email<input id="reg-email" type="email" required value={form.email} onChange={set("email")} />
        <FieldError error={error} field="email" />
      </label>
      <label>
        Password<input id="reg-password" type="password" required minLength={10} value={form.password}
          onChange={set("password")} autoComplete="new-password" />
        <FieldError error={error} field="password" />
        <FieldError error={error} field="non_field_errors" />
      </label>
      <button disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      <p className="muted">Have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}
