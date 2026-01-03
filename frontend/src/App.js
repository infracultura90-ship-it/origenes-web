import React, { useEffect } from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import Experience from "@/components/Experience";
import MagistralFormulation from "@/components/MagistralFormulation";
import Cultures from "@/components/Cultures";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useGoogleAnalytics } from "@/utils/analytics";

function App() {
  // Initialize Google Analytics
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

export default App;
