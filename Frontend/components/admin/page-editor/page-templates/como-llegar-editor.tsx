"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Mail,
  Phone,
  MapIcon,
  Save,
  XCircle,
  CheckCircle,
  Info,
  TriangleAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useContacto } from "@/hooks/use-contacto";
import { updateContact } from "@/lib/ContactoData";
import { ContactoBase } from "@/types/Contacto";
import { FullPageLoader } from "@/components/ui/full-page-loader";

interface AlertMessageProps {
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  let bgColor = "";
  let textColor = "";
  let icon: React.ReactNode;

  switch (type) {
    case "success":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircle size={20} className="text-green-500" />;
      break;
    case "error":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircle size={20} className="text-red-500" />;
      break;
    case "info":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = <Info size={20} className="text-blue-500" />;
      break;
    case "warning":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <TriangleAlert size={20} className="text-yellow-500" />;
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      icon = <Info size={20} className="text-gray-500" />;
  }

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded-md shadow-sm flex items-start space-x-3 mb-4`}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-grow">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-auto -mr-1.5 -mt-1.5 p-1 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            type === "success"
              ? "text-green-500 hover:bg-green-200 focus:ring-green-600"
              : ""
          }
          ${
            type === "error"
              ? "text-red-500 hover:bg-red-200 focus:ring-red-600"
              : ""
          }
          ${
            type === "info"
              ? "text-blue-500 hover:bg-blue-200 focus:ring-blue-600"
              : ""
          }
          ${
            type === "warning"
              ? "text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-600"
              : ""
          }
          `}
        >
          <span className="sr-only">Close alert</span>
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};

export function ComoLlegarEditor() {
  const initialContacto = useContacto();

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const hasInitialized = useRef(false);

  const [data, setData] = useState<ContactoBase>({
    id: 0,
    correo: "",
    telefono: "",
    codigoPostal: "",
    direccion: "",
    latitud: "",
    longitud: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (
      initialContacto &&
      initialContacto.id !== 0 &&
      !hasInitialized.current
    ) {
      setData({ ...initialContacto });
      hasInitialized.current = true;
    }
  }, [initialContacto]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!initialContacto || initialContacto.id === 0) {
    return <FullPageLoader />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setAlert(null);
  };

  const handleVerificarCoordenadas = () => {
    if (!data.latitud || !data.longitud) {
      setAlert({
        type: "warning",
        title: "Coordenadas Incompletas",
        message:
          "Por favor, ingrese valores para Latitud y Longitud antes de verificar.",
      });
      return;
    }

    const lat = Number(data.latitud);
    const lon = Number(data.longitud);

    if (isNaN(lat) || isNaN(lon)) {
      setAlert({
        type: "error",
        title: "Coordenadas Inválidas",
        message: "La latitud y longitud deben ser números válidos.",
      });
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, "_blank");
    setAlert(null);
  };

  const validateForm = (formData: ContactoBase): string | null => {
    if (!formData.direccion?.trim())
      return "La dirección no puede estar vacía.";
    if (!formData.telefono?.trim()) return "El teléfono no puede estar vacío.";
    if (!/^[\d\s+\-/]+$/.test(formData.telefono))
      return "El teléfono solo puede contener números, espacios y los caracteres +, -, /.";
    if (!formData.correo?.trim())
      return "El correo electrónico no puede estar vacío.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      return "El formato del correo electrónico no es válido.";
    if (!formData.codigoPostal?.trim())
      return "El código postal no puede estar vacío.";
    if (!formData.latitud?.trim() || isNaN(Number(formData.latitud)))
      return "La latitud debe ser un número válido.";
    if (!formData.longitud?.trim() || isNaN(Number(formData.longitud)))
      return "La longitud debe ser un número válido.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm(data);
    if (validationError) {
      setAlert({
        type: "error",
        title: "Error de Validación",
        message: validationError,
      });
      return;
    }

    setIsSaving(true);
    setAlert(null);

    try {
      await updateContact(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAlert({
        type: "success",
        title: "¡Éxito!",
        message: "Cambios guardados con éxito.",
      });
    } catch (error: any) {
      console.error("Error al guardar cambios de contacto:", error);
      setAlert({
        type: "error",
        title: "Error al Guardar",
        message: `No se pudieron guardar los cambios: ${
          error.message || "Error desconocido"
        }`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="border-t pt-6">
        <h2 className="text-xl font-medium text-gray-800 mb-4">
          Información de contacto
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="direccion"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
            >
              <MapPin size={16} />
              Dirección completa
            </label>
            <Textarea
              id="direccion"
              name="direccion"
              value={data.direccion}
              onChange={handleChange}
              className="w-full"
              placeholder="Ej: San Francisco de Coyote, Guanacaste, Costa Rica"
              rows={5}
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="telefono"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Phone size={16} />
                Teléfono
              </label>
              <Input
                id="telefono"
                name="telefono"
                value={data.telefono}
                onChange={handleChange}
                className="w-full"
                placeholder="Ej: +506 2222-3333"
                disabled={isSaving}
              />
            </div>

            <div>
              <label
                htmlFor="correo"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Mail size={16} />
                Correo electrónico
              </label>
              <Input
                id="correo"
                name="correo"
                value={data.correo}
                onChange={handleChange}
                className="w-full"
                placeholder="Ej: info@hotellosviejo.com"
                type="email"
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="codigoPostal"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
            >
              <MapIcon size={16} />
              Código Postal
            </label>
            <Input
              id="codigoPostal"
              name="codigoPostal"
              value={data.codigoPostal}
              onChange={handleChange}
              className="w-full"
              placeholder="Ej: 50101"
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-medium text-gray-800 mb-4">
          Ubicación en el mapa
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitud"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Latitud
              </label>
              <Input
                id="latitud"
                name="latitud"
                value={data.latitud}
                onChange={handleChange}
                className="w-full"
                placeholder="Ej: 9.7489"
                disabled={isSaving}
              />
            </div>

            <div>
              <label
                htmlFor="longitud"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Longitud
              </label>
              <Input
                id="longitud"
                name="longitud"
                value={data.longitud}
                onChange={handleChange}
                className="w-full"
                placeholder="Ej: -85.2755"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleVerificarCoordenadas}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <MapPin size={16} />
              Verificar coordenadas en Google Maps
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="mt-6 bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
