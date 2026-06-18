'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="min-h-[100dvh] flex items-center justify-center bg-[#FFF8F0] p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">App Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          {error.digest && <p className="text-xs text-gray-500 mb-4">Digest: {error.digest}</p>}
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#D00000]"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
