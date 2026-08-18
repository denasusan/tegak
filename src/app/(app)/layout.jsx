import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export default function AppLayout({ children }) {
  const session = requireSession();

  return <AppShell session={session}>{children}</AppShell>;
}
