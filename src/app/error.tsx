'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bir hata oluştu</h1>
        <p className="text-gray-600 mb-8">Üzgünüz, beklenmeyen bir hata meydana geldi.</p>
        <button
          onClick={reset}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}