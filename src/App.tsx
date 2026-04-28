import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Tracking from "./pages/Tracking.tsx";
import Calculadora from "./pages/Calculadora.tsx";
import Recogidas from "./pages/Recogidas.tsx";
import WelcomePopup from "./components/WelcomePopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WelcomePopup />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/seguimiento" element={<Tracking />} />
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/recogidas" element={<Recogidas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
