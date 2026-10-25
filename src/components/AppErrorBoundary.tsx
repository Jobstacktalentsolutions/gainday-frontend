import { Component, type ErrorInfo, type ReactNode } from "react"
import { reportError } from "@/lib/reportError"

interface AppErrorBoundaryProps {
    children: ReactNode
    /** When this value changes, a caught error is cleared (pass the current pathname). */
    resetKey?: string
    renderFallback: (props: { error: Error; reset: () => void }) => ReactNode
}

interface AppErrorBoundaryState {
    error: Error | null
}

// Error boundaries must be class components. This catches errors thrown while rendering,
// in lifecycle methods, and by lazy-loaded chunks. It does NOT catch errors in event handlers
// or in promises — those need their own try/catch or a toast.
export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        reportError(error, { componentStack: info.componentStack })
    }

    componentDidUpdate(previousProps: AppErrorBoundaryProps) {
        // Navigating somewhere else is a fresh start.
        if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
            this.setState({ error: null })
        }
    }

    reset = () => this.setState({ error: null })

    render() {
        if (this.state.error) {
            return this.props.renderFallback({ error: this.state.error, reset: this.reset })
        }
        return this.props.children
    }
}