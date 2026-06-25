import { Link } from "routini";
import { events } from "../lib/data";

export default function Events() {
  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
        Events near you
      </h1>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              to={`/event/${e.id}`}
              preload="hover"
              viewTransition
              className="group block"
            >
              <img
                src={e.poster}
                alt=""
                className="aspect-3/4 w-full rounded-lg object-cover transition group-hover:opacity-90"
              />
              <p className="mt-2 truncate text-sm font-medium">{e.title}</p>
              <p className="truncate text-xs text-text-faint">
                {e.date} @ {e.venue}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
