"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UserWelcome } from "@/components/admin/user-welcome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReservationDetailModal } from "@/components/admin/reservaciones/reservation-detail-modal";
import { useAdminReservaciones } from "@/hooks/use-admin-reservaciones";
import { formatearFecha } from "@/lib/utils";
import { FullPageLoader } from "@/components/ui/full-page-loader";

export default function ListadoReservacionesPage() {
  const {
    username,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    paginatedReservations,
    handleViewReservation,
    showDetailModal,
    setShowDetailModal,
    selectedReservation,
  } = useAdminReservaciones();

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
  const timer = setTimeout(() => setIsPageLoading(false), 800);
  return () => clearTimeout(timer);
}, []);

  if (isPageLoading) return <FullPageLoader />;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <AdminHeader showWelcome={false} />
          <UserWelcome username={username} />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
          <AdminSidebar />

          <div className="space-y-6">
            <Card className="p-6 border rounded-md">
              <div className="flex items-center gap-3 mb-6">
                <CalendarCheck className="h-6 w-6 text-teal-600" />
                <h1 className="text-2xl font-playfair font-bold text-teal-800">Listado de Reservaciones</h1>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Reserva</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellidos</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Fecha Llegada</TableHead>
                        <TableHead>Fecha Salida</TableHead>
                        <TableHead>Habitación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReservations.length > 0 ? (
                        paginatedReservations.map((reserva) => (
                          <TableRow key={reserva.id}>
                            <TableCell>{reserva.id}</TableCell>
                            <TableCell>{reserva.cliente.nombre}</TableCell>
                            <TableCell>{reserva.cliente.apellidos}</TableCell>
                            <TableCell>{reserva.cliente.correo}</TableCell>
                            <TableCell>{formatearFecha(reserva.fechaLlegada)}</TableCell>
                            <TableCell>{formatearFecha(reserva.fechaSalida)}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  reserva.habitacion.tipo === "JUNIOR"
                                    ? "bg-blue-100 text-blue-800"
                                    : reserva.habitacion.tipo === "ESTANDAR"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {reserva.habitacion.tipo}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewReservation(reserva)}
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                            No se encontraron reservaciones
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {paginatedReservations.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + 10, paginatedReservations.length)} de{" "}
                    {paginatedReservations.length} reservaciones
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />

      {showDetailModal && selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setShowDetailModal(false)}
        />
      )}


    </div>
  );
}