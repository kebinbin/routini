import { Link, useParams } from "routini";
import { getArtist, getEvent } from "../lib/data";

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEvent(id) : undefined;

  if (!event) {
    return <div className="p-6 text-text-dim">Event not found.</div>;
  }

  const lineup = event.lineup
    .map(getArtist)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="px-6 py-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={event.poster}
          alt=""
          className="h-48 w-48 shrink-0 rounded-lg object-cover shadow-lg"
        />
        <div className="flex flex-col justify-end">
          <p className="text-sm text-text-dim">
            {event.date} @ {event.venue}
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">
            {event.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-text-dim">
            {event.description}
          </p>
          <div className="mt-4">
            <button className="rounded-full bg-text px-5 py-2 text-sm font-medium text-bg transition hover:scale-[1.02]">
              Tickets
            </button>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold">Artists performing</h2>
      <ul className="mt-4 flex flex-col">
        {lineup.map((a) => (
          <li key={a.id}>
            <Link
              to={`/artist/${a.id}`}
              preload="hover"
              viewTransition
              className="flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-surface-2"
            >
              <img
                src={a.photo}
                alt=""
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{a.name}</p>
                <p className="truncate text-sm text-text-dim">
                  {a.genres.join(", ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
