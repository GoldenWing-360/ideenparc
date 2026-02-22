import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const FinalCheck = lazy(() => import('./components/final/FinalCheck'));
const Home = lazy(() => import('./pages/Home'));
const Impressum = lazy(() => import('./pages/Impressum'));
const Datenschutz = lazy(() => import('./pages/Datenschutz'));
const CardStepper = lazy(() => import('./components/variant-a/CardStepper'));
const ScrollJourney = lazy(() => import('./components/variant-b/ScrollJourney'));
const StepWizard = lazy(() => import('./components/variant-c/StepWizard'));
const FocusMode = lazy(() => import('./components/variant-d/FocusMode'));
const CinematicMode = lazy(() => import('./components/variant-e/CinematicMode'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0F1A' }}>
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-[#00ADE0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>Lädt...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<FinalCheck />} />
          <Route path="/varianten" element={<Home />} />
          <Route path="/card-stepper" element={<CardStepper />} />
          <Route path="/scroll" element={<ScrollJourney />} />
          <Route path="/wizard" element={<StepWizard />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/cinematic" element={<CinematicMode />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
