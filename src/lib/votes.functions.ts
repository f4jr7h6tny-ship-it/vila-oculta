import { createServerFn } from "@tanstack/react-start";
import { VILLAGE_IDS, isVillageId, type VillageId } from "@/lib/villages";

export type VoteRow = { id: VillageId; votes: number };

export type Board = {
  total: number;
  villages: VoteRow[];
};

function assertVillage(data: unknown): { villageId: VillageId } {
  if (
    typeof data === "object" &&
    data !== null &&
    "villageId" in data &&
    typeof data.villageId === "string" &&
    isVillageId(data.villageId)
  ) {
    return { villageId: data.villageId };
  }
  throw new Error("Vila inválida.");
}

async function readBoard(): Promise<Board> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ id: string; votes: number }>`
    select id, votes from village_votes
  `;
  const counts = new Map(rows.map((row) => [row.id, Number(row.votes)]));
  const villages = VILLAGE_IDS.map((id) => ({
    id,
    votes: counts.get(id) ?? 0,
  }));
  const total = villages.reduce((sum, village) => sum + village.votes, 0);
  return { total, villages };
}

export const getResults = createServerFn({ method: "POST" }).handler(async () => {
  return readBoard();
});

export const castVote = createServerFn({ method: "POST" })
  .validator(assertVillage)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const updated = await sql<{ id: string }>`
      update village_votes
      set votes = votes + 1
      where id = ${data.villageId}
      returning id
    `;
    if (updated.length === 0) throw new Error("Vila não encontrada.");
    return readBoard();
  });
