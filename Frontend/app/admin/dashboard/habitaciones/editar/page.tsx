"use client";

import React, { useState, useEffect } from "react"; // Asegúrate de importar useState y useEffect
import { Hotel, Save, ArrowLeft, CheckCircle, Info, TriangleAlert, XCircle } from "lucide-react"; // Importa los íconos de alerta
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UserWelcome } from "@/components/admin/user-welcome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/admin/rooms/multi-select";
import { useEditarHabitacion } from "@/hooks/use-admin-editar-habitacion";

// Componente AlertMessage (reutilizable)
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
      icon = <XCircle size={20} className="text-red-500" />;
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
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};


export default function EditarHabitacionPage() {
  const {
    username,
    isSaving,
    formData,
    filePreview,
    imageInputValue,
    todasLasCaracteristicas,
    handleChange,
    handleCaracteristicasChange,
    handleImageUrlChange,
    handleAcceptClick,
    handleSave: hookHandleSave, // Renombramos para evitar conflicto con nuestra función local
    handleBack,
    getTipoTitulo,
    setFormData,
    setFilePreview,
  } = useEditarHabitacion();

  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "warning"; title: string; message: string } | null>(null);

  // Manejar la desaparición automática de la alerta
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSaveWrapper = async () => {
    setAlert(null); // Limpiar cualquier alerta existente
    try {
      const success = await hookHandleSave(); // Llama a la función del hook
      if (success) {
        setAlert({
          type: 'success',
          title: '¡Éxito!',
          message: 'Cambios guardados correctamente.'
        });
      }
    } catch (error: any) {
      console.error("Error al guardar cambios de habitación:", error);
      setAlert({
        type: 'error',
        title: 'Error al Guardar',
        message: error.message || 'No se pudieron guardar los cambios. Intenta de nuevo.'
      });
    }
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
                  <h1 className="text-2xl font-playfair font-bold text-teal-800">Modificar Habitación</h1>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>

                  <Button
                    className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                    onClick={handleSaveWrapper} // Usamos nuestro wrapper para manejar el alert
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {alert && (
                <AlertMessage
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-medium text-gray-800">{getTipoTitulo()}</h2>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="tarifa" className="whitespace-nowrap">
                      Tarifa Diaria:
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                      <Input
                        id="tarifa"
                        name="tarifaDiariaBase"
                        type="number"
                        value={formData.tarifaDiariaBase}
                        onChange={handleChange}
                        className="pl-7 w-24"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número de habitación</Label>
                  <Input
                    id="numero"
                    name="numero"
                    type="number"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-32"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    disabled={isSaving}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="LIBRE">Libre</option>
                    <option value="OCUPADA">Ocupada</option>
                    <option value="LIMPIEZA">En Limpieza</option>
                    <option value="DESHABILITADA">Deshabilitada</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de habitación</Label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    disabled={isSaving}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="ESTANDAR">Estándar</option>
                    <option value="JUNIOR">Junior</option>
                    {/* Agrega más tipos si es necesario */}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Características</Label>
                  <MultiSelect
                    options={todasLasCaracteristicas}
                    selected={formData.caracteristicas}
                    onChange={handleCaracteristicasChange}
                    disabled={isSaving}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Imagen actual</Label>
                    <div className="border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center h-[200px]">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          onError={() => setFilePreview("/placeholder.svg")}
                          alt="Imagen de habitación"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400">Sin imagen</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subir nueva imagen</Label>
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-4">
                        <Input
                          id="nombreImagen"
                          name="nombreImagen"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={imageInputValue}
                          onChange={handleImageUrlChange}
                          className="flex-1"
                          disabled={isSaving}
                        />
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => {
                          setFormData((prev) => ({ ...prev, nombreImagen: "" }));
                          setFilePreview("");
                        }} disabled={isSaving}>
                          Cancelar
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleAcceptClick} disabled={isSaving}>
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}