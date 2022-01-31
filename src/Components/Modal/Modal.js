import React from "react";
import './Modal.css'

export function Modal(Component, onClick=()=>{return null}, classNameBackground="modalBackground") {
        return(
            <div className="modal">
                {Component}
                <div onClick={onClick} className={classNameBackground}></div>
            </div>
        )
    }