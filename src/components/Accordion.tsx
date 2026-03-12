"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="border-b border-border-primary/50 last:border-0"
          >
            <button
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center gap-3 py-3.5 px-1 text-left focus-visible:ring-2 focus-visible:ring-accent-green outline-none"
            >
              <span className="w-7 h-7 rounded-full bg-bg-input flex items-center justify-center flex-shrink-0 text-xs font-bold text-text-secondary">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-text-primary">
                {item.title}
              </span>
              <ChevronDown
                size={16}
                className={`text-text-muted transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-text-muted pb-3 pl-10 pr-2">
                    {item.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
