"use client";

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/site-builder/store';

export const KeyboardShortcuts: React.FC = () => {
  const {
    selectedComponentId,
    undo,
    redo,
    save,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pasteComponent
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }

      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }

      // Delete: Delete selected component
      if (e.key === 'Delete' && selectedComponentId) {
        e.preventDefault();
        deleteComponent(selectedComponentId);
      }

      // Ctrl/Cmd + D: Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponentId) {
        e.preventDefault();
        duplicateComponent(selectedComponentId);
      }

      // Ctrl/Cmd + C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedComponentId) {
        e.preventDefault();
        copyComponent(selectedComponentId);
      }

      // Ctrl/Cmd + V: Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteComponent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, undo, redo, save, deleteComponent, duplicateComponent, copyComponent, pasteComponent]);

  return null; // This component doesn't render anything
};

