import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-[var(--color-text-muted)] mb-4">404</p>
      <p className="text-[var(--color-text)] mb-8">Page not found.</p>
      <Link to="/" className="text-[var(--color-primary)] hover:underline">
        Back to home
      </Link>
    </div>
  );
}
