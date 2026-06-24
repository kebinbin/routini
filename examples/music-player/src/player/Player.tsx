import { useEffect, useRef, useState } from "react";
import { Slider } from "./Slider";
import { usePlayerStore } from "./playerStore";
import { getArtist } from "../lib/data";

function SkipBack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect x="5" y="5" width="2.4" height="14" rx="1.2" />
      <path d="M20 5.7a1 1 0 0 0-1.5-.86L9 11a1 1 0 0 0 0 1.72l9.5 6.16a1 1 0 0 0 1.5-.86V5.7z" />
    </svg>
  );
}

function SkipForward({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect x="16.6" y="5" width="2.4" height="14" rx="1.2" />
      <path d="M4 5.7a1 1 0 0 1 1.5-.86L15 11a1 1 0 0 1 0 1.72l-9.5 6.16A1 1 0 0 1 4 18.18V5.7z" />
    </svg>
  );
}

function Play({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function Pause({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
      <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" />
    </svg>
  );
}

function fmt(t: number) {
  if (!t || Number.isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Player() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const queue = usePlayerStore((s) => s.queue);
  const play = usePlayerStore((s) => s.play);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.play().catch(() => {});
    else a.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentSong) return;
    a.src = currentSong.audioSrc;
    a.volume = volume;
    a.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  const artist = currentSong ? getArtist(currentSong.artistId) : undefined;
  const subtitle =
    currentSong && artist?.performing
      ? `${currentSong.artist} @ ${artist.performing.date}, ${artist.performing.venue}`
      : currentSong?.artist ?? "";

  const idx =
    currentSong && queue.length
      ? queue.findIndex((s) => s.id === currentSong.id)
      : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < queue.length - 1;
  const goPrev = () => hasPrev && play(queue[idx - 1], queue);
  const goNext = () => hasNext && play(queue[idx + 1], queue);

  const seek = (
    <Slider
      min={0}
      max={duration || 1}
      step={1}
      value={[currentTime]}
      onValueChange={([v]) => {
        if (audioRef.current) audioRef.current.currentTime = v;
        setCurrentTime(v);
      }}
      aria-label="Seek"
      className="flex-1"
    />
  );

  return (
    <>
      {/* Mobile: small art + info on the left, transport on the right, and the
          seek bar spanning the full width along the bottom. Volume is omitted —
          use the device. */}
      <div className="flex flex-col lg:hidden">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {currentSong ? (
              <img
                src={currentSong.cover}
                alt=""
                className="h-11 w-11 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="h-11 w-11 shrink-0 rounded-md bg-surface-2" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {currentSong ? currentSong.title : "Select a track to play"}
              </p>
              {currentSong && (
                <p className="truncate text-xs text-text-faint">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              aria-label="Previous"
              className="text-text-dim transition hover:text-text disabled:opacity-30"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => currentSong && setIsPlaying(!isPlaying)}
              disabled={!currentSong}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="text-text transition disabled:opacity-30"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7" />
              )}
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext}
              aria-label="Next"
              className="text-text-dim transition hover:text-text disabled:opacity-30"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex w-full items-center">{seek}</div>
      </div>

      {/* Desktop: now-playing · transport + progress · volume */}
      <div className="hidden h-24 items-center gap-4 px-4 lg:flex">
        <div className="flex w-[26%] min-w-0 items-center gap-3">
          {currentSong ? (
            <img
              src={currentSong.cover}
              alt=""
              className="h-14 w-14 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-md bg-surface-2" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              {currentSong ? currentSong.title : "Select a track to play"}
            </p>
            {currentSong && (
              <p className="truncate text-xs text-text-faint">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-7">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              aria-label="Previous"
              className="text-text-dim transition hover:text-text disabled:opacity-30"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => currentSong && setIsPlaying(!isPlaying)}
              disabled={!currentSong}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="text-text transition hover:scale-105 disabled:opacity-30"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7" />
              )}
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext}
              aria-label="Next"
              className="text-text-dim transition hover:text-text disabled:opacity-30"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="flex w-full max-w-xl items-center gap-2 text-[11px] text-text-faint">
            <span className="w-10 text-right tabular-nums">
              {fmt(currentTime)}
            </span>
            {seek}
            <span className="w-10 tabular-nums">{fmt(duration)}</span>
          </div>
        </div>

        <div className="flex w-[26%] items-center justify-end gap-2.5 text-text-dim">
          <VolumeIcon className="h-4 w-4 shrink-0" />
          <div className="w-40">
            <Slider
              min={0}
              max={100}
              value={[volume * 100]}
              onValueChange={([v]) => setVolume(v / 100)}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={goNext}
      />
    </>
  );
}
