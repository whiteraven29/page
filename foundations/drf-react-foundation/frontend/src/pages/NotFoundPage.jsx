import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="stack">
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </section>
  );
}
