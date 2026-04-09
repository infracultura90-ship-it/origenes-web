import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import Experience from "@/components/Experience";
import MagistralFormulation from "@/components/MagistralFormulation";
import PlanetMonitoring from "@/components/PlanetMonitoring";
import RoboflowAnalyzer from "@/components/RoboflowAnalyzer";
import BiofactoryPortfolio from "@/components/BiofactoryPortfolio";
import Cultures from "@/components/Cultures";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminPage from "@/components/AdminPage";
import { useGoogleAnalytics } from "@/utils/analytics";

function LandingPage() {
  useGoogleAnalytics();

  return (
    <div className="App">
      <Header />
      <main>
        <div id="hero">
          <Hero />
        </div>
        <div id="servicios">
          <Services />
        </div>
        <div id="tecnologias">
          <Technologies />
        </div>
        <RoboflowAnalyzer />
        <PlanetMonitoring />
        <BiofactoryPortfolio />
        <div id="experiencia">
          <Experience />
        </div>
        <MagistralFormulation />
        <div id="cultivos">
          <Cultures />
        </div>
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
