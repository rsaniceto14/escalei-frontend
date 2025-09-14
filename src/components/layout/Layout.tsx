import { ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Greeting } from "../common/Greeting";
import { Logo } from "../common/Logo";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-echurch-50 safe-area-padding">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className={`flex items-center justify-between p-4 bg-white bg-opacity-95 shadow-sm border-b ${isMobile ? "sticky z-30" : ""}`} style={{top: isMobile ? 'var(--safe-area-inset-top)' : 0}}>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Logo className="scale-90" />
            </div>
          </header>
          <main className="flex-1 px-2 sm:px-4 lg:px-12 py-4 lg:py-8 bg-echurch-50 safe-area-bottom">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
