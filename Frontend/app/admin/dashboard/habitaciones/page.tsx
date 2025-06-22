"use client";

import { Suspense } from "react";
import { Hotel } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UserWelcome } from "@/components/admin/user-welcome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoomDescriptionModal } from "@/components/admin/rooms/room-description-modal";
import { cn } from "@/lib/utils";
import { useEditarHabitacion } from "@/hooks/use-admin-editar-habitacion";

function HabitacionesContent() {
  const {
    username,
    showDescriptionModal,
    setShowDescriptionModal,
    selectedRoomType,
    setSelectedRoomType,
    handleEditRoom,
    habitacionesFiltradasPorTipo,
  } = useEditarHabitacion();

  const renderRoomTable = (tipo: string, titulo: string) => {
    const habitacionesFiltradas = habitacionesFiltradasPorTipo(tipo);

    if (habitacionesFiltradas.length === 0) return null;

    return (
      <div className="mb-10" key={tipo}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-800">{titulo}</h2>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Número de Habitación</TableHead>
                <TableHead className="w-1/3">Estado</TableHead>
                <TableHead className="w-1/3 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habitacionesFiltradas.map((habitacion) => (
                <TableRow key={habitacion.id}>
                  <TableCell>{habitacion.numero}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full font-semibold",
                        {
                          "bg-green-100 text-green-800": habitacion.estado === "LIBRE",
                          "bg-red-100 text-red-800": habitacion.estado === "OCUPADA",
                          "bg-yellow-100 text-yellow-800": habitacion.estado === "LIMPIEZA",
                          "bg-orange-100 text-orange-800": habitacion.estado === "MANTENIMIENTO",
                          "bg-gray-200 text-gray-700": habitacion.estado === "DESHABILITADA",
                        }
                      )}
                    >
                      {habitacion.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditRoom(habitacion.tipo, habitacion.id)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Hotel className="h-6 w-6 text-teal-600" />
                  <h1 className="text-2xl font-playfair font-bold text-teal-800">Administrar Habitaciones</h1>
                </div>
              </div>

              {renderRoomTable("ESTANDAR", "Habitaciones Estándar")}
              {renderRoomTable("JUNIOR", "Habitaciones Junior")}
              {renderRoomTable("DELUXE", "Habitaciones Deluxe")}
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />

      {showDescriptionModal && (
        <RoomDescriptionModal
          roomType={selectedRoomType}
          onClose={() => setShowDescriptionModal(false)}
          onSave={(description) => {
            console.log(`Guardando descripción para ${selectedRoomType}:`, description);
            setShowDescriptionModal(false);
          }}
        />
      )}
    </div>
  );
}

export default function AdministrarHabitacionesPage() {
  return (
    <Suspense fallback={<div>Cargando habitaciones...</div>}>
      <HabitacionesContent />
    </Suspense>
  );
}
