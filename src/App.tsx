import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import RegisterMember from "./pages/RegisterMember";
import RegisterChurch from "./pages/RegisterChurch";
import ChurchSetup from "./pages/ChurchSetup";
import AreasSetup from "@/pages/setup/AreasSetup";
import InvitesSetup from "@/pages/setup/InvitesSetup";
import SchedulesSetup from "@/pages/setup/SchedulesSetup";
import MusicSetup from "@/pages/setup/MusicSetup";
import Invites from "@/pages/Invites";
import PasswordRecover from "./pages/PasswordRecover";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Availability from "./pages/Availability";
import Schedules from "./pages/Schedules";
import Chats from "./pages/Chats";
import ChatDetail from "./pages/ChatDetail";
import Musics from "./pages/Musics";
import ScaleCreate from "./pages/ScaleCreate";
import Admin from "./pages/Admin";
import ScheduleDetails from "./pages/ScheduleDetails";
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
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-member" element={<RegisterMember />} />
            <Route path="/register-church" element={<RegisterChurch />} />
            <Route path="/request-reset" element={<PasswordRecover />} />
            <Route path="/password-reset/:token" element={<PasswordReset />} />
            
            {/* Setup routes */}
            <Route path="/church-setup" element={<ChurchSetup />} />
           <Route path="/setup/areas" element={<AreasSetup />} />
           <Route path="/setup/invites" element={<InvitesSetup />} />
           <Route path="/setup/schedules" element={<SchedulesSetup />} />
           <Route path="/setup/music" element={<MusicSetup />} />
           <Route
             path="/invites"
             element={
               <PrivateRoute>
                 <Layout>
                   <Invites />
                 </Layout>
               </PrivateRoute>
             }
           />
            <Route
              path="/home"
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
              path="/schedules"
              element={
                <PrivateRoute>
                  <Layout>
                    <Schedules />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/schedules/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <ScheduleDetails />
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
              path="/chats/:chatId"
              element={
                <PrivateRoute>
                  <ChatDetail />
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
