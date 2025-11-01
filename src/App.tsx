import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { initializeDemoData } from "@/utils/initData";

// Pages
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import ManageDonations from "./pages/donor/ManageDonations";
import DonorProfile from "./pages/donor/DonorProfile";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import BrowseDonations from "./pages/ngo/BrowseDonations";
import MyClaims from "./pages/ngo/MyClaims";
import NGOProfile from "./pages/ngo/NGOProfile";
import DonationDetail from "./pages/DonationDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              
              {/* Donor Routes */}
              <Route path="/donor/dashboard" element={<ProtectedRoute requireRole="donor"><DonorDashboard /></ProtectedRoute>} />
              <Route path="/donor/create-donation" element={<ProtectedRoute requireRole="donor"><CreateDonation /></ProtectedRoute>} />
              <Route path="/donor/donations" element={<ProtectedRoute requireRole="donor"><ManageDonations /></ProtectedRoute>} />
              <Route path="/donor/profile" element={<ProtectedRoute requireRole="donor"><DonorProfile /></ProtectedRoute>} />
              
              {/* NGO Routes */}
              <Route path="/ngo/dashboard" element={<ProtectedRoute requireRole="ngo"><NgoDashboard /></ProtectedRoute>} />
              <Route path="/ngo/browse" element={<ProtectedRoute requireRole="ngo"><BrowseDonations /></ProtectedRoute>} />
              <Route path="/ngo/my-claims" element={<ProtectedRoute requireRole="ngo"><MyClaims /></ProtectedRoute>} />
              <Route path="/ngo/profile" element={<ProtectedRoute requireRole="ngo"><NGOProfile /></ProtectedRoute>} />
              
              {/* Shared Routes */}
              <Route path="/donation/:id" element={<ProtectedRoute><DonationDetail /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
