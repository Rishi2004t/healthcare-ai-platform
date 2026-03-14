import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReportProvider } from "@/contexts/ReportContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import EmergencyButton from "@/components/EmergencyButton";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import PatientForm from "./pages/PatientForm";
import MyReports from "./pages/MyReports";
import MedicalProfile from "./pages/MedicalProfile";
import ConsultationRequest from "./pages/ConsultationRequest";
import MyConsultations from "./pages/MyConsultations";
import DiseaseSearch from "./pages/DiseaseSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <ReportProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <HashRouter>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route
                      path="/appointments"
                      element={
                        <ProtectedRoute>
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/otp" element={<OTP />} />
                    <Route
                      path="/medical-form"
                      element={
                        <ProtectedRoute>
                          <PatientForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/medical-profile"
                      element={
                        <ProtectedRoute>
                          <MedicalProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/consultation-request"
                      element={
                        <ProtectedRoute>
                          <ConsultationRequest />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-consultations"
                      element={
                        <ProtectedRoute>
                          <MyConsultations />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/medical-search"
                      element={
                        <ProtectedRoute>
                          <DiseaseSearch />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-reports"
                      element={
                        <ProtectedRoute>
                          <MyReports />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  {/* Emergency Help Button - Fixed Bottom Right */}
                  <EmergencyButton />
                </div>
              </HashRouter>
            </TooltipProvider>
          </ReportProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
