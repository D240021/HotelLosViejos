"use client";

import React from "react";
import { Search, Plus, Trash2, Pencil, X } from "lucide-react";
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

export default function PublicidadManager() {
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
    addPublicidad,
    updatePublicidad,
    removePublicidad,
  } = usePublicidad();

  const [editingAdId, setEditingAdId] = React.useState<number | null>(null);
  const [editNombre, setEditNombre] = React.useState("");
  const [editTitulo, setEditTitulo] = React.useState("");
  const [editDescripcion, setEditDescripcion] = React.useState("");
  const [editImagen, setEditImagen] = React.useState("");
  const [editEnlace, setEditEnlace] = React.useState("");

  const startEditing = (ad: typeof ads[0]) => {
    setEditingAdId(ad.id!);
    setEditNombre(ad.nombre);
    setEditTitulo(ad.titulo);
    setEditDescripcion(ad.descripcion);
    setEditImagen(ad.imagen);
    setEditEnlace(ad.enlace);
  };

  const cancelEditing = () => {
    setEditingAdId(null);
  };

  const saveEdit = () => {
    if (editingAdId === null) return;

    updatePublicidad({
      id: editingAdId,
      nombre: editNombre,
      titulo: editTitulo,
      descripcion: editDescripcion,
      imagen: editImagen,
      enlace: editEnlace,
    });

    setEditingAdId(null);
  };

  const handleAddAd = () => {
    if (!newAdTitulo || !newAdDescripcion || !newAdNombre) return;

    addPublicidad({
      titulo: newAdTitulo,
      descripcion: newAdDescripcion,
      nombre: newAdNombre,
      enlace: newAdEnlace,
      imagen: newAdImagen,
    });

    setNewAdTitulo("");
    setNewAdDescripcion("");
    setNewAdNombre("");
    setNewAdEnlace("");
    setNewAdImagen("");
  };

const [adToDelete, setAdToDelete] = React.useState<PublicidadBase | null>(null);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

const openDeleteDialog = (ad: typeof ads[0]) => {
  setAdToDelete(ad);
  setIsDeleteDialogOpen(true);
};

const closeDeleteDialog = () => {
  setAdToDelete(null);
  setIsDeleteDialogOpen(false);
};

const confirmDelete = async () => {
  if (adToDelete) {
    await removePublicidad(adToDelete.id!);
    closeDeleteDialog();
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
                  />
                  <Input
                    value={newAdDescripcion}
                    onChange={(e) => setNewAdDescripcion(e.target.value)}
                    placeholder="Descripción"
                  />
                  <Input
                    value={newAdNombre}
                    onChange={(e) => setNewAdNombre(e.target.value)}
                    placeholder="Nombre interno"
                  />
                  <Input
                    value={newAdEnlace}
                    onChange={(e) => setNewAdEnlace(e.target.value)}
                    placeholder="Enlace"
                  />
                  <div className="md:col-span-3">
                    <ImageEditor
                      compact
                      currentImageUrl={newAdImagen}
                      onImageChange={(url) => setNewAdImagen(url)}
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <Button onClick={handleAddAd} className="bg-teal-600 hover:bg-teal-700">
                      <Plus className="w-4 h-4 mr-2" /> Agregar Publicidad
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* LISTADO DE PUBLICIDAD */}
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
                            {/* Otros inputs para título, descripción, nombre, enlace */}
                            <Input
                              value={isEditing ? editTitulo : ad.titulo}
                              onChange={(e) => setEditTitulo(e.target.value)}
                              placeholder="Título"
                              disabled={!isEditing}
                            />
                            <Input
                              value={isEditing ? editDescripcion : ad.descripcion}
                              onChange={(e) => setEditDescripcion(e.target.value)}
                              placeholder="Descripción"
                              disabled={!isEditing}
                            />
                            <Input
                              value={isEditing ? editNombre : ad.nombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              placeholder="Nombre interno"
                              disabled={!isEditing}
                            />
                            <Input
                              value={isEditing ? editEnlace : ad.enlace}
                              onChange={(e) => setEditEnlace(e.target.value)}
                              placeholder="Enlace"
                              disabled={!isEditing}
                            />



                            {/* ImageEditor para editar imagen, solo habilitado si está editando */}
                            <div className="space-y-2 md:col-span-3">
                              <Label className="block text-sm font-medium text-gray-700">Imagen</Label>

                              <div className={`${!isEditing ? "pointer-events-none opacity-50" : ""}`}>
                                <ImageEditor
                                  compact
                                  currentImageUrl={isEditing ? editImagen : ad.imagen}
                                  onImageChange={(url) => {
                                    if (isEditing) {
                                      setEditImagen(url);
                                    }
                                  }}
                                />
                              </div>
                            </div>


                            {/* Aquí ya no pones el Input para la imagen */}

                            <div className="md:col-span-3 flex justify-end space-x-2">
                              {isEditing ? (
                                <>
                                  <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700">
                                    <Pencil className="w-4 h-4 mr-1" /> Guardar
                                  </Button>
                                  <Button
                                    onClick={cancelEditing}
                                    variant="outline"
                                    className="text-gray-700 border-gray-300"
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
                                  >
                                    <Pencil className="w-4 h-4 mr-1" /> Editar
                                  </Button>

                                  <Button variant="destructive" onClick={() => openDeleteDialog(ad)}>
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


        {/* Modal */}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirmar eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro que quieres eliminar la publicidad{" "}
                <strong>{adToDelete?.titulo}</strong>?
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={closeDeleteDialog}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Eliminar
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
