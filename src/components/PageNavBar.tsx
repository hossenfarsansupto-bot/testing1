import React from 'react';

interface PageNavBarProps {
  onBack?: () => void;
  onNext?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
  backTitle?: string;
  nextTitle?: string;
  className?: string;
}

export const PageNavBar: React.FC<PageNavBarProps> = ({
  onBack,
  onNext,
  backDisabled = false,
  nextDisabled = false,
  backLabel = '◀ Back',
  nextLabel = 'Next ▶',
  backTitle = 'Go back',
  nextTitle = 'Go next',
  className = ''
}) => (
  <div
    className={`page-nav-bar ${className}`.trim()}
    role="navigation"
    aria-label="Page navigation"
  >
    <button
      type="button"
      className="page-nav-btn back"
      disabled={backDisabled || !onBack}
      onClick={(e) => {
        e.stopPropagation();
        onBack?.();
      }}
      title={backTitle}
    >
      {backLabel}
    </button>
    <button
      type="button"
      className="page-nav-btn next"
      disabled={nextDisabled || !onNext}
      onClick={(e) => {
        e.stopPropagation();
        onNext?.();
      }}
      title={nextTitle}
    >
      {nextLabel}
    </button>
  </div>
);
