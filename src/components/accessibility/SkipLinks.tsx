'use client';

import { motion } from 'framer-motion';

export default function SkipLinks() {
  const skipLinks = [
    { href: '#main-content', text: 'Ana içeriğe geç' },
    { href: '#navigation', text: 'Navigasyona geç' },
    { href: '#search', text: 'Arama kutusuna geç' },
    { href: '#filters', text: 'Filtrelere geç' },
    { href: '#products', text: 'Ürünlere geç' }
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      {skipLinks.map((link, index) => (
        <motion.a
          key={link.href}
          href={link.href}
          className="absolute top-4 left-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onFocus={(e) => {
            e.target.classList.remove('sr-only');
          }}
          onBlur={(e) => {
            e.target.classList.add('sr-only');
          }}
        >
          {link.text}
        </motion.a>
      ))}
    </div>
  );
}
