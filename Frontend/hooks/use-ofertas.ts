import { useState, useEffect } from "react";
import type { OfertaBase } from "@/types/Oferta";
import { getAllOffers, registerOffer, updateOffer as apiUpdateOffer, deleteOffer as apiDeleteOffer } from "@/lib/OfertaData";

export function useOferta() {
  const [offers, setOffers] = useState<OfertaBase[]>([]);
  const [newOfferTitle, setNewOfferTitle] = useState("");
  const [newOfferDescription, setNewOfferDescription] = useState("");
  const [newOfferPercentage, setNewOfferPercentage] = useState("");
  const [newOfferApplies, setNewOfferApplies] = useState("Todas");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [editedOffers, setEditedOffers] = useState<{ [id: string]: OfertaBase }>({});

  useEffect(() => {
    const editCopy = offers.reduce((acc, offer) => {
      acc[offer.id] = { ...offer };
      return acc;
    }, {} as { [id: string]: OfertaBase });
    setEditedOffers(editCopy);
  }, [offers]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const data = await getAllOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
    }
    fetchOffers();
  }, []);

  const addOffer = async (ofertaNueva: Omit<OfertaBase, "id">) => {
    try {
      const success = await registerOffer(ofertaNueva);
      if (success) {
        const data = await getAllOffers();
        setOffers(data);
        return true;
      } else {
        throw new Error("La operación de registro de oferta falló.");
      }
    } catch (error) {
      console.error("Error al crear oferta:", error);
      throw error;
    }
  };

  const updateOffer = async (ofertaEditada: OfertaBase) => {
    try {
      const ofertaParaActualizar = {
        id: ofertaEditada.id,
        titulo: ofertaEditada.titulo?.trim() || "",
        descripcion: ofertaEditada.descripcion?.trim() || "",
        porcentaje: parseFloat(ofertaEditada.porcentaje as any) || 0,
        aplica: ofertaEditada.aplica,
        fechaInicio: ofertaEditada.fechaInicio || "",
        fechaFin: ofertaEditada.fechaFin || "",
      };

      const success = await apiUpdateOffer(ofertaParaActualizar);
      if (success) {
        const data = await getAllOffers();
        setOffers(data);
        return true;
      } else {
        throw new Error("La operación de actualización de oferta falló.");
      }
    } catch (error) {
      console.error("Error al actualizar oferta:", error);
      throw error;
    }
  };

  const removeOffer = async (id: string) => {
    try {
      const success = await apiDeleteOffer(id);
      if (success) {
        setOffers(prev => prev.filter(offer => offer.id !== id));
        return true;
      } else {
        throw new Error("La operación de eliminación de oferta falló.");
      }
    } catch (error) {
      console.error("Error eliminando oferta:", error);
      throw error;
    }
  };

  const saveChanges = async () => {};

  return {
    offers,
    newOfferTitle,
    setNewOfferTitle,
    newOfferDescription,
    setNewOfferDescription,
    newOfferPercentage,
    setNewOfferPercentage,
    newOfferApplies,
    setNewOfferApplies,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    addOffer,
    updateOffer,
    removeOffer,
    saveChanges,
    editedOffers,
    setEditedOffers,
  };
}