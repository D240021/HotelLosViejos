"use client";

import { useState, useEffect } from "react";
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

  //  Para /admin/dashboard/habitaciones
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const handleEditRoom = (tipo: string, numero: number) => {
    router.push(`/admin/dashboard/habitaciones/editar?tipo=${tipo}&numero=${numero}`);
  };

  const habitacionesFiltradasPorTipo = (tipo: string) => {
    return habitaciones.habitaciones.filter((h) => h.tipo === tipo);
  };

  //  Para /admin/dashboard/habitaciones/editar
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

  useEffect(() => {
    if (!numero || habitaciones.habitaciones.length === 0) return;

    const habitacion = habitaciones.habitaciones.find((h) => String(h.id) === numero);

    if (habitacion && formData.numero !== String(habitacion.numero)) {
      setFormData({
        id: habitacion.id ? String(habitacion.id) : "",
        tarifaDiariaBase: habitacion.tarifaDiariaBase || 0,
        nombreImagen: habitacion.nombreImagen || "",
        caracteristicas: (habitacion.caracteristicas || []).map((c: any) => c.id),
        numero: habitacion.numero ? String(habitacion.numero) : "",
        estado: habitacion.estado || "",
        tipo: habitacion.tipo || "",
      });
      setFilePreview(habitacion.nombreImagen || "");
    }
  }, [habitaciones, numero]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInputValue(e.target.value);
  };

    const handleAcceptClick = () => {
      if (formData.nombreImagen) {
        setFilePreview(formData.nombreImagen);
      }
    };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const habitacionData = {
      id: formData.id,
      numero: Number(formData.numero),
      tarifaDiariaBase: formData.tarifaDiariaBase,
      nombreImagen: formData.nombreImagen,
      estado: formData.estado,
      tipo: formData.tipo,
      caracteristicasIds: formData.caracteristicas.map((id) => Number(id)),
    };

    if (!formData.numero || !formData.estado || !formData.tipo || !formData.tarifaDiariaBase) {
      alert("Por favor completa todos los campos obligatorios.");
      setIsSaving(false);
      return;
    }

    if (formData.id) {
      await updateHabitaciones(habitacionData);
    } else {
      await registerHabitaciones(habitacionData);
    }

    alert("Cambios guardados correctamente");
    router.push("/admin/dashboard/habitaciones");
  };

  const handleBack = () => {
    router.push("/admin/dashboard/habitaciones");
  };

  const getTipoTitulo = () => {
    const tipos = {
      standard: "Standard",
      junior: "Junior",
      deluxe: "Deluxe",
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  return {
    username,

    //  Para administrar habitaciones
    showDescriptionModal,
    setShowDescriptionModal,
    selectedRoomType,
    setSelectedRoomType,
    handleEditRoom,
    habitacionesFiltradasPorTipo,

    //  Para editar habitaciones
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
