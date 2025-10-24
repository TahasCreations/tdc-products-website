"use client";

import React from 'react';
import { ComponentProps } from '@/lib/site-builder/types';
import { styleToCss, getResponsiveStyles } from '@/lib/site-builder/utils';
import { useEditorStore } from '@/lib/site-builder/store';

interface Props {
  component: ComponentProps;
  isEditorMode?: boolean;
}

export const ComponentRenderer: React.FC<Props> = ({ component, isEditorMode = false }) => {
  const { 
    currentPage, 
    selectedComponentId, 
    hoveredComponentId,
    selectComponent, 
    hoverComponent,
    breakpoint 
  } = useEditorStore();

  if (!component) return null;

  const isSelected = isEditorMode && selectedComponentId === component.id;
  const isHovered = isEditorMode && hoveredComponentId === component.id && selectedComponentId !== component.id;
  
  const styles = getResponsiveStyles(component, breakpoint);
  const cssStyles = styleToCss(styles);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditorMode) {
      e.stopPropagation();
      selectComponent(component.id);
    }
  };

  const handleMouseEnter = () => {
    if (isEditorMode) {
      hoverComponent(component.id);
    }
  };

  const handleMouseLeave = () => {
    if (isEditorMode) {
      hoverComponent(null);
    }
  };

  const wrapperClasses = `
    ${isEditorMode ? 'cursor-pointer' : ''}
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
    ${isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : ''}
    ${component.className || ''}
  `.trim();

  const renderChildren = () => {
    if (!component.children || !currentPage) return null;
    
    return component.children.map(childId => {
      const child = currentPage.components[childId];
      if (!child) return null;
      return <ComponentRenderer key={childId} component={child} isEditorMode={isEditorMode} />;
    });
  };

  switch (component.type) {
    case 'section':
      return (
        <section
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren()}
        </section>
      );

    case 'container':
      return (
        <div
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren()}
        </div>
      );

    case 'grid':
      return (
        <div
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren()}
        </div>
      );

    case 'flex':
      return (
        <div
          style={{ ...cssStyles, display: 'flex' }}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren()}
        </div>
      );

    case 'heading':
      const HeadingTag = (component.content?.html?.startsWith('<h') ? 'div' : 'h2') as any;
      return (
        <HeadingTag
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...(component.content?.html ? { dangerouslySetInnerHTML: { __html: component.content.html } } : {})}
        >
          {!component.content?.html && (component.content?.text || 'Başlık')}
        </HeadingTag>
      );

    case 'text':
      return (
        <p
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...(component.content?.html ? { dangerouslySetInnerHTML: { __html: component.content.html } } : {})}
        >
          {!component.content?.html && (component.content?.text || 'Metin')}
        </p>
      );

    case 'image':
      return (
        <img
          src={component.content?.src || '/placeholder.jpg'}
          alt={component.content?.alt || ''}
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );

    case 'video':
      return (
        <video
          src={component.content?.src}
          controls
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );

    case 'button':
      return (
        <button
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {component.content?.text || 'Buton'}
        </button>
      );

    case 'link':
      return (
        <a
          href={isEditorMode ? undefined : component.content?.href}
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {component.content?.text || 'Link'}
        </a>
      );

    case 'gallery':
      return (
        <div
          style={cssStyles}
          className={`${wrapperClasses} grid grid-cols-3 gap-4`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {component.content?.items?.map((item: any, idx: number) => (
            <img key={idx} src={item.src} alt={item.alt || ''} className="w-full h-auto rounded" />
          )) || (
            <>
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
            </>
          )}
        </div>
      );

    case 'hero':
      return (
        <div
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren() || (
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">{component.content?.text || 'Hero Title'}</h1>
              <p className="text-xl mb-8">Harika bir açıklama buraya gelecek</p>
              <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold">
                Başlayın
              </button>
            </div>
          )}
        </div>
      );

    case 'spacer':
      return (
        <div
          style={{ ...cssStyles, minHeight: cssStyles.height || '2rem' }}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );

    default:
      return (
        <div
          style={cssStyles}
          className={wrapperClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderChildren()}
        </div>
      );
  }
};

