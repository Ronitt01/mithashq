'use client';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FFF8F0] p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">The app encountered an error. Details below:</p>
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-4 overflow-auto max-h-60">
          <p className="text-xs font-mono text-red-600 break-all">{error.message}</p>
          {error.digest && <p className="text-xs font-mono text-gray-500 mt-2">Digest: {error.digest}</p>}
          {error.stack && <pre className="text-xs font-mono text-gray-500 mt-2 whitespace-pre-wrap">{error.stack}</pre>}
        </div>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#D00000] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
