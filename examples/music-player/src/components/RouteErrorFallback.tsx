import { Link, type ErrorFallbackContext } from "routini";

export function RouteErrorFallback({
  error,
  reset,
  reload,
  isChunkError,
}: ErrorFallbackContext) {
  return (
    <div role="alert" className="grid h-full place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-black">!</p>
        <p className="mt-2 text-text-dim">
          {isChunkError
            ? "This page failed to load, likely from a new deploy. Reloading picks up the latest version."
            : "Something went wrong loading this page."}
        </p>
        <p className="mt-2 font-mono text-xs text-text-faint">{error.message}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={isChunkError ? reload : reset}
            className="rounded-full bg-text px-4 py-2 text-sm font-medium text-bg"
          >
            {isChunkError ? "Reload" : "Try again"}
          </button>
          <Link
            to="/"
            viewTransition
            className="text-sm font-medium text-text-dim hover:text-text"
          >
            Back to discover
          </Link>
        </div>
      </div>
    </div>
  );
}
