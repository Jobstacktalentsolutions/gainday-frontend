import { Toaster } from "sonner"
import { useLocation } from "react-router-dom"
import AppRoutes from "./app/Routes"
import AppErrorBoundary from "./components/AppErrorBoundary"
import ErrorFallback from "./components/ErrorFallback"

function App() {
  const { pathname } = useLocation()

  return (
    <>
      <AppErrorBoundary
        resetKey={pathname}
        renderFallback={({ error, reset }) => <ErrorFallback error={error} reset={reset} />}
      >
        <AppRoutes />
      </AppErrorBoundary>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App