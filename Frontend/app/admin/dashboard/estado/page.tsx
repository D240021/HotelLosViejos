"use client";

import { useState } from "react";
import { BarChart, Printer } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UserWelcome } from "@/components/admin/user-welcome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHabitacion } from "@/hooks/use-habitacion";
import { HabitacionBase } from "@/types/Habitacion";

export default function EstadoHotelPage() {
  const [username] = useState("USUARIO");
  const { habitaciones, formattedDate, handlePrint, getEstadoClass } = useHabitacion();

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="border-b bg-white print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <AdminHeader showWelcome={false} />
          <UserWelcome username={username} />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8 print:grid-cols-1">
          <div className="print:hidden">
            <AdminSidebar />
          </div>

          <div className="space-y-6">
            <Card className="p-6 border rounded-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-teal-600" />
                  <h1 className="text-2xl font-playfair font-bold text-teal-800">Estado del Hotel Hoy</h1>
                </div>

                <Button variant="outline" className="flex items-center gap-2 print:hidden" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium">Fecha: {formattedDate}</p>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Número de Habitación</TableHead>
                      <TableHead className="w-1/3">Tipo</TableHead>
                      <TableHead className="w-1/3">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {habitaciones.map((habitacion: HabitacionBase) => (
                      <TableRow key={habitacion.numero}>
                        <TableCell>{habitacion.numero}</TableCell>
                        <TableCell>{habitacion.tipo}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoClass(habitacion.estado)}`}
                          >
                            {habitacion.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter className="print:hidden" />
    </div>
  );
}
