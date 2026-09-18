import { Toaster } from "sonner"
import AppRoutes from "./app/Routes"

function App() {

  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
