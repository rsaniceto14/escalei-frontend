
import { ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-echurch-50">
      <AppSidebar />
      <main className="flex-1 px-12 py-8 bg-echurch-50">
        {children}
      </main>
    </div>
  );
}
