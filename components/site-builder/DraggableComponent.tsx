"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentProps } from '@/lib/site-builder/types';

interface DraggableComponentProps {
  component: ComponentProps;
  isEditorMode: boolean;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isEditorMode
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditorMode ? listeners : {})}
      className={isDragging ? 'ring-2 ring-blue-500' : ''}
    >
      <ComponentRenderer component={component} isEditorMode={isEditorMode} />
    </div>
  );
};
