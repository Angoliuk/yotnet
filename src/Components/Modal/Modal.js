import React from "react";
import './Modal.css'

export function Modal(Component) {
        return(
            <div className="modal">
                {Component}
                <div className="modalBackground"></div>
            </div>
        )
    }