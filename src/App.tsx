import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePage from "@/pages/CreatePage";
import PlayPage from "@/pages/PlayPage";
import HistoryPage from "@/pages/HistoryPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Header from "@/components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CreatePage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
