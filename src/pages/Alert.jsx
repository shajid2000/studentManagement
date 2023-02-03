import React from 'react'
import './new/common.css'

function Alert({id,handleDelete,setShow}) {
  return (
    <div className='alertcon'>
        <h1>Are you sure</h1>
        <div className="alertbut">
            <button onClick={()=>{handleDelete(id)}}>Yes</button>
            <button onClick={()=>{setShow(false)}}>No</button>
        </div>

    </div>
  )
}

export default Alert