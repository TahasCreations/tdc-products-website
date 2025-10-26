"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentProps } from '@/lib/site-builder/types';

interface DroppableAreaProps {
  id: string;
  components: ComponentProps[];
  isEditorMode: boolean;
  className?: string;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  components,
  isEditorMode,
  className = ''
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-50 border-2 border-blue-500 border-dashed' : ''}`}
    >
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isEditorMode={isEditorMode}
        />
      ))}
    </div>
  );
};

