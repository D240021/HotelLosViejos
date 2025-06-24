"use client";
import { useEffect, useState, useRef } from "react";
import { getContact } from "@/lib/ContactoData";
import { ContactoBase } from "@/types/Contacto";

export const useContacto = () => {
  const [contacto, setContacto] = useState<ContactoBase | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    async function fetchData() {
      if (fetched.current) return;
      fetched.current = true;

      try {
        const contactos = await getContact();
        if (Array.isArray(contactos) && contactos.length > 0) {
          setContacto(contactos[0]);
        } else {
          setContacto({
            id: 0,
            correo: "",
            telefono: "",
            codigoPostal: "",
            direccion: "",
            latitud: "",
            longitud: "",
          });
        }
      } catch (error) {
        console.error("Error al obtener contactos:", error);
        setContacto({
          id: 0,
          correo: "",
          telefono: "",
          codigoPostal: "",
          direccion: "",
          latitud: "",
          longitud: "",
        });
      }
    }

    fetchData();
  }, []);

  return contacto ?? {
    id: 0,
    correo: "",
    telefono: "",
    codigoPostal: "",
    direccion: "",
    latitud: "",
    longitud: "",
  };
};