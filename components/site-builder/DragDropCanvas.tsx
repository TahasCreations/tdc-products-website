"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useEditorStore } from '@/lib/site-builder/store';
import { ComponentRenderer } from './ComponentRenderer';

interface DragDropCanvasProps {
  onDrop: (componentId: string, targetId: string | null, index: number) => void;
}

export const DragDropCanvas: React.FC<DragDropCanvasProps> = ({ onDrop }) => {
  const { currentPage, selectedComponentId, selectComponent, mode } = useEditorStore();
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  if (!currentPage) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sayfa Yüklenmedi</h3>
          <p className="text-gray-600">Düzenlemek için bir sayfa seçin veya yeni sayfa oluşturun</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    onDrop(draggableId, destination.droppableId, destination.index);
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      <div className="mx-auto bg-white shadow-2xl transition-all duration-300 max-w-full">
        <Droppable droppableId="canvas-root">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-screen ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
            >
              {currentPage.rootComponentIds.map((componentId, index) => {
                const component = currentPage.components[componentId];
                if (!component) return null;

                return (
                  <Draggable key={componentId} draggableId={componentId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                      >
                        <ComponentRenderer
                          component={component}
                          isEditorMode={mode === 'edit'}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Empty State */}
        {currentPage.rootComponentIds.length === 0 && (
          <div className="min-h-screen flex items-center justify-center p-12 text-center">
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Boş Sayfa</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Soldaki Component Library'den sürükleyerek sayfanızı oluşturmaya başlayın
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>💡</span>
                <span>İpucu: Section ile başlayın</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

