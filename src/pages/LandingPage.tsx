import React from "react";
import { Hero } from "../components/ui/Hero";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Features } from "@/components/ui/Features";
import { UseCases } from "@/components/ui/UseCases";
import { Pricing } from "@/components/ui/Pricinf";
import { Testimonials } from "@/components/ui/Testimonials";
import { FinalCTA } from "@/components/ui/FinalCTA";
import { Footer } from "@/components/ui/Footer";

const LandingPage: React.FC = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <UseCases />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default LandingPage;
