import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePage from "@/pages/CreatePage";
import PlayPage from "@/pages/PlayPage";
import HistoryPage from "@/pages/HistoryPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={<CreatePage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </ErrorBoundary>
        </main>
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
