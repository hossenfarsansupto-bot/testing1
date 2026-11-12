import React from 'react';
import { MenuNode } from '../types';

interface MenuInspectProps {
  node: MenuNode;
  visitedOptionIds: string[];
  onSelectOption: (optionId: string) => void;
}

export const MenuInspect: React.FC<MenuInspectProps> = ({
  node,
  visitedOptionIds,
  onSelectOption
}) => {
  return (
    <div className="menu-inspect-container" role="region" aria-label="Inspection Menu">
      <h2 className="menu-prompt">{node.prompt}</h2>
      <p className="menu-instructions">
        (Inspect each item below. When all items have been examined, our journey will continue.)
      </p>
      <div className="menu-options-grid">
        {node.options.map((option, idx) => {
          const isVisited = visitedOptionIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`menu-option-button ${isVisited ? 'visited' : 'unvisited'}`}
              onClick={() => onSelectOption(option.id)}
            >
              <span className="option-status">
                {isVisited ? '✓' : idx + 1}
              </span>
              <span className="option-label">{option.label}</span>
              {isVisited && <span className="visited-badge">Examined</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
