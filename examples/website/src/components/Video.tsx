interface VideoProps {
  src: string;
  caption: string;
}

// Same device bezel as the hero shot and the home page's "Built with routini" card.
export function Video({ src, caption }: VideoProps) {
  return (
    <div>
      <div className="bezel relative overflow-hidden rounded-2xl border bg-bone/6 p-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="aspect-video w-full rounded-lg object-cover"
        />
      </div>
      <p className="text-pretty mt-3 px-3 text-sm leading-relaxed text-bone-dim">
        {caption}
      </p>
    </div>
  );
}
