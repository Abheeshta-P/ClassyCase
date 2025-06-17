import { cn } from "@/lib/utils";

type SeperatorProps = {
  className?: string;
};

function Seperator({ className }: SeperatorProps) {
  return <div className={cn("h-px w-full bg-zinc-200", className)} />;
}

export default Seperator;
