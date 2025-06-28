"use client"

import { X, Calendar, User, Mail, CreditCard, Tag, Clock, Edit, Printer, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatearFecha } from '../../../lib/utils';

interface ReservationDetailModalProps {
  reservation: any
  onClose: () => void
}

export function ReservationDetailModal({
  reservation,
  onClose,
}: ReservationDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">Detalles de la Reservación</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">ID de Reservación</h3>
                <p className="text-lg font-medium">{reservation.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Habitación</h3>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <p>{reservation.habitacion.tipo} #{reservation.habitacion.numero}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <p>
                    {reservation.cliente.nombre} {reservation.cliente.apellidos}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Correo</h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p>{reservation.cliente.correo}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Fechas de estancia */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Fechas de Estancia</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium text-gray-700">Check-in</h4>
                </div>
                <p className="text-lg">{formatearFecha(reservation.fechaLlegada)}</p>
                <p className="text-sm text-gray-500">A partir de las 15:00</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium text-gray-700">Check-out</h4>
                </div>
                <p className="text-lg">{formatearFecha(reservation.fechaSalida)}</p>
                <p className="text-sm text-gray-500">Hasta las 12:00</p>
              </div>
            </div>
          </div>
          {/* Acciones */}
          <div className="border-t pt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}