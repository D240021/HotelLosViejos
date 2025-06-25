"use client"

import { useState, useEffect, useRef } from "react"
import { useInformacion } from "@/hooks/use-informacion"
import { useGaleria } from "@/hooks/use-galeria"
import { updateInformation } from "@/lib/Informacion"
import { updateGaleries } from "@/lib/GaleriaData"
import type { InformacionBase } from "@/types/Informacion"
import { v4 as uuidv4 } from "uuid"

export interface ImagenGaleria {
    id?: number | string | null
    descripcion?: string
    nombreImagen: string
}

interface InformacionConGaleria extends InformacionBase {
    imagenesGaleria: ImagenGaleria[]
}

export function useSobreNosotrosEditor() {
    const info = useInformacion()
    const { galerias } = useGaleria()

    const [data, setData] = useState<InformacionConGaleria>({
        id: null,
        textoSobreNosotros: "",
        textoBienvenida: "",
        nombre: "",
        nombreImagenBienvenida: "",
        imagenesGaleria: [],
    })

    const [isSaving, setIsSaving] = useState(false)
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null)

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (info && info.id && galerias && !hasInitialized.current) {
            const initialData: InformacionConGaleria = {
                id: info.id,
                textoSobreNosotros: info.textoSobreNosotros ?? "",
                textoBienvenida: info.textoBienvenida ?? "",
                nombre: info.nombre ?? "",
                nombreImagenBienvenida: info.nombreImagenBienvenida ?? "",
                imagenesGaleria: galerias.map(g => ({
                    id: g.id ?? uuidv4(),
                    nombreImagen: g.nombreImagen ?? "",
                    descripcion: g.descripcion ?? "",
                })),
            };
            setData(initialData);
            hasInitialized.current = true;
        }
    }, [info, galerias]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (data) {
            setData(prev => ({ ...prev!, [name]: value }));
        }
    }

    const handleImageChange = (field: keyof InformacionBase, url: string) => {
        if (data) {
            setData(prev => ({ ...prev!, [field]: url }));
        }
    }

    const handleSave = async () => {
        if (!data) {
            setAlert({
                type: "error",
                title: "Error",
                message: "Los datos no se han cargado completamente. Intente de nuevo.",
            });
            return;
        }

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

            const imagesToSendToBackend = data.imagenesGaleria.map(img => {
                return {
                    id: typeof img.id === 'string' ? null : img.id,
                    nombreImagen: img.nombreImagen,
                    descripcion: img.descripcion,
                };
            });

            const updatedGaleriesResponse = await updateGaleries(imagesToSendToBackend);

            setData(prev => ({
                ...prev!,
                imagenesGaleria: prev!.imagenesGaleria.map(img => {
                    const savedImage = updatedGaleriesResponse.find(
                        (g: any) => g.nombreImagen === img.nombreImagen && g.descripcion === img.descripcion
                    );
                    return savedImage && typeof savedImage.id === 'number'
                        ? { ...img, id: savedImage.id }
                        : img;
                }),
            }));

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
        if (!data) return;
        const nueva: ImagenGaleria = {
            id: uuidv4(),
            nombreImagen: "/placeholder.svg?height=200&width=300",
            descripcion: "",
        }
        setData(prev => ({
            ...prev!,
            imagenesGaleria: [...prev!.imagenesGaleria, nueva],
        }))
        setAlert(null);
    }

    const handleRemoveImage = (id: number | string | null | undefined) => {
        if (!data) return;
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.filter(img => img.id !== id),
        }))
        setAlert(null);
    }

    const handleImageTitleChange = (id: number | string | null | undefined, titulo: string) => {
        if (!data) return;
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.map(img =>
                img.id === id ? { ...img, descripcion: titulo } : img
            ),
        }))
    }

    const handleImageUrlChange = (id: number | string | null | undefined, url: string) => {
        if (!data) return;
        setData(prev => ({
            ...prev!,
            imagenesGaleria: prev!.imagenesGaleria.map(img =>
                img.id === id ? { ...img, nombreImagen: url } : img
            ),
        }))
    }

    const moveImage = (id: number | string | null | undefined, direction: "up" | "down") => {
        if (!data) return;
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