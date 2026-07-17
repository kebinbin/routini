import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import cn from "clsx";

// Ported from the source app's radix slider, recolored to the demo's palette.
export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "group relative flex h-4 w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-surface-3">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-text-dim group-hover:bg-text" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-text opacity-0 shadow transition group-hover:opacity-100" />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
