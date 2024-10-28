// components/products/NewProductModal/Modal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-2xl -translate-x-1/2 rounded-xl bg-white/95 shadow-xl backdrop-blur-sm"
          >
            <div className="relative overflow-hidden rounded-xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent" />
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary-100/30 blur-3xl" />
              <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-primary-100/30 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between border-b p-4">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-xl font-semibold text-transparent"
                  >
                    {title}
                  </motion.h2>
                  <motion.button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100/80"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <div className="p-6">{children}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
