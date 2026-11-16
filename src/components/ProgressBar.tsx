import { toneClass, type VillageTone } from "@/lib/villages";

export function ProgressBar({
  value,
  tone,
  label,
}: {
  value: number;
  tone: VillageTone;
  label: string;
}) {
  const width = Math.min(100, Math.max(0, value));
  const visible = width > 0 ? Math.max(width, 2) : 0;
  return (
    <div
      className="h-3 w-full overflow-hidden rounded-full bg-ink"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div
        className={`h-full rounded-full ${toneClass[tone].bg} transition-[width] duration-500 ease-out`}
        style={{ width: `${visible}%` }}
      />
    </div>
  );
}
