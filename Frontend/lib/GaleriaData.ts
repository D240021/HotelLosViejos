import { ImagenGaleria } from "@/hooks/use-sobre-nosotros-editor";
import { API_URL } from "./services";
import type { GaleriaBase } from "@/types/Galeria";

export async function getAllGaleries() {
    const response = await fetch(`${API_URL}/galeria`);
    if (!response.ok) {
        throw new Error(`Error al obtener galerias: ${response.statusText}`);
    }

    return response.json() as Promise<GaleriaBase[]>;
}


export async function updateGaleries(galeria: ImagenGaleria[]) {
    const response = await fetch(`${API_URL}/galeria`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(galeria),
    });

    if (!response.ok) {
        throw new Error(`Error al actualizar galería: ${response.statusText}`);
    }

    return response.json() as Promise<GaleriaBase>;
}

