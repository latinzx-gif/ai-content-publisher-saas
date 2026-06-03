export default function AssetComposerLockedPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#FAF9F6] dark:bg-slate-950 p-6 sm:p-8 select-none font-sans min-h-screen">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
          Asset Composer
        </h1>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          ⏳ Phase 2 — Preview Only
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm mx-auto">
          The Asset Composer is a Phase 2 feature for advanced visual layout configuration, collage creation, and multi-image formatting. It is not available in the current MVP release.
        </p>
        <p className="text-xs text-slate-300 dark:text-slate-600">
          Planned for a future update after the June 2026 MVP delivery.
        </p>
      </div>
    </div>
  )
}