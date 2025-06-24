"use client";

import { useState, useEffect, useRef } from "react"; // Importa useRef
import { useSearchParams, useRouter } from "next/navigation";
import { updateHabitaciones, registerHabitaciones } from "@/lib/HabitacionData";
import { useHabitacion, useCaracteristisca } from "@/hooks/use-habitacion";

export function useEditarHabitacion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "";
  const numero = searchParams.get("numero") || "";

  const habitaciones = useHabitacion();
  const caracteristicas = useCaracteristisca();

  const todasLasCaracteristicas = caracteristicas.map((c) => ({
    value: c.id,
    label: c.titulo,
    data: c,
  }));

  const [username] = useState("USUARIO");

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const handleEditRoom = (tipo: string, numero: number) => {
    router.push(`/admin/dashboard/habitaciones/editar?tipo=${tipo}&numero=${numero}`);
  };

  const habitacionesFiltradasPorTipo = (tipo: string) => {
    return habitaciones.habitaciones.filter((h) => h.tipo === tipo);
  };

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    tarifaDiariaBase: 0,
    nombreImagen: "",
    caracteristicas: [] as string[],
    numero: "",
    estado: "",
    tipo: "",
  });

  const [filePreview, setFilePreview] = useState("");
  const [imageInputValue, setImageInputValue] = useState("");

  // Usar un ref para controlar si los datos iniciales ya fueron cargados
  const hasLoadedInitialData = useRef(false); 

  useEffect(() => {
    // Solo cargar datos si hay un número en la URL y las habitaciones están disponibles
    if (numero && habitaciones.habitaciones.length > 0 && !hasLoadedInitialData.current) {
      const habitacion = habitaciones.habitaciones.find((h) => String(h.id) === numero);

      if (habitacion) {
        setFormData({
          id: habitacion.id ? String(habitacion.id) : "",
          tarifaDiariaBase: habitacion.tarifaDiariaBase || 0,
          nombreImagen: habitacion.nombreImagen || "",
          caracteristicas: (habitacion.caracteristicas || []).map((c: any) => c.id),
          numero: habitacion.numero ? String(habitacion.numero) : "", // Establece el número inicial
          estado: habitacion.estado || "",
          tipo: habitacion.tipo || "",
        });
        setFilePreview(habitacion.nombreImagen || "");
        setImageInputValue(habitacion.nombreImagen || ""); // También inicializa el input de imagen
        hasLoadedInitialData.current = true; // Marca que los datos iniciales han sido cargados
      }
    }
  }, [numero, habitaciones.habitaciones]); // Dependencias: numero y habitaciones.habitaciones


  // Este useEffect se encargaría de actualizar los datos de la habitación en el listado
  // después de una operación de guardado exitosa, si fuera necesario para la UI.
  // Pero el problema de sobrescribir el input se soluciona con el ref.
  // Podrías tener una función 'refreshHabitaciones' en useHabitacion si necesitas
  // que el listado global se actualice inmediatamente después de un 'save'.


  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInputValue(e.target.value);
  };

    const handleAcceptClick = () => {
      if (formData.nombreImagen) {
        setFilePreview(formData.nombreImagen);
      }
    };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tarifaDiariaBase" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleCaracteristicasChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      caracteristicas: selectedValues,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const habitacionData = {
        id: formData.id,
        numero: Number(formData.numero),
        tarifaDiariaBase: formData.tarifaDiariaBase,
        nombreImagen: formData.nombreImagen,
        estado: formData.estado,
        tipo: formData.tipo,
        caracteristicasIds: formData.caracteristicas.map((id) => Number(id)),
      };

      // Validaciones
      if (!habitacionData.numero || habitacionData.numero <= 0) {
        throw new Error("El número de habitación debe ser un valor válido mayor que cero.");
      }
      if (!habitacionData.tarifaDiariaBase || habitacionData.tarifaDiariaBase <= 0) {
        throw new Error("La tarifa diaria debe ser un valor válido mayor que cero.");
      }
      if (!habitacionData.estado) {
        throw new Error("Por favor selecciona el estado de la habitación.");
      }
      if (!habitacionData.tipo) {
        throw new Error("Por favor selecciona el tipo de habitación.");
      }
      if (!habitacionData.nombreImagen.trim()) {
        throw new Error("La imagen de la habitación no puede estar vacía.");
      }
      if (habitacionData.caracteristicasIds.length === 0) {
        throw new Error("La habitación debe tener al menos una característica.");
      }

      if (formData.id) {
        const success = await updateHabitaciones(habitacionData);
        if (!success) {
          throw new Error("La actualización de la habitación falló.");
        }
      } else {
        const success = await registerHabitaciones(habitacionData);
        if (!success) {
          throw new Error("El registro de la habitación falló.");
        }
      }

      router.push("/admin/dashboard/habitaciones");
      return true;
    } catch (error: any) {
      console.error("Error al guardar cambios de habitación:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/dashboard/habitaciones");
  };

  const getTipoTitulo = () => {
    const tipos: { [key: string]: string } = {
      ESTANDAR: "Estándar",
      JUNIOR: "Junior",
      // Agrega más tipos si es necesario
    };
    return tipos[tipo] || tipo;
  };

  return {
    username,
    showDescriptionModal,
    setShowDescriptionModal,
    selectedRoomType,
    setSelectedRoomType,
    handleEditRoom,
    habitacionesFiltradasPorTipo,
    isSaving,
    formData,
    filePreview,
    imageInputValue,
    todasLasCaracteristicas,
    handleChange,
    handleCaracteristicasChange,
    handleImageUrlChange,
    handleAcceptClick,
    handleSave,
    handleBack,
    getTipoTitulo,
    setFormData,
    setFilePreview,
  };
}