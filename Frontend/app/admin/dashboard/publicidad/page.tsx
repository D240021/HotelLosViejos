"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Pencil, X, CheckCircle, Info, TriangleAlert, XCircle } from "lucide-react";
import { usePublicidad } from "@/hooks/use-admin-publicidad";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminFooter } from "@/components/admin/admin-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageEditor } from "@/components/admin/page-editor/image-editor"
import { PublicidadBase } from "@/types/Publicidad";
import { FullPageLoader } from "@/components/ui/full-page-loader";

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
          <span className="sr-only">Cerrar alerta</span>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default function PublicidadManager() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const {
    ads,
    newAdNombre,
    setNewAdNombre,
    newAdTitulo,
    setNewAdTitulo,
    newAdDescripcion,
    setNewAdDescripcion,
    newAdImagen,
    setNewAdImagen,
    newAdEnlace,
    setNewAdEnlace,
    addPublicidad: addPublicidadHook,
    updatePublicidad: updatePublicidadHook,
    removePublicidad: removePublicidadHook,
  } = usePublicidad();

  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "warning"; title: string; message: string } | null>(null);

  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editImagen, setEditImagen] = useState("");
  const [editEnlace, setEditEnlace] = useState("");

  const [adToDelete, setAdToDelete] = useState<PublicidadBase | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const startEditing = (ad: typeof ads[0]) => {
    setAlert(null);
    setEditingAdId(ad.id!);
    setEditNombre(ad.nombre);
    setEditTitulo(ad.titulo);
    setEditDescripcion(ad.descripcion);
    setEditImagen(ad.imagen);
    setEditEnlace(ad.enlace);
  };

  const cancelEditing = () => {
    setAlert(null);
    setEditingAdId(null);
  };

  const validateAd = (ad: { titulo: string; descripcion: string; nombre: string; imagen: string; enlace: string }): string | null => {
    if (!ad.titulo.trim()) return "El título no puede estar vacío.";
    if (!ad.descripcion.trim()) return "La descripción no puede estar vacía.";
    if (!ad.nombre.trim()) return "El nombre interno no puede estar vacío.";
    if (!ad.imagen.trim()) return "La imagen no puede estar vacía.";
    return null;
  };

  const saveEdit = async () => {
    if (editingAdId === null) return;

    const updatedAd = {
      id: editingAdId,
      nombre: editNombre,
      titulo: editTitulo,
      descripcion: editDescripcion,
      imagen: editImagen,
      enlace: editEnlace,
    };

    const validationError = validateAd(updatedAd);
    if (validationError) {
      setAlert({
        type: 'error',
        title: 'Error de Validación',
        message: validationError
      });
      return;
    }

    setIsSaving(true);
    setAlert(null);
    try {
      await updatePublicidadHook(updatedAd);
      setEditingAdId(null);
      setAlert({
        type: 'success',
        title: '¡Éxito!',
        message: 'Publicidad actualizada con éxito.'
      });
    } catch (error: any) {
      console.error("Error al actualizar publicidad:", error);
      setAlert({
        type: 'error',
        title: 'Error al Actualizar',
        message: `No se pudo actualizar la publicidad: ${error.message || 'Error desconocido'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAd = async () => {
    const newAdData = {
      titulo: newAdTitulo,
      descripcion: newAdDescripcion,
      nombre: newAdNombre,
      enlace: newAdEnlace,
      imagen: newAdImagen,
    };

    const validationError = validateAd(newAdData);
    if (validationError) {
      setAlert({
        type: 'error',
        title: 'Error de Validación',
        message: validationError
      });
      return;
    }

    setIsSaving(true);
    setAlert(null);
    try {
      await addPublicidadHook(newAdData);
      setNewAdTitulo("");
      setNewAdDescripcion("");
      setNewAdNombre("");
      setNewAdEnlace("");
      setNewAdImagen("");
      setAlert({
        type: 'success',
        title: '¡Éxito!',
        message: 'Publicidad agregada con éxito.'
      });
    } catch (error: any) {
      console.error("Error al agregar publicidad:", error);
      setAlert({
        type: 'error',
        title: 'Error al Agregar',
        message: `No se pudo agregar la publicidad: ${error.message || 'Error desconocido'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (ad: typeof ads[0]) => {
    setAlert(null);
    setAdToDelete(ad);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setAdToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  if (isPageLoading) return <FullPageLoader />;

  const confirmDelete = async () => {
    if (adToDelete) {
      setAlert(null);
      try {
        await removePublicidadHook(adToDelete.id!);
        setAlert({
          type: 'success',
          title: '¡Eliminado!',
          message: 'Publicidad eliminada con éxito.'
        });
        closeDeleteDialog();
      } catch (error: any) {
        console.error("Error al eliminar publicidad:", error);
        setAlert({
          type: 'error',
          title: 'Error al Eliminar',
          message: `No se pudo eliminar la publicidad: ${error.message || 'Error desconocido'}`
        });
        closeDeleteDialog();
      }
    }
  };

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
              <h1 className="text-2xl font-semibold text-gray-800">Gestionar publicidad</h1>
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
                <CardTitle className="text-lg text-gray-800">NUEVA PUBLICIDAD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                    value={newAdTitulo}
                    onChange={(e) => setNewAdTitulo(e.target.value)}
                    placeholder="Título"
                    disabled={isSaving}
                  />
                  <Input
                    value={newAdDescripcion}
                    onChange={(e) => setNewAdDescripcion(e.target.value)}
                    placeholder="Descripción"
                    disabled={isSaving}
                  />
                  <Input
                    value={newAdNombre}
                    onChange={(e) => setNewAdNombre(e.target.value)}
                    placeholder="Nombre interno"
                    disabled={isSaving}
                  />
                  <Input
                    value={newAdEnlace}
                    onChange={(e) => setNewAdEnlace(e.target.value)}
                    placeholder="Enlace"
                    disabled={isSaving}
                  />
                  <div className="md:col-span-3">
                    <ImageEditor
                      compact
                      currentImageUrl={newAdImagen}
                      onImageChange={(url) => setNewAdImagen(url)}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <Button onClick={handleAddAd} className="bg-teal-600 hover:bg-teal-700" disabled={isSaving}>
                      {isSaving ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? 'Agregando...' : 'Agregar Publicidad'}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {ads.length > 0 ? (
                    ads.map((ad) => {
                      const isEditing = editingAdId === ad.id;

                      return (
                        <div
                          key={ad.id}
                          className="space-y-4 border p-4 rounded-lg bg-white shadow-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              value={isEditing ? editTitulo : ad.titulo}
                              onChange={(e) => setEditTitulo(e.target.value)}
                              placeholder="Título"
                              disabled={!isEditing || isSaving}
                            />
                            <Input
                              value={isEditing ? editDescripcion : ad.descripcion}
                              onChange={(e) => setEditDescripcion(e.target.value)}
                              placeholder="Descripción"
                              disabled={!isEditing || isSaving}
                            />
                            <Input
                              value={isEditing ? editNombre : ad.nombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              placeholder="Nombre interno"
                              disabled={!isEditing || isSaving}
                            />
                            <Input
                              value={isEditing ? editEnlace : ad.enlace}
                              onChange={(e) => setEditEnlace(e.target.value)}
                              placeholder="Enlace"
                              disabled={!isEditing || isSaving}
                            />

                            {/* Mostrar la imagen actual y el editor si está editando */}
                            <div className="md:col-span-3 space-y-2">
                                <Label className="block text-sm font-medium text-gray-700">Imagen actual</Label>
                                <div className="border rounded-md bg-gray-50 flex items-center justify-center h-[200px] overflow-hidden">
                                    <img
                                        src={isEditing ? editImagen || "/placeholder.svg" : ad.imagen || "/placeholder.svg"}
                                        alt={ad.titulo}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                {isEditing && (
                                    <div className="mt-4">
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Cambiar imagen</Label>
                                        <ImageEditor
                                            compact
                                            currentImageUrl={editImagen}
                                            onImageChange={(url) => setEditImagen(url)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-3 flex justify-end space-x-2">
                              {isEditing ? (
                                <>
                                  <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                                    {isSaving ? (
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    ) : (
                                      <Pencil className="w-4 h-4 mr-1" />
                                    )}
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                  </Button>
                                  <Button
                                    onClick={cancelEditing}
                                    variant="outline"
                                    className="text-gray-700 border-gray-300"
                                    disabled={isSaving}
                                  >
                                    <X className="w-4 h-4 mr-1" /> Cancelar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => startEditing(ad)}
                                    variant="secondary"
                                    className="text-gray-700"
                                    disabled={isSaving}
                                  >
                                    <Pencil className="w-4 h-4 mr-1" /> Editar
                                  </Button>

                                  <Button variant="destructive" onClick={() => openDeleteDialog(ad)} disabled={isSaving}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500">No hay publicidad registrada.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {isDeleteDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro que quieres eliminar la publicidad{" "}
                <strong>{adToDelete?.titulo}</strong>?
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={closeDeleteDialog} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isSaving}>
                  {isSaving ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : (
                      'Eliminar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>

      <AdminFooter />
    </div>
  );
}