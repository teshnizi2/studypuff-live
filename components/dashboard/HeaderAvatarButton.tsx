"use client";

import Link from "next/link";

type Props = {
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  initial: string;
};

export const PROFILE_OPEN_EVENT = "studypuff:open-profile";

export function HeaderAvatarButton({ displayName, email, avatarUrl, initial }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    // Dashboard listens for this event and opens the profile popup.
    const dispatched = window.dispatchEvent(new CustomEvent(PROFILE_OPEN_EVENT));
    // If we're on the dashboard the listener prevents default navigation.
    if (window.location.pathname === "/dashboard" && dispatched) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href="/dashboard/profile"
      onClick={handleClick}
      className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-50 py-1 pl-1 pr-3 hover:bg-cream-100"
    >
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-butter text-xs font-semibold text-ink-900">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </span>
      <span className="text-ink-900">{displayName || email}</span>
    </Link>
  );
}
