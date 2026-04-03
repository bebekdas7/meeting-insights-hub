import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/layouts/AppLayout";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard";
import UploadPage from "./pages/UploadMeeting";
import MyMeetingsPage from "./pages/MyMeetings";
import MeetingDetailPage from "./pages/MeetingDetail";
import ActionItemsPage from "./pages/ActionItems";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import PurchaseHistoryPage from "./pages/PurchaseHistory";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/meetings" element={<ProtectedRoute><MyMeetingsPage /></ProtectedRoute>} />
    <Route path="/meetings/:id" element={<ProtectedRoute><MeetingDetailPage /></ProtectedRoute>} />
    <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
    <Route path="/action-items" element={<ProtectedRoute><ActionItemsPage /></ProtectedRoute>} />
    <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
    <Route path="/purchase-history" element={<ProtectedRoute><PurchaseHistoryPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
