import { Loader2 } from "lucide-react"

export const Loading = () => {
  return <div className="flex items-center justify-center h-full ">
    <Loader2 className="animate-spin text-gray-400" />
  </div>
}