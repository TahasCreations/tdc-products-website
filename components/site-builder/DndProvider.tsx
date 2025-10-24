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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEditorStore } from '@/lib/site-builder/store';

interface Props {
  children: React.ReactNode;
}

export const DndProvider: React.FC<Props> = ({ children }) => {
  const { currentPage, moveComponent } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px hareket sonrası drag başlasın
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !currentPage) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the components
    const activeComp = currentPage.components[activeId];
    const overComp = currentPage.components[overId];

    if (!activeComp || !overComp) return;

    // If they have the same parent, reorder
    if (activeComp.parentId === overComp.parentId) {
      const parentId = activeComp.parentId;
      
      if (parentId) {
        const parent = currentPage.components[parentId];
        if (parent && parent.children) {
          const oldIndex = parent.children.indexOf(activeId);
          const newIndex = parent.children.indexOf(overId);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const newChildren = arrayMove(parent.children, oldIndex, newIndex);
            // Update parent's children
            const updatedParent = { ...parent, children: newChildren };
            // This would need to be handled by the store
          }
        }
      } else {
        // Root level reordering
        const oldIndex = currentPage.rootComponentIds.indexOf(activeId);
        const newIndex = currentPage.rootComponentIds.indexOf(overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newRootIds = arrayMove(currentPage.rootComponentIds, oldIndex, newIndex);
          // Update root IDs - would need store method
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

