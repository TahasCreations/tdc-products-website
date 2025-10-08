'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface MegaMenuItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuProps {
  trigger: string;
  sections: MegaMenuSection[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

export default function MegaMenu({ trigger, sections, featured }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#CBA135] dark:hover:text-[#F4D03F] transition-colors">
        <span>{trigger}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Mega Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              style={{ top: '80px' }}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-6xl z-50"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="grid grid-cols-4 gap-8">
                  {/* Sections */}
                  {sections.map((section, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link
                              href={item.href}
                              className="group block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                {item.icon && (
                                  <span className="text-xl">{item.icon}</span>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#CBA135] transition-colors">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Featured */}
                  {featured && (
                    <div className="col-span-1">
                      <Link
                        href={featured.href}
                        className="block h-full bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10 rounded-xl p-6 hover:from-[#CBA135]/20 hover:to-[#F4D03F]/20 transition-all duration-300 group"
                      >
                        <div className="space-y-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-lg flex items-center justify-center text-2xl">
                            ⭐
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#CBA135] transition-colors">
                            {featured.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {featured.description}
                          </p>
                          <div className="inline-flex items-center text-sm font-medium text-[#CBA135] group-hover:gap-2 transition-all">
                            Keşfet
                            <motion.span
                              initial={{ x: 0 }}
                              whileHover={{ x: 4 }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
