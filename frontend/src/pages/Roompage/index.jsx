import React, { useState,useRef,useEffect } from 'react'
import "./index.css"
import Whiteboard from '../../compnonents/Whiteboard';
import { toast } from 'react-toastify';
import Chatpage from '../../compnonents/Chatbar';

const Roompage = ({user,socket,users}) => {
    const [tool, setTool] = useState("pencil");
    const [Color, setColor] = useState("black");
    const [elements, setelements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openuserTab, setOpenuserTab] = useState(false);
    const [openchatTab, setOpenchatTab] = useState(false);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

   
    
    
    const handleClearCanvas = ()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect ="white";
        ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        setelements([]);

    }

    const undo=()=>{
        setHistory((prevhistory)=>[
            ...prevhistory,
            elements[elements.length-1]
        ]);
        setelements((prevelements)=>prevelements.slice(0,prevelements.length-1));
    };
    const redo=()=>{
        setelements((prevelements)=>[
            ...prevelements,
            history[history.length-1]
        ]);
        setHistory((prevhistory)=>prevhistory.slice(0,prevhistory.length-1));
    };
   
    
  return (
    <div className="row">

        <button type='button' onClick={()=>setOpenuserTab(true)} className='btn btn-dark' style={{
            display:'block',
            position:'absolute',
            top:"5%",
            left:"5%",
            height:"40px",
            width:"100px"
        }}>U S E R S</button>

<button type='button' onClick={()=>setOpenchatTab(true)} className='btn btn-primary' style={{
            display:'block',
            position:'absolute',
            top:"5%",
            left:"15%",
            height:"40px",
            width:"100px"
        }}>C H A T S</button>

        {openuserTab && (
            <div className="position-fixed top-0  h-100 text-white bg-dark " style={{
                width:"250px",
                left:"0%"
                
            }}> 
                <button type='button' onClick={()=>setOpenuserTab(false)} className='btn btn-light btn-block w-100 mt-5'> Close </button>
                <div className="mt-5 w-100 pt-5">
                    {users.map((usr,index)=>(
                        <p key={index*999} className='my-2 w-100 text-center'>
                            {usr.Name} {user &&  user.userId ==usr.userId && "(you)" }
                        </p>
                    ))}
                </div>
            </div>
        )}

        {openchatTab && (
            <Chatpage setOpenchatTab = {setOpenchatTab} socket={socket} />
        )}
         <h1 className='text-center py-2'>White Board Sharing App  
         <span className='text-primary'>[Users Online : {users.length}]</span>
         </h1>
         {user?.presenter && 
         <div className="col-md-10 mt-2 mb-2   d-flex align-items-center justify-content-around">
         <div className="d-flex col-md-2  justify-content-between">
          <div className="d-flex gap-1">
              <label htmlFor="pencil">Pencil</label>
          
          <input type='radio' name ='tool' id='pencil' value="pencil" checked={tool == 'pencil'} onChange={(e)=>{setTool(e.target.value)}}/>
          </div>

          <div className="d-flex gap-1">
              <label htmlFor="pencil">Line</label>
          
          <input type='radio' name ='tool' id='line' value="line" checked={tool == 'line'}  onChange={(e)=>{setTool(e.target.value)}}/>
          </div>

          <div className="d-flex gap-1">
              <label htmlFor="pencil">Rect</label>
          
          <input type='radio' name ='tool' id='rect' value="rect" checked={tool == 'rect'}  onChange={(e)=>{setTool(e.target.value)}}/>
          </div>
         </div>

         <div className="col-md-2 ">
          <div className="d-flex flex-cloumn align-items-center">
              <label htmlFor='color' >Select Color</label>
              <input type="color" id ='color' className='mt-1 ml-3' onChange={(e)=>{setColor(e.target.value)}} />
          </div>
          </div>

          <div className="col-md-2  d-flex gap-2">
              <button className='btn btn-primary mt-1'
              disabled = {elements.length==0}
              onClick={undo}
              >Undo</button>
              <button className='btn btn-outline-primary mt-1'
              disabled = {history.length<=0}

              onClick={redo}
              >Redo</button>
          </div>

          <div className="col-md-2 ">
              <button className='btn btn-danger Clear react' onClick={handleClearCanvas}>Clear Canvas</button>
          </div>
        </div>
         }
        

        <div className="col-md-10 mx-auto mt-4 canvas-box">
            <Whiteboard socket ={socket} user={user} canvasRef={canvasRef} ctxRef = {ctxRef} elements={elements} setelements={setelements} tool={tool} color={Color}/>
        </div>
        
    </div>
  )
}

export default Roompage