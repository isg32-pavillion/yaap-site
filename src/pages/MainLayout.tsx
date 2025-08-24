import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SupportedDevices } from "@/components/SupportedDevices";
import { LatestNews } from "@/components/LatestNews";
import { Footer } from "@/components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SupportedDevices />
        <LatestNews />
      </main>
      <Footer />
    </div>
  );
}