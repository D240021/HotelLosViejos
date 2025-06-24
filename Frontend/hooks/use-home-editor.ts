"use client"

import { useEffect, useState } from "react"
import { useInformacion } from "@/hooks/use-informacion"
import { updateInformation } from "@/lib/Informacion"
import type { InformacionBase } from "@/types/Informacion"

export function useHomeEditor() {
    const info = useInformacion()

    const [data, setData] = useState<InformacionBase | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null)

    useEffect(() => {
        if (info && info.id && !data) {
            setData({ ...info })
        }
    }, [info, data])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        if (!data) return
        setData(prev => ({ ...prev!, [name]: value }))
    }

    const handleImageChange = (field: keyof InformacionBase, url: string) => {
        if (!data) return
        setData(prev => ({ ...prev!, [field]: url }))
    }

    const handleSave = async () => {
        if (!data) return

        // Validaciones: Asegúrate de que los campos importantes no estén vacíos
        if (!data.textoBienvenida || !data.nombreImagenBienvenida) {
            setAlert({
                type: "error",
                title: "Error de Validación",
                message: "Por favor, complete todos los campos obligatorios y asegúrese de que la imagen esté cargada.",
            })
            return
        }

        setIsSaving(true)
        setAlert(null) // Limpiar cualquier alerta anterior al iniciar el guardado

        try {
            await updateInformation(data)
            await new Promise(res => setTimeout(res, 1500)) // Simula el tiempo de guardado
            setAlert({
                type: "success", // Puedes definir un tipo 'success' si tienes un componente para ello
                title: "Guardado Exitoso",
                message: "Los cambios han sido guardados con éxito.",
            })
            // Opcional: recargar la página o manejar de otra forma
            // window.location.reload()
        } catch (err: any) {
            console.error("❌ Error al guardar la información de Home:", err)
            setAlert({
                type: "error",
                title: "Error al Guardar",
                message: "Ocurrió un error al intentar guardar los cambios. Intente de nuevo.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return {
        data,
        isSaving,
        alert, // Exportar el estado de alerta
        setAlert, // Exportar la función para limpiar o establecer la alerta desde el componente si es necesario
        handleChange,
        handleImageChange,
        handleSave,
    }
}