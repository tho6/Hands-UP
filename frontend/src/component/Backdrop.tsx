import React from 'react'
import './Backdrop.scss'
export const Backdrop:React.FC<{closeSideNav:()=>void}> = (props)=> {
    return (
        <div className='backdrop' onClick={()=>props.closeSideNav()}>
             
        </div>
    )
}
