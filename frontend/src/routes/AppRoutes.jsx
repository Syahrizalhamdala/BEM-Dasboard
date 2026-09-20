import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarContext";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import GuestRoute from "../components/auth/GuestRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PublicMagang from "../pages/Magang/PublicMagang";
import Home from "../pages/Home/Home";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Anggota = lazy(() => import("../pages/Anggota/Anggota"));
const Agenda = lazy(() => import("../pages/Agenda/Agenda"));
const Absensi = lazy(() => import("../pages/Absensi/Absensi"));
const Chatbot = lazy(() => import("../pages/Chatbot/Chatbot"));
const Laporan = lazy(() => import("../pages/Report/Report"));
const ImportData = lazy(() => import("../pages/ImportData/ImportData"));
const Pengaturan = lazy(() => import("../pages/Pengaturan/Pengaturan"));
const ProposalCheck = lazy(() => import("../pages/ProposalCheck/ProposalCheck"));
const ReviewQueue = lazy(() => import("../pages/ProposalCheck/ReviewQueue"));
const ApprovalSign = lazy(() => import("../pages/ProposalCheck/ApprovalSign"));
const AdminMagang = lazy(() => import("../pages/Magang/AdminMagang"));

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/anggota': 'Anggota',
  '/agenda': 'Agenda',
  '/absensi': 'Absensi',
  '/chatbot': 'Chatbot',
  '/laporan': 'Laporan',
  '/import-data': 'Import Data',
  '/pengaturan': 'Pengaturan',
  '/proposal-check': 'Cek Proposal',
  '/review-proposal': 'Review Proposal',
  '/approval': 'Tanda Tangan',
  '/admin/magang': 'Program Magang',
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Memuat...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/magang" element={<PublicMagang />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <DashboardLayout title="Dashboard">
                    <Dashboard />
                  </DashboardLayout>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          {[
            { path: "/anggota", Component: Anggota },
            { path: "/agenda", Component: Agenda },
            { path: "/absensi", Component: Absensi },
            { path: "/proposal-check", Component: ProposalCheck },
            { path: "/review-proposal", Component: ReviewQueue },
            { path: "/approval", Component: ApprovalSign },
            { path: "/chatbot", Component: Chatbot },
            { path: "/laporan", Component: Laporan },
            { path: "/import-data", Component: ImportData },
            { path: "/pengaturan", Component: Pengaturan },
            { path: "/admin/magang", Component: AdminMagang },
          ].map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <DashboardLayout title={pageTitles[path]}>
                      <Component />
                    </DashboardLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
