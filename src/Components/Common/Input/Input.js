import React from "react";
import "./Input.css";

export function Input({
  name = "input",
  value = "",
  onChange = () => {
    return null;
  },
  htmlForText = "",
  type = "text",
  className = "input",
  placeholder = "",
}) {
  return (
    <div>
      <label htmlFor={name}>{htmlForText}</label>
      <input
        className={className}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
