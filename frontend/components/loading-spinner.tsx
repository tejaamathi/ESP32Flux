export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 animate-spin">
        <svg viewBox="0 0 24 24" className="h-12 w-12">
          <circle
            className="stroke-current opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="2"
          />
          <path
            className="stroke-current"
            d="M12 2C6.477 2 2 6.477 2 12"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}

