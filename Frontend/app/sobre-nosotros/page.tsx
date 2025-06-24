"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { AboutHero } from "@/components/about/about-hero";
import { AboutContent } from "@/components/about/about-content";
import { AboutGallery } from "@/components/about/about-gallery";
import { useInformacion } from "@/hooks/use-informacion";
import { useGaleria } from "@/hooks/use-galeria";
import { FullPageLoader } from "@/components/ui/full-page-loader";

export default function SobreNosotrosPage() {
  const { textoSobreNosotros } = useInformacion();
  const { galerias } = useGaleria();

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) return <FullPageLoader />;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            <Sidebar />

            <div className="space-y-12">
              <AboutHero title="Sobre Nosotros" />
              <AboutContent content={textoSobreNosotros} />
              <AboutGallery images={galerias} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
