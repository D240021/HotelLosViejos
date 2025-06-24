"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { ParallaxSection } from "@/components/ui/parallax-section";
import { Spinner } from "@/components/ui/spinner";
import { useInformacion } from "@/hooks/use-informacion";

interface WelcomeSectionProps {
  content: {
    title: string;
    paragraphs: string[];
    image: {
      src: string;
      alt: string;
    };
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton: {
      text: string;
      href: string;
    };
  };
}

export function WelcomeSection({ content }: WelcomeSectionProps) {
  const { image } = content;
  const { textoBienvenida, nombre, nombreImagenBienvenida } = useInformacion();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Solo se activa cuando hay datos mínimos
    if (nombre && textoBienvenida && nombreImagenBienvenida) {
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    }
  }, [nombre, textoBienvenida, nombreImagenBienvenida]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <ParallaxSection>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-[450px] md:h-full overflow-hidden group">
            <Image
              src={nombreImagenBienvenida || "/placeholder.svg?height=600&width=800"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-teal-700 mb-6">
              Bienvenidos al {nombre}
            </h2>

            {(textoBienvenida || "").split(";").map((texto, index) => (
              <React.Fragment key={index}>
                <p>{texto.trim()}</p>
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
