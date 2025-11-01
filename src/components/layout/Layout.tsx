import { ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSafeArea } from "@/hooks/useSafeArea";
import { MobileBottomNav } from "../sidebar/MobileBottomNav";
import { MobileTopNav } from "../sidebar/MobileTopNav";
import { Greeting } from "../common/Greeting";
import { useLocation } from "react-router-dom";

export default function Layout({ children, disableMainPadding = false  }: { children: ReactNode, disableMainPadding?: boolean  }) {
  const isMobile = useIsMobile();
  const { getSafeAreaStyle, isLoading } = useSafeArea();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

  // Show loading state while safe area is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-echurch-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-echurch-600 mx-auto mb-4"></div>
          <p className="text-echurch-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return isMobile ? 
       (
        // ================= MOBILE =================
        <div className="w-full h-screen flex flex-col bg-echurch-50">
          {/* HEADER */}
          <header 
            className="flex items-center px-4 py-2 bg-white shadow-sm border-b sticky top-0 z-30"
            style={{ paddingTop: getSafeAreaStyle().paddingTop }}
          > 
            <MobileTopNav />
          </header>
  
          {/* MAIN */}
          <main
            className={`flex-1 bg-echurch-50 ${
              disableMainPadding ? "" : "px-2 sm:px-4 py-4 lg:py-8"
            } ${isMobile && !isChatDetail ? "pb-20" : ""} ${isChatDetail ? "overflow-hidden" : ""}`}
          >
            {children}
          </main>
  
          {/* FOOTER MOBILE */}
          <footer
              className="bg-white border-t text-center sticky bottom-0 z-50"
              style={{
                paddingBottom: getSafeAreaStyle().paddingBottom,
              }}
            >
            <MobileBottomNav />
          </footer>
        </div>
      ) : (
        // ================= DESKTOP =================
        <SidebarProvider>

          <div className="min-h-screen flex w-full bg-echurch-50">
            {/* Sidebar */}
            <AppSidebar  />
    
            <div className="flex-1 flex flex-col">
              {/* HEADER */}
              <header
                className="flex items-center justify-between p-4 bg-white bg-opacity-95 shadow-sm border-b"
              > 
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                </div>
                {isHomePage && (
                  <div className="flex-1 ml-6">
                    <Greeting />
                  </div>
                )}
              </header>
    
              {/* MAIN */}
              <main className="flex-1 px-2 sm:px-4 lg:px-12 py-4 lg:py-8 bg-echurch-50">
                {children}
              </main>
              
            </div>
          </div>
        </SidebarProvider>
      );
}
