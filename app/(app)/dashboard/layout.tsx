import { requireUser } from "@/lib/auth/guards";

// Set the time-of-day on <html> BEFORE first paint so the AmbientScene sky
// renders in the correct palette immediately — no flash of the default "day"
// sky at night. AmbientScene keeps it in sync afterwards.
const TOD_SCRIPT = `(function(){try{var h=new Date().getHours();document.documentElement.dataset.tod=h>=5&&h<9?'dawn':h>=9&&h<17?'day':h>=17&&h<21?'dusk':'night';}catch(e){}})();`;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: TOD_SCRIPT }} />
      {children}
    </>
  );
}
