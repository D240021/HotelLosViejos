"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { RoomTypeCard } from "@/components/rates/room-type-card";
import { useTarifas } from "@/hooks/use-tarifas";
import { FullPageLoader } from "@/components/ui/full-page-loader";

export default function TarifasPage() {
  const { habitacionesUnicasPorTipo, isLoading } = useTarifas();

  if (isLoading || habitacionesUnicasPorTipo.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            <Sidebar />

            <div className="space-y-8">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-teal-700 mb-6">
                Tarifas
              </h1>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
                <p className="text-gray-700 mb-4">
                  En Hotel Los Viejos ofrecemos diferentes tipos de habitaciones para satisfacer las necesidades de
                  todos nuestros huéspedes. Nuestras tarifas incluyen desayuno buffet, acceso a la piscina, gimnasio y
                  áreas comunes.
                </p>
                <p className="text-gray-700">
                  Las tarifas pueden variar según la temporada. Contáctenos directamente para obtener información sobre
                  descuentos para estadías prolongadas o grupos.
                </p>
              </div>

              <div className="space-y-8">
                {habitacionesUnicasPorTipo.map((habitacion) => (
                  <RoomTypeCard key={habitacion.id} habitacion={habitacion} />
                ))}
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-playfair font-bold text-teal-700 mb-4">Políticas de reserva</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Check-in: 3:00 PM / Check-out: 12:00 PM</li>
                  <li>Se requiere un depósito del 50% para confirmar la reserva</li>
                  <li>Cancelación gratuita hasta 7 días antes de la fecha de llegada</li>
                  <li>Niños menores de 5 años se hospedan gratis compartiendo cama con los padres</li>
                  <li>Mascotas no permitidas (excepto animales de servicio)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
