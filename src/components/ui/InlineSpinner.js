import React from 'react';
import 'styles/ui/InlineSpinner.scss';

const InlineSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </div>
  );
};

export default InlineSpinner;
