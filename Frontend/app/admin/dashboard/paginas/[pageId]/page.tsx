"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileEdit } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { UserWelcome } from "@/components/admin/user-welcome"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Save } from "lucide-react"

// Importar editores específicos para cada página
import { HomeEditor } from "@/components/admin/page-editor/page-templates/home-editor"
import { SobreNosotrosEditor } from "@/components/admin/page-editor/page-templates/sobre-nosotros-editor"
import { FacilidadesEditor } from "@/components/admin/page-editor/page-templates/facilidades-editor"
import { ComoLlegarEditor } from "@/components/admin/page-editor/page-templates/como-llegar-editor"

// Importar previsualizaciones específicas para cada página
import { HomePreview } from "@/components/admin/page-editor/page-previews/home-preview"
import { SobreNosotrosPreview } from "@/components/admin/page-editor/page-previews/sobre-nosotros-preview"
import { FacilidadesPreview } from "@/components/admin/page-editor/page-previews/facilidades-preview"
import { ComoLlegarPreview } from "@/components/admin/page-editor/page-previews/como-llegar-preview"
import { useContacto } from "@/hooks/use-contacto"

// Actualizar los datos iniciales para la página "como-llegar"
const paginasData = {
  home: {
    titulo: "Bienvenidos al Hotel Los Viejos",
    subtitulo: "Su paraíso en la playa le espera. Disfrute de nuestras instalaciones de lujo y la mejor vista al mar.",
    descripcionBienvenida:
      "Ubicado en la hermosa costa, Hotel Los Viejos ofrece una experiencia única de hospedaje con vistas impresionantes al océano. Nuestras habitaciones están diseñadas para brindar el máximo confort y relajación durante su estadía. Disfrute de nuestras instalaciones de primera clase, incluyendo piscina infinita, restaurante gourmet, y acceso directo a la playa. Nuestro personal está dedicado a hacer de su visita una experiencia inolvidable. Ya sea que visite por negocios o placer, Hotel Los Viejos es su hogar lejos del hogar. Nuestro compromiso es brindarle una experiencia excepcional, donde cada detalle ha sido cuidadosamente pensado para su comodidad y disfrute. Desde el momento de su llegada, será recibido con la calidez y hospitalidad que nos caracteriza.",
    imagenHero: "/placeholder.svg?height=400&width=800",
    imagenPiscina: "/placeholder.svg?height=300&width=400",
  },
  "sobre-nosotros": {
    historia:
      "Hotel Los Viejos nació en 2005 con la visión de crear un paraíso tropical donde nuestros huéspedes pudieran experimentar la belleza natural de las playas más hermosas del mundo, combinada con el lujo y la comodidad de instalaciones de primera clase. Ubicado en una exclusiva zona costera, nuestro hotel ha sido diseñado para integrarse armoniosamente con el entorno natural, respetando el ecosistema y promoviendo prácticas sostenibles. Cada rincón de nuestras instalaciones ha sido cuidadosamente pensado para ofrecer una experiencia inolvidable. Nuestro equipo está formado por profesionales apasionados por la hospitalidad, dedicados a hacer de su estancia una experiencia excepcional. Desde nuestro chef ejecutivo hasta nuestro personal de limpieza, todos compartimos el mismo compromiso con la excelencia y la atención personalizada. En Hotel Los Viejos, no solo ofrecemos alojamiento, sino una experiencia completa que combina la belleza natural, la gastronomía local e internacional, actividades recreativas y el más alto nivel de servicio. Le invitamos a descubrir por qué somos el destino preferido de viajeros exigentes de todo el mundo.",
    imagenPrincipal: "/placeholder.svg?height=400&width=600",
    imagenesGaleria: [
      {
        id: "1",
        url: "/placeholder.svg?height=200&width=300",
        titulo: "Playa",
      },
      {
        id: "2",
        url: "/placeholder.svg?height=200&width=300",
        titulo: "Atardecer",
      },
      {
        id: "3",
        url: "/placeholder.svg?height=200&width=300",
        titulo: "Mar",
      },
      {
        id: "4",
        url: "/placeholder.svg?height=200&width=300",
        titulo: "Costa",
      },
    ],
  },
  facilidades: {
    facilidades: [
      {
        id: "1",
        nombre: "Piscina Infinita",
        descripcion:
          "Disfrute de nuestra espectacular piscina infinita con vistas panorámicas al océano. Perfecta para relajarse bajo el sol tropical mientras disfruta de su bebida favorita del bar de la piscina. Contamos con tumbonas cómodas y servicio de toallas.",
        imagen: "/placeholder.svg?height=300&width=400",
      },
      {
        id: "2",
        nombre: "Restaurante El Velero",
        descripcion:
          "Nuestro restaurante principal ofrece una exquisita selección de platos locales e internacionales. Con ingredientes frescos y locales, nuestro chef ejecutivo crea experiencias culinarias memorables en un ambiente elegante con vista al mar.",
        imagen: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  "como-llegar": {
    titulo: "Cómo Llegar",
    descripcion:
      "Estamos ubicados en una de las zonas más hermosas de Costa Rica, con fácil acceso desde los principales aeropuertos.",
    direccion: "San Francisco de Coyote, Guanacaste, Costa Rica",
    correo: "info@hotellosviejo.com",
    telefono: "+506 2222-3333",
    codigoPostal: "50101",
    coordenadas: {
      latitud: "9.7489",
      longitud: "-85.2755",
    },
    instrucciones:
      "Desde el Aeropuerto de Liberia:\n- Tome la ruta 21 hacia Nicoya\n- En Nicoya, siga la ruta 160 hacia Coyote\n- El hotel se encuentra a 2 km del centro de Coyote\n\nDesde San José:\n- Tome la ruta 27 hacia Puntarenas\n- Continúe por la ruta 1 hasta Liberia\n- Siga las indicaciones anteriores desde Liberia",
  },
}

export default function EditarPaginaPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.pageId as string
  const [username] = useState("USUARIO")
  const [isSaving, setIsSaving] = useState(false);
  

  // Verificar si la página existe
  const paginaExiste = Object.keys(paginasData).includes(pageId)

  // Obtener datos iniciales de la página
  const initialData = paginaExiste ? paginasData[pageId as keyof typeof paginasData] : {}

  // Estado para los datos del formulario
  const [formData, setFormData] = useState(initialData)

  // Actualizar formData cuando cambia la página
  useEffect(() => {
    if (paginaExiste) {
      setFormData(paginasData[pageId as keyof typeof paginasData])
    }
  }, [pageId, paginaExiste])

  // Manejar cambios en el formulario
  const handleFormChange = (data: any) => {
    setFormData(data)
  }

  // Simular guardado
  const handleSave = async () => {
    setIsSaving(true)

    // Simulación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)
    alert("Cambios guardados con éxito")
  }

  // Volver a la página anterior
  const handleBack = () => {
    router.push("/admin/dashboard/paginas")
  }

  // Si la página no existe
  if (!paginaExiste) {
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

            <Card className="p-6 border rounded-md">
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Página no encontrada</h1>
                <p className="text-gray-600 mb-6">La página que intenta editar no existe.</p>
                <Button onClick={handleBack} className="bg-teal-600 hover:bg-teal-700">
                  Volver a la lista de páginas
                </Button>
              </div>
            </Card>
          </div>
        </main>

        <AdminFooter />
      </div>
    )
  }

  // Obtener el título de la página actual
  const getNombrePagina = () => {
    const paginas = {
      home: "Home",
      "sobre-nosotros": "Sobre Nosotros",
      facilidades: "Facilidades",
      "como-llegar": "Como llegar",
    }
    return paginas[pageId as keyof typeof paginas] || "Página"
  }

  // Renderizar el editor específico según la página
  const renderEditor = () => {
    switch (pageId) {
      case "home":
        return <HomeEditor/>
      case "sobre-nosotros":
        return <SobreNosotrosEditor/>
      case "facilidades":
        return <FacilidadesEditor initialData={formData} onChange={handleFormChange} />
      case "como-llegar":
        return <ComoLlegarEditor/>
      default:
        return <div>Editor no disponible</div>
    }
  }

  // Renderizar la previsualización específica según la página
  const renderPreview = () => {
    switch (pageId) {
      case "home":
        return <HomePreview data={formData} />
      case "sobre-nosotros":
        return <SobreNosotrosPreview data={formData} />
      case "facilidades":
        return <FacilidadesPreview data={formData} />
      case "como-llegar":
        return <ComoLlegarPreview data={formData} />
      default:
        return <div>Vista previa no disponible</div>
    }
  }

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
                  <FileEdit className="h-6 w-6 text-teal-600" />
                  <h1 className="text-2xl font-playfair font-bold text-teal-800">Editar: {getNombrePagina()}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Volver
                  </Button>
                  
                </div>
              </div>

              {renderEditor()}
            </Card>

            <Card className="p-6 border rounded-md bg-blue-50">
              <h2 className="text-lg font-medium text-blue-800 mb-3">Vista previa de la página</h2>
              {renderPreview()}
            </Card>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  )
}

