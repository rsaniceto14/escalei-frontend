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
import Settings from "./pages/Settings";
import Availability from "./pages/Availability";
import Scales from "./pages/Scales";
import Chats from "./pages/Chats";
import Musics from "./pages/Musics";
import ScaleCreate from "./pages/ScaleCreate";
import Admin from "./pages/Admin";
import ScaleDetails from "./pages/ScaleDetails";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/route/privateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar" element={<PasswordRecover />} />
            <Route path="/codigo" element={<PasswordCode />} />
            <Route path="/redefinir" element={<PasswordReset />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/scales"
              element={
                <PrivateRoute>
                  <Layout>
                    <Scales />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/scales/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <ScaleDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/availability"
              element={
                <PrivateRoute>
                  <Layout>
                    <Availability />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <PrivateRoute>
                  <Layout>
                    <Chats />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/musics"
              element={
                <PrivateRoute>
                  <Layout>
                    <Musics />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/scales/create"
              element={
                <PrivateRoute>
                  <Layout>
                    <ScaleCreate />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Layout>
                    <Admin />
                  </Layout>
                </PrivateRoute>
              }
            />
            {/* catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
