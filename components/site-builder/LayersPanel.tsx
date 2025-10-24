"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreVertical
} from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';
import { ComponentProps } from '@/lib/site-builder/types';

export const LayersPanel: React.FC = () => {
  const { currentPage, selectedComponentId, selectComponent, updateComponent } = useEditorStore();
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  if (!currentPage) return null;

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = currentPage.components[id];
    if (!component) return;
    
    const settings = { ...component.settings, visible: !component.settings?.visible };
    updateComponent(id, { settings });
  };

  const toggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = currentPage.components[id];
    if (!component) return;
    
    const settings = { ...component.settings, locked: !component.settings?.locked };
    updateComponent(id, { settings });
  };

  const renderComponent = (component: ComponentProps, level: number = 0) => {
    const hasChildren = component.children && component.children.length > 0;
    const isExpanded = expanded.has(component.id);
    const isSelected = selectedComponentId === component.id;

    return (
      <div key={component.id}>
        <div
          onClick={() => selectComponent(component.id)}
          className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-l-2 border-blue-600' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(component.id);
              }}
              className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4"></div>
          )}

          <div className="flex-1 text-sm font-medium text-gray-900 truncate">
            {component.settings?.name || component.type}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => toggleVisibility(component.id, e)}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
            >
              {component.settings?.visible !== false ? (
                <Eye className="w-3 h-3 text-gray-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={(e) => toggleLock(component.id, e)}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
            >
              {component.settings?.locked ? (
                <Lock className="w-3 h-3 text-gray-600" />
              ) : (
                <Unlock className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {component.children!.map(childId => {
              const child = currentPage.components[childId];
              if (!child) return null;
              return renderComponent(child, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MoreVertical className="w-5 h-5" />
          Layers
        </h3>
        <p className="text-xs text-gray-600 mt-1">{currentPage.rootComponentIds.length} component</p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto">
        {currentPage.rootComponentIds.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MoreVertical className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Henüz component yok</p>
          </div>
        ) : (
          <div>
            {currentPage.rootComponentIds.map(componentId => {
              const component = currentPage.components[componentId];
              if (!component) return null;
              return renderComponent(component);
            })}
          </div>
        )}
      </div>
    </div>
  );
};

