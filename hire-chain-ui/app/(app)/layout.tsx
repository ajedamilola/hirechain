import { AppNavigation } from "@/components/app-navigation";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppNavigation>
      {children}
      <Toaster richColors />
    </AppNavigation>
  );
}
