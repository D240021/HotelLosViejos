"use client";

import { useEffect, useState } from "react";
import type { FacilidadBase } from "@/types/Facilidad";
import { getAllFacilities } from "@/lib/FacilidadData";

export const useFacilidad = () => {
    const [facilidades, setFacilidades] = useState<FacilidadBase[]>([]);

    const fetchFacilidades = async () => {
        try {
            const result = await getAllFacilities();
            setFacilidades(result);
        } catch (error) {
            console.error("Error al obtener facilidades:", error);
        }
    };

    useEffect(() => {
        fetchFacilidades();
    }, []);

    return { facilidades, fetchFacilidades };
};
