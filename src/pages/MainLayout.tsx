import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SupportedDevices } from "@/components/SupportedDevices";
import { Footer } from "@/components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SupportedDevices />
      </main>
      <Footer />
    </div>
  );
}