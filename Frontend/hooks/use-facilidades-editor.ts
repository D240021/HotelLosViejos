import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFacilidad } from "@/hooks/use-facilidades";
import { updateFacilities, registerFacilities, deleteFacility } from "@/lib/FacilidadData";
import type { FacilidadBase } from "@/types/Facilidad";

interface FacilidadesData {
    facilidades: FacilidadBase[];
}

export function useFacilidadesEditor(onChange?: (data: FacilidadesData) => void) {
    const { facilidades: initialFacilidades } = useFacilidad();
    const [data, setData] = useState<FacilidadesData>({ facilidades: [] });

    // Estado unificado para el manejo de alertas
    const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

    // Estado de guardado global
    const [isSaving, setIsSaving] = useState(false);

    // Estados para confirmación de eliminación
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState<number | null>(null);

    // Usamos un ref para saber si los datos ya se han cargado e inicializado por primera vez
    const hasInitialized = useRef(false);

    // Efecto para inicializar el estado 'data' solo una vez con los datos de 'useFacilidad'
    useEffect(() => {
        if (initialFacilidades && initialFacilidades.length > 0 && !hasInitialized.current) {
            const clonedFacilidades = initialFacilidades.map(fac => ({ ...fac }));
            setData({ facilidades: clonedFacilidades });
            hasInitialized.current = true;
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
        const nueva: FacilidadBase = {
            id: Date.now(), // ID temporal para la UI
            titulo: "",
            descripcion: "",
            nombreImagen: "/placeholder.svg?height=300&width=400",
        };
        notifyChange({ facilidades: [...data.facilidades, nueva] });
        setAlert(null); // Limpiar alerta al añadir
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

    // La función handleSave ahora procesará todas las facilidades
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
                return; // Detener el guardado si hay un error
            }
        }

        setIsSaving(true);
        setAlert(null);

        try {
            const updatesPromises: Promise<FacilidadBase | void>[] = [];
            const newFacilidadesMap = new Map<number, FacilidadBase>(); // Para mapear IDs temporales a IDs reales

            for (let i = 0; i < data.facilidades.length; i++) {
                const facilidadToSave = data.facilidades[i];
                const isNew = typeof facilidadToSave.id !== "number";

                if (isNew) {
                    const { id: tempId, ...facilidadWithoutTempId } = facilidadToSave;
                    updatesPromises.push(
                        registerFacilities(facilidadWithoutTempId).then(registeredFac => {
                            newFacilidadesMap.set(tempId as number, registeredFac);
                        })
                    );
                } else {
                    updatesPromises.push(updateFacilities(facilidadToSave));
                }
            }

            await Promise.all(updatesPromises);

            // Actualizar el estado con los IDs reales para las nuevas facilidades
            const finalFacilidades = data.facilidades.map(fac => {
                if (typeof fac.id !== "number") {
                    // Si aún tiene un ID temporal, busca el real en el mapa
                    return newFacilidadesMap.get(fac.id as number) || fac;
                }
                return fac;
            });

            // Si hay un _uuid en la facilidad original, asegúrate de mantenerlo para la key de React
            const updatedFinalFacilidades = finalFacilidades.map((fac, idx) => ({
                ...fac,
                _uuid: (data.facilidades[idx] as any)._uuid // Preserva el _uuid de la original
            }));

            // Finalmente, actualiza el estado con las facilidades consolidadas
            notifyChange({ facilidades: updatedFinalFacilidades });


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