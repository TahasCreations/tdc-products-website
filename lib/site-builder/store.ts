import { create } from 'zustand';
import { EditorState, PageData, ComponentProps } from './types';
import { generateId } from './utils';

interface EditorStore extends EditorState {
  // Page Management
  loadPage: (page: PageData) => void;
  updatePage: (updates: Partial<PageData>) => void;
  
  // Component Management
  addComponent: (component: ComponentProps, parentId?: string, index?: number) => void;
  updateComponent: (id: string, updates: Partial<ComponentProps>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, index?: number) => void;
  
  // Selection
  selectComponent: (id: string | null) => void;
  hoverComponent: (id: string | null) => void;
  
  // History (Undo/Redo)
  undo: () => void;
  redo: () => void;
  addToHistory: (page: PageData) => void;
  
  // Mode & View
  setMode: (mode: 'edit' | 'preview') => void;
  setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
  
  // UI State
  toggleLayers: () => void;
  toggleProperties: () => void;
  toggleComponentLibrary: () => void;
  
  // Clipboard
  copyComponent: (id: string) => void;
  pasteComponent: (parentId?: string) => void;
  
  // Save
  save: () => Promise<void>;
  publish: () => Promise<void>;
  
  // Reset
  reset: () => void;
}

const initialState: EditorState = {
  currentPage: null,
  selectedComponentId: null,
  hoveredComponentId: null,
  mode: 'edit',
  breakpoint: 'desktop',
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  showLayers: true,
  showProperties: true,
  showComponentLibrary: true,
  clipboard: null,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  loadPage: (page) => {
    set({
      currentPage: page,
      history: [page],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
      selectedComponentId: null,
    });
  },

  updatePage: (updates) => {
    const current = get().currentPage;
    if (!current) return;
    
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    set({ currentPage: updated });
    get().addToHistory(updated);
  },

  addComponent: (component, parentId, index) => {
    const current = get().currentPage;
    if (!current) return;

    const newComponent = {
      ...component,
      id: component.id || generateId(),
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const components = { ...current.components, [newComponent.id]: newComponent };
    let rootComponentIds = [...current.rootComponentIds];

    if (parentId) {
      // Add to parent's children
      const parent = components[parentId];
      if (parent) {
        const children = parent.children || [];
        if (index !== undefined) {
          children.splice(index, 0, newComponent.id);
        } else {
          children.push(newComponent.id);
        }
        components[parentId] = { ...parent, children };
      }
    } else {
      // Add to root
      if (index !== undefined) {
        rootComponentIds.splice(index, 0, newComponent.id);
      } else {
        rootComponentIds.push(newComponent.id);
      }
    }

    const updated = { ...current, components, rootComponentIds, updatedAt: new Date().toISOString() };
    set({ currentPage: updated, selectedComponentId: newComponent.id });
    get().addToHistory(updated);
  },

  updateComponent: (id, updates) => {
    const current = get().currentPage;
    if (!current || !current.components[id]) return;

    const component = current.components[id];
    const updated = {
      ...component,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const components = { ...current.components, [id]: updated };
    const page = { ...current, components, updatedAt: new Date().toISOString() };
    
    set({ currentPage: page });
    get().addToHistory(page);
  },

  deleteComponent: (id) => {
    const current = get().currentPage;
    if (!current) return;

    const component = current.components[id];
    if (!component) return;

    // Remove from parent or root
    let rootComponentIds = [...current.rootComponentIds];
    const components = { ...current.components };

    if (component.parentId) {
      const parent = components[component.parentId];
      if (parent && parent.children) {
        const children = parent.children.filter(childId => childId !== id);
        components[component.parentId] = { ...parent, children };
      }
    } else {
      rootComponentIds = rootComponentIds.filter(rootId => rootId !== id);
    }

    // Recursively delete children
    const deleteRecursive = (compId: string) => {
      const comp = components[compId];
      if (comp && comp.children) {
        comp.children.forEach(deleteRecursive);
      }
      delete components[compId];
    };
    deleteRecursive(id);

    const updated = { ...current, components, rootComponentIds, updatedAt: new Date().toISOString() };
    set({ currentPage: updated, selectedComponentId: null });
    get().addToHistory(updated);
  },

  duplicateComponent: (id) => {
    const current = get().currentPage;
    if (!current) return;

    const component = current.components[id];
    if (!component) return;

    const duplicate = (comp: ComponentProps, newParentId?: string): ComponentProps => {
      const newId = generateId();
      const newComp: ComponentProps = {
        ...comp,
        id: newId,
        parentId: newParentId,
        children: comp.children ? comp.children.map(childId => {
          const child = current.components[childId];
          if (!child) return '';
          const duplicatedChild = duplicate(child, newId);
          return duplicatedChild.id;
        }).filter(Boolean) : undefined,
        settings: {
          ...comp.settings,
          name: comp.settings?.name ? `${comp.settings.name} (Kopya)` : undefined,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newComp;
    };

    const duplicated = duplicate(component, component.parentId);
    get().addComponent(duplicated, component.parentId);
  },

  moveComponent: (id, newParentId, index) => {
    const current = get().currentPage;
    if (!current) return;

    const component = current.components[id];
    if (!component) return;

    // Remove from old parent
    let components = { ...current.components };
    let rootComponentIds = [...current.rootComponentIds];

    if (component.parentId) {
      const oldParent = components[component.parentId];
      if (oldParent && oldParent.children) {
        const children = oldParent.children.filter(childId => childId !== id);
        components[component.parentId] = { ...oldParent, children };
      }
    } else {
      rootComponentIds = rootComponentIds.filter(rootId => rootId !== id);
    }

    // Add to new parent
    const updatedComponent = { ...component, parentId: newParentId || undefined };
    components[id] = updatedComponent;

    if (newParentId) {
      const newParent = components[newParentId];
      if (newParent) {
        const children = [...(newParent.children || [])];
        if (index !== undefined) {
          children.splice(index, 0, id);
        } else {
          children.push(id);
        }
        components[newParentId] = { ...newParent, children };
      }
    } else {
      if (index !== undefined) {
        rootComponentIds.splice(index, 0, id);
      } else {
        rootComponentIds.push(id);
      }
    }

    const updated = { ...current, components, rootComponentIds, updatedAt: new Date().toISOString() };
    set({ currentPage: updated });
    get().addToHistory(updated);
  },

  selectComponent: (id) => set({ selectedComponentId: id }),
  hoverComponent: (id) => set({ hoveredComponentId: id }),

  addToHistory: (page) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(page);
    
    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        currentPage: history[newIndex],
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        currentPage: history[newIndex],
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
      });
    }
  },

  setMode: (mode) => set({ mode }),
  setBreakpoint: (breakpoint) => set({ breakpoint }),

  toggleLayers: () => set((state) => ({ showLayers: !state.showLayers })),
  toggleProperties: () => set((state) => ({ showProperties: !state.showProperties })),
  toggleComponentLibrary: () => set((state) => ({ showComponentLibrary: !state.showComponentLibrary })),

  copyComponent: (id) => {
    const current = get().currentPage;
    if (!current) return;
    const component = current.components[id];
    if (component) {
      set({ clipboard: component });
    }
  },

  pasteComponent: (parentId) => {
    const { clipboard } = get();
    if (!clipboard) return;
    
    const duplicate = (comp: ComponentProps): ComponentProps => ({
      ...comp,
      id: generateId(),
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    get().addComponent(duplicate(clipboard), parentId);
  },

  save: async () => {
    const current = get().currentPage;
    if (!current) return;

    try {
      const response = await fetch('/api/site-builder/pages/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: current }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      console.log('Page saved successfully');
    } catch (error) {
      console.error('Error saving page:', error);
      throw error;
    }
  },

  publish: async () => {
    const current = get().currentPage;
    if (!current) return;

    try {
      const response = await fetch('/api/site-builder/pages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: current.id }),
      });

      if (!response.ok) {
        throw new Error('Publish failed');
      }

      const updated = { ...current, status: 'published' as const, publishedAt: new Date().toISOString() };
      set({ currentPage: updated });
      console.log('Page published successfully');
    } catch (error) {
      console.error('Error publishing page:', error);
      throw error;
    }
  },

  reset: () => set(initialState),
}));

