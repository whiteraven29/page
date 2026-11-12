import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="stack">
      <h1>It works</h1>
      <p>Django REST Framework on the back, React on the front, one login flow between them.</p>
      <p><Link to="/notes">Open the example Notes feature</Link> or browse the API at <a href="/api/v1/docs/">/api/v1/docs/</a>.</p>
    </section>
  );
}
