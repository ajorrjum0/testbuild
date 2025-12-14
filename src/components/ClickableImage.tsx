import React, { useState, KeyboardEvent } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  scale?: number; // scale factor when active, default 1.2
};

export default function ClickableImage({ scale = 1.2, style, onClick, onKeyDown, ...rest }: Props) {
  const [active, setActive] = useState(false);

  const toggle = () => setActive((v) => !v);

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
    if (onKeyDown) onKeyDown(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    toggle();
    if (onClick) onClick(e);
  };

  const mergedStyle = {
    transform: active ? `scale(${scale})` : undefined,
    transition: "transform 220ms ease",
    willChange: "transform",
    zIndex: active ? 9999 : undefined,
    position: "relative",
    ...style,
  } as React.CSSProperties;

  return (
    // use img directly to avoid introducing default button outlines or extra styles
    <img
      {...rest}
      style={mergedStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={active}
    />
  );
}
