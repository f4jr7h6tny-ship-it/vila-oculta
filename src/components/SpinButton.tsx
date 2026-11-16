import { SiteSeal } from "@/components/VillageMark";

export function SpinButton({
  spinning,
  sealed,
  onClick,
}: {
  spinning: boolean;
  sealed: boolean;
  onClick: () => void;
}) {
  const label = spinning ? "O destino gira…" : sealed ? "Ver meu destino" : "Girar o Destino";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={spinning}
      aria-busy={spinning}
      className="seal-btn inline-flex h-14 w-full max-w-md items-center justify-center gap-3 rounded-xl px-6 font-display text-base tracking-wide transition-transform duration-150 ease-out active:scale-[0.96] disabled:active:scale-100"
    >
      <SiteSeal className="size-5 text-gold" />
      {label}
    </button>
  );
}
