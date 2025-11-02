'use client';

import { motion } from 'framer-motion';

interface PageEditorCanvasProps {
  pageData: any;
  isPreviewMode: boolean;
  onElementClick: (element: any) => void;
  selectedElement: any;
}

export default function PageEditorCanvas({ 
  pageData, 
  isPreviewMode, 
  onElementClick, 
  selectedElement 
}: PageEditorCanvasProps) {
  
  const renderSection = (section: any) => {
    const isSelected = selectedElement?.id === section.id;

    switch(section.type) {
      case 'hero':
        return (
          <motion.div
            key={section.id}
            onClick={() => onElementClick(section)}
            className={`relative min-h-[500px] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center cursor-pointer group ${
              isSelected ? 'ring-4 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300'
            }`}
            whileHover={!isPreviewMode ? { scale: 1.001 } : {}}
          >
            {/* Edit Overlay */}
            {!isPreviewMode && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit Hero
              </div>
            )}

            <div className="text-center px-4">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 editable-element" data-field="title">
                {section.content.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 editable-element" data-field="subtitle">
                {section.content.subtitle}
              </p>
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors editable-element" data-field="cta">
                {section.content.cta}
              </button>
            </div>
          </motion.div>
        );

      case 'text':
        return (
          <motion.div
            key={section.id}
            onClick={() => onElementClick(section)}
            className={`p-8 cursor-pointer group ${
              isSelected ? 'ring-4 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300'
            }`}
          >
            {!isPreviewMode && (
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Text Block
              </div>
            )}
            <div 
              className="prose max-w-none editable-element" 
              dangerouslySetInnerHTML={{ __html: section.content.html }}
            />
          </motion.div>
        );

      case 'image':
        return (
          <motion.div
            key={section.id}
            onClick={() => onElementClick(section)}
            className={`p-8 cursor-pointer group ${
              isSelected ? 'ring-4 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300'
            }`}
          >
            {!isPreviewMode && (
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Image
              </div>
            )}
            {section.content.url ? (
              <img 
                src={section.content.url} 
                alt={section.content.alt || ''} 
                className="w-full h-auto rounded-lg editable-element"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Görsel eklemek için tıklayın</p>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return (
          <div 
            key={section.id}
            onClick={() => onElementClick(section)}
            className="p-8 bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <p className="text-gray-500">Bilinmeyen section tipi: {section.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Page Content */}
      {pageData.sections.map((section: any) => renderSection(section))}

      {/* Empty State */}
      {pageData.sections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Layout className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Sayfa boş</p>
            <p className="text-sm">Soldan component ekleyerek başlayın</p>
          </div>
        </div>
      )}
    </div>
  );
}

