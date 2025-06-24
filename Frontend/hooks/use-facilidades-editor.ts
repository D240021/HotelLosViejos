import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFacilidad } from "@/hooks/use-facilidades";
import { updateFacilities, registerFacilities, deleteFacility } from "@/lib/FacilidadData";
import type { FacilidadBase } from "@/types/Facilidad";

interface FacilidadesData {
    facilidades: FacilidadBase[];
}

export function useFacilidadesEditor(onChange?: (data: FacilidadesData) => void) {
    const { facilidades: initialFacilidades, fetchFacilidades } = useFacilidad();


    const [data, setData] = useState<FacilidadesData>({ facilidades: [] });

    // Estado unificado para el manejo de alertas
    const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

    // Estado de guardado global
    const [isSaving, setIsSaving] = useState(false);

    // Estados para confirmación de eliminación
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState<number | null>(null);


    useEffect(() => {
        if (initialFacilidades) {
            const clonedFacilidades = initialFacilidades.map(fac => ({ ...fac }));
            setData({ facilidades: clonedFacilidades });
        }
    }, [initialFacilidades]);



    // Efecto para limpiar las alertas después de un tiempo
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Función para notificar cambios externos (si se proporciona un onChange)
    const notifyChange = (newData: FacilidadesData) => {
        setData(newData);
        onChange?.(newData);
    };

    const handleChange = (index: number, field: keyof FacilidadBase, value: string) => {
        if (!data || !data.facilidades) return;

        const copy = [...data.facilidades];
        copy[index] = { ...copy[index], [field]: value };
        notifyChange({ facilidades: copy });
        setAlert(null); // Limpiar cualquier alerta de validación al cambiar un campo
    };

    const handleAdd = () => {
        const nueva: FacilidadBase & { _uuid: string } = {
            id: 0,
            titulo: "",
            descripcion: "",
            nombreImagen: "/placeholder.svg?height=300&width=400",
            _uuid: uuidv4(), // ID temporal único para React y lógica interna
        };
        notifyChange({ facilidades: [...data.facilidades, nueva] });
        setAlert(null);
    };

    const handleRemove = (index: number) => {
        setIndexToDelete(index);
        setShowConfirmDelete(true);
        setAlert(null); // Limpiar alerta al intentar eliminar
    };

    const confirmDelete = async () => {
        if (indexToDelete === null || !data || !data.facilidades) return;

        const facilidad = data.facilidades[indexToDelete];

        setIsSaving(true); // Se usa el estado de guardado global
        setAlert(null);

        try {
            if (typeof facilidad.id === "number") {
                await deleteFacility(facilidad.id);
            }

            const copy = [...data.facilidades];
            copy.splice(indexToDelete, 1);
            notifyChange({ facilidades: copy });

            setAlert({
                type: "success",
                title: "Eliminado",
                message: "Facilidad eliminada con éxito.",
            });
        } catch (error) {
            console.error("Error al eliminar facilidad:", error);
            setAlert({
                type: "error",
                title: "Error al Eliminar",
                message: "Ocurrió un error al eliminar la facilidad. Intente de nuevo.",
            });
        } finally {
            setShowConfirmDelete(false);
            setIndexToDelete(null);
            setIsSaving(false);
        }
    };

    const handleReorder = (index: number, dir: "up" | "down") => {
        if (!data || !data.facilidades) return;

        if ((dir === "up" && index === 0) || (dir === "down" && index === data.facilidades.length - 1)) return;

        const next = dir === "up" ? index - 1 : index + 1;
        const copy = [...data.facilidades];
        [copy[index], copy[next]] = [copy[next], copy[index]]; // Intercambio de elementos
        notifyChange({ facilidades: copy });
        setAlert(null); // Limpiar alerta al reordenar
    };

    const validateFacilidad = (facilidad: FacilidadBase): string | null => {
        if (!facilidad.titulo || facilidad.titulo.trim() === "") return "El título de la facilidad no puede estar vacío.";
        if (!facilidad.descripcion || facilidad.descripcion.trim() === "") return "La descripción de la facilidad no puede estar vacía.";
        if (!facilidad.nombreImagen || facilidad.nombreImagen.trim() === "" || facilidad.nombreImagen.includes("placeholder.svg"))
            return "Por favor, cargue una imagen válida para la facilidad.";
        return null;
    };

const handleSave = async () => {
    if (!data || !data.facilidades) return;

    // Validar todas las facilidades antes de intentar guardar
    for (const facilidad of data.facilidades) {
        const validationMessage = validateFacilidad(facilidad);
        if (validationMessage) {
            setAlert({
                type: "error",
                title: "Error de Validación",
                message: `Algunas facilidades tienen errores: ${validationMessage}`,
            });
            return;
        }
    }

    setIsSaving(true);
    setAlert(null);

    try {
        const updatedFacilidades: (FacilidadBase & { _uuid: string })[] = [];

        for (const facilidad of data.facilidades) {
            const { _uuid } = facilidad as any;

           if (!facilidad.id || facilidad.id === 0) {
               const { id, _uuid: ignored, ...facSinId } = facilidad as any;
               const registeredFac = await registerFacilities(facSinId);

               updatedFacilidades.push({
                   ...facilidad,
                   ...registeredFac, // esto debe ir DESPUÉS para sobreescribir el id: 0
                   _uuid,
               });
           }
 else {
               await updateFacilities(facilidad);
               updatedFacilidades.push(facilidad as any);
           }

        }

        notifyChange({ facilidades: updatedFacilidades });

        setAlert({
            type: "success",
            title: "Cambios Guardados",
            message: "Todas las facilidades han sido guardadas con éxito.",
        });
    } catch (error: any) {
        console.error("Error al guardar todas las facilidades:", error);
        setAlert({
            type: "error",
            title: "Error al Guardar",
            message: `Ocurrió un error al guardar los cambios: ${error.message || "Error desconocido"}`,
        });
    } finally {
        await fetchFacilidades();

        setIsSaving(false);
    }
};

    return {
        facilidades: data.facilidades,
        isSaving,
        // savingIndex ya no es necesario aquí
        handleChange,
        handleAdd,
        handleRemove,
        handleReorder,
        handleSave, // Ahora sin argumentos
        showConfirmDelete,
        setShowConfirmDelete,
        confirmDelete,
        alert,
        setAlert,
    };
}