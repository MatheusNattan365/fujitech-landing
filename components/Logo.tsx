import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "light",
  className,
  priority = false,
}: {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  return (
    <p>
      <span className="text-2xl font-bold text-craft-ember">F</span>
      <span className="font-bold text-2xl">ujitech</span>
    </p>
  );
}
