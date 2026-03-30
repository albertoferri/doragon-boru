import { Component } from 'react'
import { useLocation } from 'react-router-dom'

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] error:', error?.message, error)
    console.error('[ErrorBoundary] component stack:', info?.componentStack)
    this.setState({ errorMessage: error?.message })
  }

  // Reset automatically when the route changes (locationKey prop changes → remount)
  // This is handled by the outer wrapper using key={locationKey}

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-5xl">⚠️</div>
          <p className="text-neutral-300 text-center max-w-md">
            Something went wrong loading this page.
          </p>
          {this.state.errorMessage && (
            <p className="text-red-400 text-xs font-mono text-center max-w-md px-4">
              {this.state.errorMessage}
            </p>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.history.back()
            }}
            className="btn-primary mt-2"
          >
            Go Back
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Wrap with a functional component so we can read location and reset the
// boundary on every route change by passing a new key.
export default function ErrorBoundary({ children }) {
  const { pathname } = useLocation()
  return (
    <ErrorBoundaryInner key={pathname}>
      {children}
    </ErrorBoundaryInner>
  )
}
