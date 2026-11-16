import { Link, useRouterState } from "@tanstack/react-router";
import { SiteSeal } from "@/components/VillageMark";

export function Header() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const onBoard = path.startsWith("/resultados");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-h-11 items-center gap-3">
          <SiteSeal className="size-9 shrink-0 text-gold" />
          <span className="leading-tight">
            <span className="block font-display text-base text-parchment">Vila Oculta</span>
            <span className="block text-xs tracking-widest text-dust uppercase">
              Sorteio das Nações
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={
              "inline-flex min-h-11 items-center px-3 text-sm " +
              (path === "/" ? "text-gold" : "text-dust")
            }
          >
            Sorteio
          </Link>
          <Link
            to="/resultados"
            className={
              "inline-flex min-h-11 items-center px-3 text-sm " +
              (onBoard ? "text-gold" : "text-dust")
            }
          >
            Placar
          </Link>
        </nav>
      </div>
    </header>
  );
}
