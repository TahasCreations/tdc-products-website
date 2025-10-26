"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { useEditorStore } from '@/lib/site-builder/store';
import { ComponentProps } from '@/lib/site-builder/types';
import { DraggableComponent } from './DraggableComponent';

interface DragDropWrapperProps {
  children: React.ReactNode;
  components: ComponentProps[];
  onDragEnd: (event: DragEndEvent) => void;
}

export const DragDropWrapper: React.FC<DragDropWrapperProps> = ({
  children,
  components,
  onDragEnd
}) => {
  const { selectedComponentId } = useEditorStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onDragEnd(event);
    }

    setActiveId(null);
  };

  const activeComponent = components.find(c => c.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={components.map(c => c.id)} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>
      
      <DragOverlay>
        {activeComponent ? (
          <div className="opacity-50 rotate-3">
            <DraggableComponent component={activeComponent} isEditorMode={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

