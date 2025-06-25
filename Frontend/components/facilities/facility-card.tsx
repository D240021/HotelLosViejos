import Image from "next/image";
import type { Facility } from "@/types";
import { FacilidadBase } from "@/types/Facilidad";

interface FacilityCardProps {
  facility: FacilidadBase;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { id, titulo, descripcion, nombreImagen } = facility;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up">
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="relative h-[250px] md:h-full overflow-hidden group">
          <Image
            src={nombreImagen || "/placeholder.svg?height=300&width=300"}
            alt={titulo || ""}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-playfair font-bold text-teal-700 mb-3 group-hover:text-teal-500 transition-colors">
            {titulo}
          </h2>

          <p className="text-gray-700">{descripcion}</p>
        </div>
      </div>

      {/* Línea decorativa animada */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
}
