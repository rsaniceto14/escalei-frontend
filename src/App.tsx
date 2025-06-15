
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PasswordRecover from "./pages/PasswordRecover";
import PasswordCode from "./pages/PasswordCode";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import Scales from "./pages/Scales";
import Chats from "./pages/Chats";
import Musics from "./pages/Musics";
import ScaleCreate from "./pages/ScaleCreate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar" element={<PasswordRecover />} />
          <Route path="/codigo" element={<PasswordCode />} />
          <Route path="/redefinir" element={<PasswordReset />} />
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/scales"
            element={
              <Layout>
                <Scales />
              </Layout>
            }
          />
          <Route
            path="/chats"
            element={
              <Layout>
                <Chats />
              </Layout>
            }
          />
          <Route
            path="/musics"
            element={
              <Layout>
                <Musics />
              </Layout>
            }
          />
          <Route
            path="/scales/create"
            element={
              <Layout>
                <ScaleCreate />
              </Layout>
            }
          />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
