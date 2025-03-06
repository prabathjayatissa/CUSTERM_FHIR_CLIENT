import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface FhirResourceViewerProps {
  resource: any;
  title?: string;
  initiallyExpanded?: boolean;
}

const FhirResourceViewer: React.FC<FhirResourceViewerProps> = ({ 
  resource, 
  title,
  initiallyExpanded = true 
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!resource) return null;

  const isExpandable = (value: any): boolean => {
    return value !== null && 
           typeof value === 'object' && 
           !Array.isArray(value) &&
           Object.keys(value).length > 0;
  };

  const isArray = (value: any): boolean => {
    return Array.isArray(value) && value.length > 0;
  };

  const isReference = (value: any): boolean => {
    return typeof value === 'object' && 
           value !== null && 
           'reference' in value;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    return '';
  };

  const formatKey = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  const renderValue = (value: any, depth: number = 0, path: string = ''): JSX.Element | null => {
    if (value === null || value === undefined) return null;

    const toggleExpanded = (currentPath: string) => {
      setExpanded(prev => ({
        ...prev,
        [currentPath]: !prev[currentPath]
      }));
    };

    const isCurrentlyExpanded = (currentPath: string) => {
      return expanded[currentPath] ?? initiallyExpanded;
    };

    if (isReference(value)) {
      return (
        <div className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
          <span>{value.reference}</span>
          <ExternalLink size={14} />
        </div>
      );
    }

    if (isArray(value)) {
      const currentPath = `${path}[]`;
      return (
        <div>
          <div 
            className="flex items-center cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
            onClick={() => toggleExpanded(currentPath)}
          >
            {isCurrentlyExpanded(currentPath) ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}
            <span className="text-gray-500">[{value.length} items]</span>
          </div>
          {isCurrentlyExpanded(currentPath) && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2">
              {value.map((item: any, index: number) => (
                <div key={index} className="my-1">
                  {typeof item === 'object' ? (
                    renderValue(item, depth + 1, `${currentPath}[${index}]`)
                  ) : (
                    <span className="text-gray-900">{formatValue(item)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (isExpandable(value)) {
      const currentPath = path ? `${path}.${value.id || ''}` : value.id || '';
      return (
        <div>
          {Object.entries(value).map(([key, val]) => {
            if (val === null || val === undefined) return null;
            return (
              <div key={key} className="my-1">
                <div className="flex items-start">
                  <div className="min-w-[150px] text-gray-600 font-medium">
                    {formatKey(key)}:
                  </div>
                  <div className="flex-1">
                    {typeof val === 'object' ? (
                      renderValue(val, depth + 1, `${currentPath}.${key}`)
                    ) : (
                      <span className="text-gray-900">{formatValue(val)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return <span className="text-gray-900">{formatValue(value)}</span>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4 overflow-auto max-h-[600px]">
        {renderValue(resource)}
      </div>
    </div>
  );
};

export default FhirResourceViewer;