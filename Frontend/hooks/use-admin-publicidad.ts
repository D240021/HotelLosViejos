import { useState, useEffect } from "react";
import type { PublicidadBase } from "@/types/Publicidad";
import {
  getAllAds,
  registerAd,
  updateAd,
  deleteAd,
} from "@/lib/Publicidad";

export function usePublicidad() {
  const [ads, setAds] = useState<PublicidadBase[]>([]);
  const [newAdNombre, setNewAdNombre] = useState("");
  const [newAdTitulo, setNewAdTitulo] = useState("");
  const [newAdDescripcion, setNewAdDescripcion] = useState("");
  const [newAdImagen, setNewAdImagen] = useState("");
  const [newAdEnlace, setNewAdEnlace] = useState("");

  useEffect(() => {
    async function fetchPublicidad() {
      try {
        const data = await getAllAds();
        setAds(data);
      } catch (error) {
        console.error("Error al obtener publicidad:", error);
      }
    }
    fetchPublicidad();
  }, []);

  const addPublicidad = async (nuevaPublicidadData: Omit<PublicidadBase, "id">) => {
    try {
      const success = await registerAd(nuevaPublicidadData);
      if (success) {
        const data = await getAllAds();
        setAds(data);
        return true;
      } else {
        throw new Error("La operación de registro falló.");
      }
    } catch (error) {
      console.error("Error al crear publicidad:", error);
      throw error;
    }
  };

  const updatePublicidad = async (publicidadEditada: PublicidadBase) => {
    try {
      const payload: PublicidadBase = {
        id: publicidadEditada.id!,
        nombre: publicidadEditada.nombre?.trim() || "",
        titulo: publicidadEditada.titulo?.trim() || "",
        descripcion: publicidadEditada.descripcion?.trim() || "",
        imagen: publicidadEditada.imagen?.trim() || "",
        enlace: publicidadEditada.enlace?.trim() || "",
      };

      const success = await updateAd(payload);
      if (success) {
        const data = await getAllAds();
        setAds(data);
        return true;
      } else {
        throw new Error("La operación de actualización falló.");
      }
    } catch (error) {
      console.error("Error al actualizar publicidad:", error);
      throw error;
    }
  };

  const removePublicidad = async (id: number) => {
    try {
      const success = await deleteAd(id);
      if (success) {
        setAds(prev => prev.filter(ad => ad.id !== id));
        return true;
      } else {
        throw new Error("La operación de eliminación falló.");
      }
    } catch (error) {
      console.error("Error eliminando publicidad:", error);
      throw error;
    }
  };

  return {
    ads,
    newAdNombre,
    setNewAdNombre,
    newAdTitulo,
    setNewAdTitulo,
    newAdDescripcion,
    setNewAdDescripcion,
    newAdImagen,
    setNewAdImagen,
    newAdEnlace,
    setNewAdEnlace,
    addPublicidad,
    updatePublicidad,
    removePublicidad,
  };
}