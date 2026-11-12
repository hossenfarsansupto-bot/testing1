import React from 'react';
import { ChoiceNode } from '../types';

interface ChoiceListProps {
  node: ChoiceNode;
  onSelectOption: (index: number) => void;
}

export const ChoiceList: React.FC<ChoiceListProps> = ({
  node,
  onSelectOption
}) => {
  return (
    <div className="choice-container" role="region" aria-label="Choice selection">
      {node.prompt && <h2 className="choice-prompt">{node.prompt}</h2>}
      <div className="choice-options" role="group">
        {node.options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className="choice-button"
            onClick={() => onSelectOption(idx)}
            aria-label={`Option ${idx + 1}: ${option.label}`}
          >
            <span className="choice-number">{idx + 1}</span>
            <span className="choice-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
