import React from "react";
import "./Modal.css";

export function Modal(
  Component,
  onClick = () => {
    return null;
  },
  classNameBackground = "modalBackground",
  className = "modal"
) {
  return (
    <div className={className}>
      {Component}
      <div onClick={onClick} className={classNameBackground}></div>
    </div>
  );
}
