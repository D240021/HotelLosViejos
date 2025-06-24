"use client"

import { Search } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { UserWelcome } from "@/components/admin/user-welcome"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@/components/admin/disponibilidad/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { Spinner } from "@/components/ui/spinner"
import { useDisponibilidad } from "@/hooks/use-disponibilidad"

export default function ConsultarDisponibilidadPage() {
  const {
    username,
    results,
    isLoading,
    fechaLlegada,
    setFechaLlegada,
    fechaSalida,
    setFechaSalida,
    tipoHabitacion,
    setTipoHabitacion,
    handleConsultar,
    isReady
  } = useDisponibilidad()

  if (!isReady) return <FullPageLoader />

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
              <div className="flex items-center gap-3 mb-8">
                <Search className="h-6 w-6 text-teal-600" />
                <h1 className="text-2xl font-playfair font-bold text-teal-800">
                  Consultar Disponibilidad de Habitaciones
                </h1>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="fechaLlegada">Fecha Llegada:</Label>
                    <DatePicker id="fechaLlegada" date={fechaLlegada} onDateChange={setFechaLlegada} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaSalida">Fecha Salida:</Label>
                    <DatePicker
                      id="fechaSalida"
                      date={fechaSalida}
                      onDateChange={setFechaSalida}
                      minDate={new Date(fechaLlegada.getTime() + 86400000)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoHabitacion">Tipo de Habitación</Label>
                    <Select value={tipoHabitacion} onValueChange={setTipoHabitacion}>
                      <SelectTrigger id="tipoHabitacion">
                        <SelectValue placeholder="Tipo de Habitación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="ESTANDAR">Estandar</SelectItem>
                        <SelectItem value="JUNIOR">Junior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleConsultar}
                    disabled={isLoading}
                    className="bg-gray-500 hover:bg-gray-600 rounded-md px-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Spinner size={16} color="text-white" className="-ml-1 mr-2" />
                        Consultando...
                      </div>
                    ) : (
                      "Consultar"
                    )}
                  </Button>
                </div>
              </div>

              {results && (
                <div className="mt-8">
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número de Habitación</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Costo Estadía</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.length > 0 ? (
                          results.map((room) => (
                            <TableRow key={`${room.numeroHabitacion}-${room.tipoHabitacion}`}>
                              <TableCell>{room.numeroHabitacion}</TableCell>
                              <TableCell>{room.tipoHabitacion}</TableCell>
                              <TableCell>${room.costoEstadia}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                              No se encontraron habitaciones disponibles con los criterios seleccionados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  )
}
