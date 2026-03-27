import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './assets/css/global.css';
import DocumentAnalyzerPage from './pages/DocumentAnalyzerPage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DocumentAnalyzerPage />} />
    </Routes>
  </BrowserRouter>
)
