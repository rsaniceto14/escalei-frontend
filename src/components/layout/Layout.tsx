import { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Greeting } from "../common/Greeting";
import { Logo } from "../common/Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { SafeArea } from "capacitor-plugin-safe-area";

export default function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const getSafeAreaInsets = async () => {
      try {
        const insets = await SafeArea.getSafeAreaInsets();
        setSafeArea(insets.insets);
      } catch (error) {
        console.log('SafeArea not available:', error);
      }
    };

    getSafeAreaInsets();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-echurch-50" style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom
      }}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className={`flex items-center justify-between p-4 bg-white bg-opacity-95 shadow-sm border-b ${isMobile ? "sticky top-0 z-30" : ""}`}>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Logo className="scale-90" />
            </div>
          </header>
          <main className="flex-1 px-2 sm:px-4 lg:px-12 py-4 lg:py-8 bg-echurch-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
