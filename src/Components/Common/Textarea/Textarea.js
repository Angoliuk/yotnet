import React from "react";
import "./Textarea.css";

export function Textarea({
  name = "textarea",
  value = "",
  onChange = () => {
    return null;
  },
  rows = null,
  cols = null,
  className = "textarea",
  placeholder = "",
}) {
  return (
    <textarea
      className={className}
      placeholder={placeholder}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      rows={rows}
      cols={cols}
    />
  );
}
