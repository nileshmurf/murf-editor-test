import React from "react";

const Editable = ({
  html,
  handleChange,
  onFocus,
  onKeyDown,
  onMouseUp,
  index,
  onBlur,
  onMouseDown,
  onContextMenu,
}) => {
  return (
    <div
      className="editable"
      placeholder="Enter your text here"
      contentEditable="true"
      style={{ width: "100%" }}
      dangerouslySetInnerHTML={{ __html: html }}
      onInput={(e) => handleChange(e.target.textContent, index)}
      onKeyDown={onKeyDown}
      onFocus={(e) => onFocus(e, index)}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      onContextMenu={onContextMenu}
    ></div>
  );
};

export default Editable;
