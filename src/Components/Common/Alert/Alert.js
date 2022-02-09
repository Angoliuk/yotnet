import React from "react";
import './Alert.css'

export const Alert = ({type='success', text='Все готово', onClick=()=>{return null}}) => {
    return(
        <div onClick={onClick ? () => {onClick()} : null} className='alertBlock'>

            <div className="background"></div>
            
            <div className={`alert ${type}`}>
                <span className="closeAlert">&times;</span>
                {text}
            </div>

        </div>
    )
}