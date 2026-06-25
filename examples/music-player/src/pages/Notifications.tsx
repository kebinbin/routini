import { Link, useParams } from "routini";
import { FEED, NotificationList } from "../components/NotificationList";
import { NotificationMessage } from "../components/NotificationMessage";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// One page, two routes (/notifications and /notifications/:id) sharing a lazy
// import — so the list never remounts. It composes the reusable NotificationList
// and NotificationMessage components; useParams decides whether a message is open.
export default function Notifications() {
  const { id } = useParams<{ id?: string }>();
  const selected = id ? FEED.find((n) => n.id === id) : undefined;

  return (
    <div
      className={
        selected ? "h-full lg:grid lg:grid-cols-[minmax(340px,400px)_1fr]" : "h-full"
      }
    >
      {/* List — full width when nothing is open; left pane (hidden on mobile) when one is */}
      <div
        className={`h-full overflow-y-auto ${
          selected ? "hidden lg:block lg:border-r lg:border-border" : "block"
        }`}
      >
        <NotificationList />
      </div>

      {/* Message — present only when a notification is open */}
      {selected && (
        <div className="h-full overflow-y-auto">
          <div className="relative px-6 py-6 lg:px-10 lg:py-10">
            <Link
              to="/notifications"
              aria-label="Close"
              className="absolute right-4 top-4 text-text-faint transition hover:text-text"
            >
              <CloseIcon className="h-5 w-5" />
            </Link>
            <NotificationMessage notif={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
