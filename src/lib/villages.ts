export const VILLAGE_IDS = ["konoha", "suna", "kiri", "kumo", "iwa", "ame"] as const;

export type VillageId = (typeof VILLAGE_IDS)[number];

export type VillageTone = "leaf" | "sand" | "mist" | "cloud" | "stone" | "rain";

export type Village = {
  id: VillageId;
  name: string;
  shortName: string;
  nation: string;
  proverb: string;
  tone: VillageTone;
};

export const villages: readonly Village[] = [
  {
    id: "konoha",
    name: "Konohagakure",
    shortName: "Vila da Folha",
    nation: "País do Fogo",
    proverb: "A folha dança, mas a vontade do fogo não se apaga.",
    tone: "leaf",
  },
  {
    id: "suna",
    name: "Sunagakure",
    shortName: "Vila da Areia",
    nation: "País do Vento",
    proverb: "Quem aguenta o vento aprende a esculpir a areia.",
    tone: "sand",
  },
  {
    id: "kiri",
    name: "Kirigakure",
    shortName: "Vila da Névoa",
    nation: "País da Água",
    proverb: "Na névoa, o caminho aparece para quem não hesita.",
    tone: "mist",
  },
  {
    id: "kumo",
    name: "Kumogakure",
    shortName: "Vila da Nuvem",
    nation: "País do Raio",
    proverb: "O raio escolhe o pico — e não pede desculpas.",
    tone: "cloud",
  },
  {
    id: "iwa",
    name: "Iwagakure",
    shortName: "Vila da Pedra",
    nation: "País da Terra",
    proverb: "A pedra cede a ninguém. O teimoso é que racha.",
    tone: "stone",
  },
  {
    id: "ame",
    name: "Amegakure",
    shortName: "Vila da Chuva",
    nation: "País da Chuva",
    proverb: "A chuva cai igual sobre todos. A torre é quem decide.",
    tone: "rain",
  },
];

const byId = new Map(villages.map((village) => [village.id, village]));

export function isVillageId(value: string): value is VillageId {
  return (VILLAGE_IDS as readonly string[]).includes(value);
}

export function villageById(id: VillageId): Village {
  const village = byId.get(id);
  if (!village) throw new Error("Vila desconhecida.");
  return village;
}

export function pickVillageId(): VillageId {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return VILLAGE_IDS[buffer[0] % VILLAGE_IDS.length];
}

export const toneClass: Record<
  VillageTone,
  { text: string; bg: string; soft: string; card: string }
> = {
  leaf: {
    text: "text-leaf",
    bg: "bg-leaf",
    soft: "bg-leaf/15",
    card: "village-card-leaf",
  },
  sand: {
    text: "text-sand",
    bg: "bg-sand",
    soft: "bg-sand/15",
    card: "village-card-sand",
  },
  mist: {
    text: "text-mist",
    bg: "bg-mist",
    soft: "bg-mist/15",
    card: "village-card-mist",
  },
  cloud: {
    text: "text-cloud",
    bg: "bg-cloud",
    soft: "bg-cloud/15",
    card: "village-card-cloud",
  },
  stone: {
    text: "text-stone",
    bg: "bg-stone",
    soft: "bg-stone/15",
    card: "village-card-stone",
  },
  rain: {
    text: "text-rain",
    bg: "bg-rain",
    soft: "bg-rain/15",
    card: "village-card-rain",
  },
};

const VOTE_KEY = "vila-oculta-voto";

export type StoredVote = { villageId: VillageId; at: number };

export function readStoredVote(): StoredVote | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VOTE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { villageId?: unknown; at?: unknown };
    if (typeof parsed.villageId !== "string" || !isVillageId(parsed.villageId)) return null;
    return {
      villageId: parsed.villageId,
      at: typeof parsed.at === "number" ? parsed.at : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeStoredVote(villageId: VillageId) {
  const payload: StoredVote = { villageId, at: Date.now() };
  window.localStorage.setItem(VOTE_KEY, JSON.stringify(payload));
  return payload;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(votes: number, total: number) {
  if (total <= 0) return "0%";
  return `${((votes / total) * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

export function runReel(
  target: VillageId,
  onFrame: (id: VillageId) => void,
): { promise: Promise<void>; cancel: () => void } {
  let timer = 0;
  let cancelled = false;

  const promise = new Promise<void>((resolve) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onFrame(target);
      resolve();
      return;
    }

    const steps = 24;
    let step = 0;
    const start = Math.floor(Math.random() * villages.length);

    const tick = () => {
      if (cancelled) {
        resolve();
        return;
      }
      const id =
        step >= steps - 1 ? target : villages[(start + step) % villages.length].id;
      onFrame(id);
      step += 1;
      if (step >= steps) {
        resolve();
        return;
      }
      const progress = step / steps;
      const delay = 48 + progress * progress * 270;
      timer = window.setTimeout(tick, delay);
    };

    tick();
  });

  return {
    promise,
    cancel() {
      cancelled = true;
      window.clearTimeout(timer);
    },
  };
}
