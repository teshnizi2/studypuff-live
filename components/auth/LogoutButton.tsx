import { logoutAction } from "@/app/(auth)/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="nav-link text-sm text-ink-700">
        Log out
      </button>
    </form>
  );
}
