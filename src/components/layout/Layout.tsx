
import { ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Greeting } from "../common/Greeting";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-echurch-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b lg:hidden">
            <SidebarTrigger />
            <Greeting />
          </header>
          <main className="flex-1 px-4 lg:px-12 py-4 lg:py-8 bg-echurch-50">
            <div className="hidden lg:block mb-6">
              <Greeting />
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
