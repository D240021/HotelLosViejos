"use client"

import { useState, useEffect, useRef } from "react" // Importamos useRef
import { useInformacion } from "@/hooks/use-informacion"
import { useGaleria } from "@/hooks/use-galeria"
import { updateInformation } from "@/lib/Informacion"
import { updateGaleries } from "@/lib/GaleriaData"
import type { InformacionBase } from "@/types/Informacion"
import isEqual from "lodash/isEqual"

export interface ImagenGaleria {
    id?: number | null
    descripcion?: string
    nombreImagen: string
}

interface InformacionConGaleria extends InformacionBase {
    imagenesGaleria: ImagenGaleria[]
}

export function useSobreNosotrosEditor() {
    const info = useInformacion()
    const { galerias } = useGaleria()

    const [data, setData] = useState<InformacionConGaleria>({ // Se inicializa con valores por defecto o vacíos
        id: null,
        textoSobreNosotros: "",
        textoBienvenida: "",
        nombre: "",
        nombreImagenBienvenida: "",
        imagenesGaleria: [],
    })

    const [isSaving, setIsSaving] = useState(false)
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null)

    // Usamos un ref para saber si los datos ya se han cargado e inicializado por primera vez
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Solo inicializamos data si 'info' y 'galerias' están disponibles
        // y si aún no hemos inicializado los datos.
        if (info && info.id && galerias && !hasInitialized.current) {
            const initialData: InformacionConGaleria = {
                id: info.id,
                textoSobreNosotros: info.textoSobreNosotros ?? "",
                textoBienvenida: info.textoBienvenida ?? "",
                nombre: info.nombre ?? "",
                nombreImagenBienvenida: info.nombreImagenBienvenida ?? "",
                imagenesGaleria: galerias.map(g => ({
                    id: g.id ?? null,
                    nombreImagen: g.nombreImagen ?? "",
                    descripcion: g.descripcion ?? "",
                })),
            };
            setData(initialData);
            hasInitialized.current = true; // Marcamos que los datos ya fueron inicializados
        }
    }, [info, galerias]); // Dependencias: info y galerias

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        // Asegúrate de que 'data' no sea null antes de intentar actualizarlo
        if (data) {
            setData(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleImageChange = (field: keyof InformacionBase, url: string) => {
        // Asegúrate de que 'data' no sea null antes de intentar actualizarlo
        if (data) {
            setData(prev => ({ ...prev, [field]: url }));
        }
    }

    const handleSave = async () => {
        if (!data) { // Si data es null, no podemos guardar
            setAlert({
                type: "error",
                title: "Error",
                message: "Los datos no se han cargado completamente. Intente de nuevo.",
            });
            return;
        }

        // Validaciones:
        if (!data.textoSobreNosotros || data.textoSobreNosotros.trim() === "") {
            setAlert({
                type: "error",
                title: "Error de Validación",
                message: "El campo 'Texto de Sobre Nosotros' no puede estar vacío.",
            })
            return
        }

        const missingImageUrls = data.imagenesGaleria.some(img => !img.nombreImagen || img.nombreImagen.trim() === "");
        if (missingImageUrls) {
            setAlert({
                type: "error",
                title: "Error de Validación",
                message: "Todas las imágenes de la galería deben tener una URL.",
            });
            return;
        }

        setIsSaving(true)
        setAlert(null)

        try {
            await updateInformation(data)
            const { imagenesGaleria } = data
            await updateGaleries(imagenesGaleria)
            await new Promise(resolve => setTimeout(resolve, 1500))
            setAlert({
                type: "success",
                title: "Cambios Guardados",
                message: "La información de 'Sobre Nosotros' ha sido guardada con éxito.",
            })
        } catch (err: any) {
            console.error("❌ Error al guardar la información de Sobre Nosotros:", err)
            setAlert({
                type: "error",
                title: "Error al Guardar",
                message: "Ocurrió un error al intentar guardar los cambios. Intente de nuevo.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddImage = () => {
        if (!data) return; // No añadir si data es null
        const nueva: ImagenGaleria = {
            id: Date.now(), // Usamos Date.now() para un ID único temporal
            nombreImagen: "/placeholder.svg?height=200&width=300",
            descripcion: "",
        }
        setData(prev => ({
            ...prev!, // Usamos '!' porque ya verificamos que 'prev' no es null
            imagenesGaleria: [...prev!.imagenesGaleria, nueva],
        }))
        setAlert(null);
    }

    const handleRemoveImage = (id: number | null | undefined) => {
        if (!data) return; // No eliminar si data es null
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.filter(img => img.id !== id),
        }))
        setAlert(null);
    }

    const handleImageTitleChange = (id: number | null | undefined, titulo: string) => {
        if (!data) return; // No cambiar si data es null
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.map(img =>
                img.id === id ? { ...img, descripcion: titulo } : img
            ),
        }))
    }

    const handleImageUrlChange = (id: number | null | undefined, url: string) => {
        if (!data) return; // No cambiar si data es null
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.map(img =>
                img.id === id ? { ...img, nombreImagen: url } : img
            ),
        }))
    }

    const moveImage = (id: number | null | undefined, direction: "up" | "down") => {
        if (!data) return; // No mover si data es null
        const index = data.imagenesGaleria.findIndex(img => img.id === id)
        if (
            index === -1 ||
            (direction === "up" && index === 0) ||
            (direction === "down" && index === data.imagenesGaleria.length - 1)
        ) return

        const swapIndex = direction === "up" ? index - 1 : index + 1

        const newImages = [...data.imagenesGaleria]
        ;[newImages[index], newImages[swapIndex]] = [
            newImages[swapIndex],
            newImages[index],
        ]

        setData(prev => ({
            ...prev!,
            imagenesGaleria: newImages,
        }))
    }

    return {
        data,
        isSaving,
        alert,
        setAlert,
        handleChange,
        handleImageChange,
        handleSave,
        handleAddImage,
        handleRemoveImage,
        handleImageTitleChange,
        handleImageUrlChange,
        moveImage,
    }
}