"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { HabitacionBase, Caracteristica } from "@/types/Habitacion"
import { getAllHabitaciones, getAllCaracteristicas } from "@/lib/HabitacionData"

export const useHabitacion = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionBase[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllHabitaciones()
        setHabitaciones(data)
      } catch (error) {
        console.error("Error al obtener habitaciones:", error)
      } finally {
        setIsReady(true)
      }
    }

    fetchData()
  }, [])

  const currentDate = new Date()
  const formattedDate = format(currentDate, "dd/MM/yyyy", { locale: es })

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case "LIBRE":
        return "text-green-600 bg-green-50"
      case "OCUPADA":
        return "text-red-600 bg-red-50"
      case "LIMPIEZA":
        return "text-blue-600 bg-blue-50"
      case "DESHABILITADA":
        return "text-orange-600 bg-blue-50"
      default:
        return ""
    }
  }

  return {
    habitaciones,
    formattedDate,
    handlePrint,
    getEstadoClass,
    isReady
  }
}

export const useCaracteristisca = () => {
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCaracteristicas()
        setCaracteristicas(data)
      } catch (error) {
        console.error("Error al obtener caracteristicas:", error)
      }
    }

    fetchData()
  }, [])

  return caracteristicas
}
