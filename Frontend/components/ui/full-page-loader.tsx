import { Spinner } from "@/components/ui/spinner"

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Spinner size={48} />
    </div>
  )
}
