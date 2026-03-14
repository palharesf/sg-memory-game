import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// CreatePage is the home/landing page — keep eager so it's instant.
// All other routes are lazy-loaded: players typically land directly on /play/:id
// from a giveaway link, so deferring the other pages saves parse time.
import CreatePage from "@/pages/CreatePage";
const PlayPage = lazy(() => import("@/pages/PlayPage"));
const HistoryPage = lazy(() => import("@/pages/HistoryPage"));
const ThemePage = lazy(() => import("@/pages/ThemePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <p className="text-[var(--color-text-muted)] animate-pulse">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<CreatePage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
