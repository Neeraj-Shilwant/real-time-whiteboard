import { useState } from 'react'

import './App.css';
import Forms from './compnonents/Forms';
import {Route, Routes} from "react-router-dom";
import Roompage from './pages/Roompage';
import io from "socket.io-client";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const server = "http://localhost:5000";
const connectionoptions = {
  "force new connection" : true,
  reconnectionAttempts:"Infinity",
  timeout:10000,
  transports:["websocket"]
};

const socket = io(server,connectionoptions);

const App=()=> {
  const [user, setuser] = useState(null);
  const [users,setusers] = useState([]);
  useEffect(() => {
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        setusers(data.users);
        console.log("User Joined ");
      }else{
        console.log("Something Went wrong");
      }
    });
    socket.on("allUsers",(data)=>{
      setusers(data);
    });

    socket.on("userJoinedMessage",(data)=>{
      toast.info(`${data} joined the room.`);
    });

    socket.on("userLeftMessage",(data)=>{
      console.log(`${data} left the room`);
      toast.info(`${data} left the room`);
    });

  }, [])
  

  const uuid=()=>{
    let s4 =()=>{
      return (((1+Math.random())*0x10000) | 0).toString(16).substring(1);
    };

    return(
      s4() + s4() +"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()
    );
  }
  return (
    <>
      <div className="container">
        <ToastContainer />
        <Routes>
        <Route path='/' element={<Forms uuid={uuid} socket ={socket} setuser ={setuser}/>}/>
        <Route path='/:roomId' element={<Roompage user={user} socket ={socket} users={users}/>}/>
        </Routes>
      </div>

    </>
  )
}

export default App
