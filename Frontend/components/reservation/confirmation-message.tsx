"use client"

import { useReservaConfirmacion } from "@/hooks/use-reserva-confirmacion"

interface ConfirmationMessageProps {
  idReserva: number
}

export function ConfirmationMessage({ idReserva }: ConfirmationMessageProps) {
  const { reserva } = useReservaConfirmacion(idReserva)

  if (!reserva) return <p className="text-center">Cargando reserva...</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-lg border border-gray-200 relative overflow-visible">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-600 text-white text-sm px-6 py-1 rounded-full shadow">
        Confirmación de Reserva
      </div>

      <div className="pt-6 space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-teal-700">¡Gracias por su reserva!</h2>
          <p className="text-gray-600 mt-1">Estamos encantados de recibirle</p>
        </div>

        <div className="border-y py-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Nombre del Cliente:</span>
            <span className="font-medium">{reserva.cliente.nombre} {reserva.cliente.apellidos}</span>
          </div>
          <div className="flex justify-between">
            <span>Número de Reservación:</span>
            <span className="font-mono text-teal-700 font-semibold">{reserva.numeroReserva}</span>
          </div>
          <div className="flex justify-between">
            <span>Fecha de llegada:</span>
            <span>{new Date(reserva.fechaLlegada).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Fecha de salida:</span>
            <span>{new Date(reserva.fechaSalida).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Habitación asignada:</span>
            <span>#{reserva.habitacion.numero}</span>
          </div>
        </div>

        <div className="text-center pt-4 text-sm text-gray-500">
          <p>Le hemos enviado una copia de su reserva a su correo electrónico.</p>
          <p>Gracias por preferir <span className="text-teal-700 font-semibold">Hotel Los Viejos</span>.</p>
        </div>
      </div>

      <div className="absolute -left-5 top-1/2 w-10 h-10 bg-white rounded-full border border-gray-200 shadow-md transform -translate-y-1/2"></div>
      <div className="absolute -right-5 top-1/2 w-10 h-10 bg-white rounded-full border border-gray-200 shadow-md transform -translate-y-1/2"></div>
    </div>
  )
}
