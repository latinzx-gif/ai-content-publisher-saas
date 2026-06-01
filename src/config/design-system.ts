/**
 * AI Content Publisher Premium Design System Configuration Tokens
 * Tailored to match premium SaaS aesthetics (Notion, Linear, Buffer, Beehiiv)
 */

export const DESIGN_SYSTEM = {
  // 1. Color System
  colors: {
    // Canvas Background
    background: "bg-[#F8F9FA] dark:bg-[#0F172A]",
    
    // Cards, lists, and elements background
    surface: "bg-white dark:bg-[#1E293B]",
    
    // Global borders
    border: "border-slate-200/80 dark:border-slate-800",
    
    // Core text hierarchy
    text: {
      primary: "text-slate-900 dark:text-slate-50",
      secondary: "text-slate-500 dark:text-slate-400",
      muted: "text-slate-400 dark:text-slate-500",
    },

    // Status colors
    primary: "indigo", // HSL based premium blue-indigo
    success: "emerald", // HSL based mint-emerald success
    warning: "amber", // HSL based caution-amber warning
    error: "rose", // HSL based critical-rose error
  },

  // 2. Typography Rules
  typography: {
    heading: "font-heading font-bold tracking-tight text-slate-900 dark:text-slate-50",
    body: "font-body font-medium text-slate-700 dark:text-slate-300",
    meta: "font-body text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase",
  },

  // 3. Spacing, Layouts & Card Styles
  spacing: {
    padding: {
      card: "p-6 sm:p-8",
      compact: "p-4 sm:p-5",
    },
    gap: {
      grid: "gap-6 sm:gap-8",
      stack: "space-y-4 sm:space-y-6",
    }
  },

  cards: {
    // Premium Notion/Linear-like card styles
    dashboard: "bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-0.5",
    
    // Interactive Metric Cards
    metric: "bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] rounded-2xl p-5 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200",
  },

  // 4. Status Badges & Buttons Class maps
  badges: {
    success: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    warning: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    error: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    info: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    draft: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },

  buttons: {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl h-11 px-6 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-[0.98] transition-all duration-200",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-2xl h-11 px-6 active:scale-[0.98] transition-all duration-200",
    outline: "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold rounded-2xl h-11 px-6 active:scale-[0.98] transition-all duration-200",
  },
  
  // 5. Input Forms
  inputs: "h-10 text-xs rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-all outline-none",
  
  // 6. Tables styling
  tables: {
    header: "bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800",
    row: "hover:bg-slate-50/30 dark:hover:bg-slate-800/20 border-b border-slate-100 dark:border-slate-850 transition-colors",
  }
}
