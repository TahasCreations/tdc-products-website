"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentProps } from '@/lib/site-builder/types';
import { GripVertical } from 'lucide-react';

interface Props {
  component: ComponentProps;
  isEditorMode: boolean;
}

export const DraggableComponent: React.FC<Props> = ({ component, isEditorMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!isEditorMode) {
    return <ComponentRenderer component={component} isEditorMode={false} />;
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center shadow-lg">
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      </div>

      <ComponentRenderer component={component} isEditorMode={isEditorMode} />
    </div>
  );
};

