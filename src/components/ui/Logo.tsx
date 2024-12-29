import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <h1 className={cn("text-4xl text-orange-500 font-black", className)}>
      QuizzA
    </h1>
  );
}
