import type { ReactNode } from "react";
import type { VillageId } from "@/lib/villages";

const marks: Record<VillageId, ReactNode> = {
  konoha: (
    <>
      <path
        d="M32 13c6 8 13 14 11 25-2 10-7 15-11 17-4-2-9-7-11-17-2-11 5-17 11-25z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M32 22v24" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M32 30c-5 1-8 5-8 5M32 35c5 1 8 5 8 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  suna: (
    <>
      <path
        d="M8 34c6-9 12-9 18 0s12 9 18 0 12-9 18 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 46c6-8 11-8 16 0s10 8 16 0 10-8 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="46" cy="18" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  kiri: (
    <>
      <path
        d="M14 24c6 4 10-4 18-4s12 8 18 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 34c7 4 11-4 20-4s13 8 20 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 44c6 4 10-4 16-4s10 8 16 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  kumo: (
    <>
      <path
        d="M18 36c0-7 5-11 11-9 2-6 9-8 14-4 7-1 12 4 11 9 5 1 7 8 2 12H18c-5-2-7-7 0-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M34 40l-4 7h6l-4 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  ),
  iwa: (
    <>
      <path
        d="M32 12l16 8v14L32 52 16 34V20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 20l16 10 16-10M32 30v22" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  ame: (
    <>
      <path
        d="M18 16v8M32 12v10M46 16v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M14 32h36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 32c0 10 5 16 12 20 7-4 12-10 12-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M24 46v6M32 50v6M40 46v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
};

export function VillageMark({
  id,
  className,
}: {
  id: VillageId;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.45"
      />
      {marks[id]}
    </svg>
  );
}

export function SiteSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <polygon
        points="32,4 56,18 56,46 32,60 8,46 8,18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="32" cy="32" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 23l6 9-6 9-6-9z" fill="currentColor" />
    </svg>
  );
}
