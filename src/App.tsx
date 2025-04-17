import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/AuthContext";
import PrivateRoute from "@/components/auth/PrivateRoute";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import NotFound from "./pages/NotFound";

// Prescription Pages
import Prescriptions from "./pages/Prescriptions";
import PrescriptionCreate from "./pages/PrescriptionCreate";
import PrescriptionEdit from "./pages/PrescriptionEdit";
import PrescriptionView from "./pages/PrescriptionView";

// Invoice Pages
import Invoices from "./pages/Invoices";
import InvoiceCreate from "./pages/InvoiceCreate";
import InvoiceView from "./pages/InvoiceView";
import InvoiceEdit from "./pages/InvoiceEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <PrivateRoute>
                  <Patients />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/medical-records" 
              element={
                <PrivateRoute>
                  <MedicalRecords />
                </PrivateRoute>
              } 
            />
            {/* Prescription Routes */}
            <Route 
              path="/prescriptions" 
              element={
                <PrivateRoute>
                  <Prescriptions />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/prescriptions/new" 
              element={
                <PrivateRoute>
                  <PrescriptionCreate />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/prescriptions/edit/:id" 
              element={
                <PrivateRoute>
                  <PrescriptionEdit />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/prescriptions/view/:id" 
              element={
                <PrivateRoute>
                  <PrescriptionView />
                </PrivateRoute>
              } 
            />
            {/* Invoice Routes */}
            <Route 
              path="/invoices" 
              element={
                <PrivateRoute>
                  <Invoices />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/invoices/new" 
              element={
                <PrivateRoute>
                  <InvoiceCreate />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/invoices/view/:id" 
              element={
                <PrivateRoute>
                  <InvoiceView />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/invoices/edit/:id" 
              element={
                <PrivateRoute>
                  <InvoiceEdit />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
