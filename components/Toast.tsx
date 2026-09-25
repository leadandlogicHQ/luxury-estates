"use client";

import { Toaster } from "sonner";

interface ToastProviderProps {
  children?: React.ReactNode;
}

/**
 * Wraps the app so any component can call `toast(...)`,
 * and renders the single shared <Toaster /> viewport.
 */
export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "!bg-white !text-secondary !border-border !rounded-xl !shadow-[0_12px_32px_rgba(23,23,23,0.12)]",
            title: "!font-semibold !text-sm",
            description: "!text-xs !text-text-light",
          },
        }}
      />
    </>
  );
}