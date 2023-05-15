import React, { useState } from "react";
import "styles/ui/Button.scss";

const colors = ["#CF141E", "#71AD58", "#F1DD5D", "#35599B"];

export const Button = (props) => {
  const [hoverColor, setHoverColor] = useState(null);

  const handleHover = () => {
    const randomColor = generateRandomColor();
    setHoverColor(randomColor);
  };

  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
      <button
          {...props}
          style={{
            width: props.width,
            ...props.style,
            backgroundColor: hoverColor,
          }}
          className={`primary-button ${props.className}`}
          onMouseEnter={handleHover}
          onMouseLeave={() => setHoverColor(null)}
      >
        {props.children}
      </button>
  );
};
