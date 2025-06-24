"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { useContacto } from "@/hooks/use-contacto";
import { FullPageLoader } from "@/components/ui/full-page-loader";

export default function ContactenosPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const contacto = useContacto();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading || !contacto) {
    return <FullPageLoader />;
  }

  const { correo, telefono, codigoPostal } = contacto;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            <Sidebar />

            <div className="space-y-8">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-teal-700 mb-6">Contáctenos</h1>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <p className="font-medium text-lg">Hotel Los Viejos Resort</p>
                  <p>Tel: {telefono}</p>
                  <p>{codigoPostal}</p>
                  <p>
                    <a href={`mailto:${correo}`} className="text-teal-600 hover:underline">
                      {correo}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
