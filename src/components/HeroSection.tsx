import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import yaaplogo from "@/assets/yaaplogo.svg";

import heroPhone1 from "@/assets/ss/about.webp";
import heroTablet1 from "@/assets/ss/33.webp";
import heroPhone2 from "@/assets/ss/22.webp";

import heroPhon3 from "@/assets/ss/17.webp";
import heroTablet3 from "@/assets/ss/6.webp";
import heroPhone3 from "@/assets/ss/8.webp";


const slideImages = [
  {
    src: heroPhone1,
    alt: "YAAP Android OS on smartphone"
  },
  {
    src: heroTablet1,
    alt: "YAAP Android OS on tablet"
  },
  {
    src: heroPhone2,
    alt: "YAAP OS home screen"
  },
  {
    src: heroPhon3,
    alt: "YAAP Android OS on smartphone"
  },
  {
    src: heroTablet3,
    alt: "YAAP Android OS on tablet"
  },
  {
    src: heroPhone3,
    alt: "YAAP OS home screen"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <img src={yaaplogo} alt="" />
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                An Android-based open source operating system for various devices.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="gradient"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                View Devices
              </Button>
            </div>
          </div>

          {/* Right Column - Slideshow */}
          <div className="relative flex justify-center">
            <div className="relative aspect-[9/20] w-64 rounded-2xl overflow-hidden shadow-card">
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slideImages.map((image, index) => (
                  <div key={index} className="h-full flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background/90 transition-smooth"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background/90 transition-smooth"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slideImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-smooth ${
                      index === currentSlide
                        ? "bg-accent shadow-accent-glow"
                        : "bg-muted hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}