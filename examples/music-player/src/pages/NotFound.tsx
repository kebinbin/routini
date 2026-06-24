import { Link } from "routini";

export default function NotFound() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-black">404</p>
        <p className="mt-2 text-text-dim">We couldn't find that page.</p>
        <Link
          to="/"
          viewTransition
          className="mt-5 inline-block rounded-full bg-text px-4 py-2 text-sm font-medium text-bg"
        >
          Back to discover
        </Link>
      </div>
    </div>
  );
}
