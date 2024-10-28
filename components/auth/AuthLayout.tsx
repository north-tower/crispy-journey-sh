// components/auth/AuthLayout.tsx
"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen font-mono w-full bg-gradient-to-br from-white to-primary-50">
      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary-300 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-primary-400 blur-3xl"
        />
      </div>

      <div className="container relative mx-auto min-h-screen px-4">
        <div className="flex min-h-screen items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 p-2"
              >
                <div className="h-full w-full rounded-lg bg-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-3xl font-bold tracking-tight text-gray-900"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm text-gray-600"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* Form container with subtle border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative rounded-2xl border border-gray-100 bg-white/50 p-8 shadow-xl shadow-gray-100/10 backdrop-blur-lg"
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
