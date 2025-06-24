"use client"

import { Search, Plus, Trash2, Pencil, X, CheckCircle, Info, TriangleAlert } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminFooter } from "@/components/admin/admin-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useOferta } from "@/hooks/use-ofertas"
import { DateSelector } from "@/components/reservation/date-selector"
import { useTemporadaStore } from "@/lib/seasonData"
import type { OfertaBase } from "@/types/Oferta";

interface AlertMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, title, message, onClose }) => {
  let bgColor = '';
  let textColor = '';
  let icon: React.ReactNode;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircle size={20} className="text-green-500" />;
      break;
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <X size={20} className="text-red-500" />; // Cambiado a 'X' para error para coherencia visual
      break;
    case 'info':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <Info size={20} className="text-blue-500" />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <TriangleAlert size={20} className="text-yellow-500" />;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      icon = <Info size={20} className="text-gray-500" />;
  }

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-md shadow-sm flex items-start space-x-3 mb-4`}>
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-auto -mr-1.5 -mt-1.5 p-1 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2
          ${type === 'success' ? 'text-green-500 hover:bg-green-200 focus:ring-green-600' : ''}
          ${type === 'error' ? 'text-red-500 hover:bg-red-200 focus:ring-red-600' : ''}
          ${type === 'info' ? 'text-blue-500 hover:bg-blue-200 focus:ring-blue-600' : ''}
          ${type === 'warning' ? 'text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-600' : ''}
          `}
        >
          <span className="sr-only">Close alert</span>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default function GestionarOfertasPage() {
  const {
    altaPercentage,
    bajaPercentage,
    setAltaPercentage,
    setBajaPercentage,
  } = useTemporadaStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAlta = localStorage.getItem("altaPercentage");
      const storedBaja = localStorage.getItem("bajaPercentage");

      if (storedAlta !== null) setAltaPercentage(storedAlta);
      if (storedBaja !== null) setBajaPercentage(storedBaja);
    }
  }, [setAltaPercentage, setBajaPercentage]);

  const {
    offers,
    newOfferTitle,
    setNewOfferTitle,
    newOfferDescription,
    setNewOfferDescription,
    newOfferPercentage,
    setNewOfferPercentage,
    newOfferApplies,
    setNewOfferApplies,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    addOffer: addOfferHook,
    updateOffer: updateOfferHook,
    removeOffer: removeOfferHook,
    saveChanges,
    editedOffers,
    setEditedOffers,
  } = useOferta();

  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "warning"; title: string; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const editCopy = offers.reduce((acc, offer) => {
      acc[offer.id] = { ...offer };
      return acc;
    }, {} as { [id: string]: OfertaBase });
    setEditedOffers(editCopy);
  }, [offers]);

  function handlePercentageChange(value: string, setValue: (v: string) => void) {
    setAlert(null);
    if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
      if (value === "" || Number(value) <= 100) {
        setValue(value);
      }
    }
  }

  function validateOffer(offer: OfertaBase | {
    titulo: string,
    descripcion: string,
    porcentaje: string,
    aplica: string,
    fechaInicio: string | Date | undefined,
    fechaFin: string | Date | undefined,
  }): string | null {
    if (!offer.titulo.trim()) return "El título es obligatorio.";
    if (!offer.descripcion.trim()) return "La descripción es obligatoria.";
    if (!offer.porcentaje || isNaN(Number(offer.porcentaje)) || Number(offer.porcentaje) <= 0 || Number(offer.porcentaje) > 100)
      return "El porcentaje debe ser un número entre 1 y 100.";
    if (!offer.aplica) return "Debe seleccionar a qué aplica la oferta.";
    if (!offer.fechaInicio) return "Debe seleccionar la fecha de inicio.";
    if (!offer.fechaFin) return "Debe seleccionar la fecha de fin.";

    const inicio = new Date(offer.fechaInicio);
    const fin = new Date(offer.fechaFin);
    if (inicio > fin) return "La fecha de inicio no puede ser mayor a la fecha de fin.";
    return null;
  }

  function isOfferActive(offer: OfertaBase) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(offer.fechaInicio);
    start.setHours(0, 0, 0, 0);
    const end = new Date(offer.fechaFin);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  }

  async function handleAddOffer() {
    setAlert(null);
    setIsSaving(true);
    const newOffer = {
      titulo: newOfferTitle,
      descripcion: newOfferDescription,
      porcentaje: newOfferPercentage,
      aplica: newOfferApplies,
      fechaInicio: checkInDate ? checkInDate.toISOString() : undefined,
      fechaFin: checkOutDate ? checkOutDate.toISOString() : undefined,
    };
    const error = validateOffer(newOffer as any);
    if (error) {
      setAlert({ type: 'error', title: 'Error de Validación', message: error });
      setIsSaving(false);
      return;
    }

    try {
      await addOfferHook(newOffer);
      setNewOfferTitle("");
      setNewOfferDescription("");
      setNewOfferPercentage("");
      setNewOfferApplies("Todas");
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setAlert({ type: 'success', title: 'Éxito', message: 'Oferta agregada correctamente.' });
    } catch (err: any) {
      setAlert({ type: 'error', title: 'Error al agregar', message: err.message || 'No se pudo agregar la oferta.' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateOffer(offerId: string) {
    setAlert(null);
    setIsSaving(true);
    const offerToUpdate = editedOffers[offerId];
    const error = validateOffer(offerToUpdate);
    if (error) {
      setAlert({ type: 'error', title: 'Error de Validación', message: error });
      setIsSaving(false);
      return;
    }

    if (isOfferActive(offerToUpdate)) {
      setAlert({ type: 'warning', title: 'Oferta Activa', message: "No se puede modificar una oferta que está vigente." });
      setIsSaving(false);
      return;
    }

    try {
      await updateOfferHook(offerToUpdate);
      setAlert({ type: 'success', title: 'Éxito', message: 'Oferta actualizada correctamente.' });
    } catch (err: any) {
      setAlert({ type: 'error', title: 'Error al actualizar', message: err.message || 'No se pudo actualizar la oferta.' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveOffer(offerId: string) {
    setAlert(null);
    setIsSaving(true);
    const offerToRemove = offers.find(o => o.id === offerId);
    if (!offerToRemove) {
      setIsSaving(false);
      return;
    }

    if (isOfferActive(offerToRemove)) {
      setAlert({ type: 'warning', title: 'Oferta Activa', message: "No se puede eliminar una oferta que está vigente." });
      setIsSaving(false);
      return;
    }

    try {
      await removeOfferHook(offerId);
      setAlert({ type: 'success', title: 'Éxito', message: 'Oferta eliminada correctamente.' });
    } catch (err: any) {
      setAlert({ type: 'error', title: 'Error al eliminar', message: err.message || 'No se pudo eliminar la oferta.' });
    } finally {
      setIsSaving(false);
    }
  }

  function handleSaveSeasonPercentages() {
    setAlert(null);
    const alta = Number(altaPercentage);
    const baja = Number(bajaPercentage);

    if (isNaN(alta) || alta < 0 || alta > 100) {
      setAlert({ type: 'error', title: 'Error de Temporada', message: 'El porcentaje de ALTA debe ser un número entre 0 y 100.' });
      return;
    }
    if (isNaN(baja) || baja < 0 || baja > 100) {
      setAlert({ type: 'error', title: 'Error de Temporada', message: 'El porcentaje de BAJA debe ser un número entre 0 y 100.' });
      return;
    }

    try {
      localStorage.setItem("altaPercentage", String(alta));
      localStorage.setItem("bajaPercentage", String(baja));
      setAlert({ type: 'success', title: 'Éxito', message: 'Porcentajes de temporada guardados.' });
    } catch (e: any) {
      setAlert({ type: 'error', title: 'Error de Temporada', message: 'No se pudieron guardar los porcentajes.' });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <AdminHeader showWelcome={false} />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
          <div className="print:hidden">
            <AdminSidebar />
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-6 h-6 text-teal-600" />
              <h1 className="text-2xl font-semibold text-gray-800">Gestionar Temporadas y Ofertas</h1>
            </div>

            {alert && (
              <AlertMessage
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">TEMPORADAS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="alta">ALTA</Label>
                    <div className="relative">
                      <Input id="alta" type="number" value={altaPercentage} onChange={(e) => setAltaPercentage(e.target.value)} disabled={isSaving} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baja">BAJA</Label>
                    <div className="relative">
                      <Input id="baja" type="number" value={bajaPercentage} onChange={(e) => setBajaPercentage(e.target.value)} disabled={isSaving} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveSeasonPercentages} className="bg-teal-600 hover:bg-teal-700" disabled={isSaving}>
                    Guardar porcentajes de temporada
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">OFERTAS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                    value={newOfferTitle}
                    onChange={(e) => setNewOfferTitle(e.target.value)}
                    placeholder="Título"
                    required
                    disabled={isSaving}
                  />
                  <Input
                    value={newOfferDescription}
                    onChange={(e) => setNewOfferDescription(e.target.value)}
                    placeholder="Descripción"
                    required
                    disabled={isSaving}
                  />
                  <div className="relative">
                    <Input
                      value={newOfferPercentage}
                      onChange={(e) => handlePercentageChange(e.target.value, setNewOfferPercentage)}
                      placeholder="0"
                      className="pr-8"
                      required
                      disabled={isSaving}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>

                  <Select value={newOfferApplies} onValueChange={setNewOfferApplies} disabled={isSaving}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todas">Todas</SelectItem>
                      <SelectItem value="ESTANDAR">Solo estándar</SelectItem>
                      <SelectItem value="JUNIOR">Solo junior</SelectItem>
                    </SelectContent>
                  </Select>

                  <DateSelector id="check-in" label="Inicio" selectedDate={checkInDate} onDateChange={setCheckInDate} disabled={isSaving} />
                  <DateSelector
                    id="check-out"
                    label="Fin"
                    selectedDate={checkOutDate}
                    minDate={checkInDate}
                    onDateChange={setCheckOutDate}
                    disabled={isSaving}
                  />

                  <div className="md:col-span-3 flex justify-end">
                    <Button onClick={handleAddOffer} className="bg-teal-600 hover:bg-teal-700" disabled={isSaving}>
                      {isSaving ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? 'Agregando...' : 'Agregar Oferta'}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {offers.length > 0 ? (
                    offers.map((offer) => {
                      const active = isOfferActive(offer);
                      return (
                        <div key={offer.id} className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-800">{offer.titulo}</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              value={editedOffers[offer.id]?.titulo || ""}
                              onChange={(e) =>
                                setEditedOffers((prev) => ({
                                  ...prev,
                                  [offer.id]: { ...prev[offer.id], titulo: e.target.value },
                                }))
                              }
                              placeholder="Título"
                              disabled={active || isSaving}
                              required
                            />
                            <Input
                              value={editedOffers[offer.id]?.descripcion || ""}
                              onChange={(e) =>
                                setEditedOffers((prev) => ({
                                  ...prev,
                                  [offer.id]: { ...prev[offer.id], descripcion: e.target.value },
                                }))
                              }
                              placeholder="Descripción"
                              disabled={active || isSaving}
                              required
                            />
                            <div className="relative">
                              <Input
                                value={editedOffers[offer.id]?.porcentaje || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) {
                                    if (val === "" || Number(val) <= 100) {
                                      setEditedOffers((prev) => ({
                                        ...prev,
                                        [offer.id]: { ...prev[offer.id], porcentaje: val },
                                      }));
                                    }
                                  }
                                }}
                                placeholder="0"
                                className="pr-8"
                                disabled={active || isSaving}
                                required
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                            </div>

                            <Select
                              value={editedOffers[offer.id]?.aplica || "Todas"}
                              onValueChange={(value) =>
                                setEditedOffers((prev) => ({
                                  ...prev,
                                  [offer.id]: { ...prev[offer.id], aplica: value },
                                }))
                              }
                              disabled={active || isSaving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Todas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todas">Todas</SelectItem>
                                <SelectItem value="ESTANDAR">Solo estándar</SelectItem>
                                <SelectItem value="JUNIOR">Solo junior</SelectItem>
                              </SelectContent>
                            </Select>

                            <DateSelector
                              id={`edit-start-${offer.id}`}
                              label="Inicio"
                              selectedDate={new Date(editedOffers[offer.id]?.fechaInicio || offer.fechaInicio)}
                              onDateChange={(date) =>
                                setEditedOffers((prev) => ({
                                  ...prev,
                                  [offer.id]: { ...prev[offer.id], fechaInicio: date?.toISOString() },
                                }))
                              }
                              minDate={undefined}
                              disabled={active || isSaving}
                            />
                            <DateSelector
                              id={`edit-end-${offer.id}`}
                              label="Fin"
                              selectedDate={new Date(editedOffers[offer.id]?.fechaFin || offer.fechaFin)}
                              minDate={new Date(editedOffers[offer.id]?.fechaInicio || offer.fechaInicio)}
                              onDateChange={(date) =>
                                setEditedOffers((prev) => ({
                                  ...prev,
                                  [offer.id]: { ...prev[offer.id], fechaFin: date?.toISOString() },
                                }))
                              }
                              disabled={active || isSaving}
                            />

                            <div className="flex space-x-2 md:col-span-3 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 border-red-300"
                                    disabled={active || isSaving}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>¿Estás seguro de que deseas eliminar esta oferta?</DialogTitle>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="ghost">Cancelar</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoveOffer(offer.id)}
                                      disabled={isSaving}
                                    >
                                      {isSaving ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                      ) : (
                                        'Eliminar'
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdateOffer(offer.id)}
                                disabled={active || isSaving}
                                className="flex items-center gap-1"
                              >
                                {isSaving ? (
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <Pencil className="w-4 h-4" />
                                )}
                                {isSaving ? 'Guardando...' : 'Guardar'}
                              </Button>
                            </div>
                          </div>
                          {active && (
                            <p className="text-xs text-green-700 font-semibold">
                              Oferta vigente: no se puede modificar ni eliminar.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500">No hay ofertas registradas.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}