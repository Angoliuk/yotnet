import React from "react";
import "./Button.css";

export const Button = ({
  name = "button",
  text = "button",
  onClick = () => {
    return null;
  },
  className = "button",
  classNameBlock = "",
}) => {
  return (
    <div className={classNameBlock}>
      <button name={name} id={name} onClick={onClick} className={className}>
        {text}
      </button>
    </div>
  );
};
