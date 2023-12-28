import {useState} from 'react';
import { useNavigate } from "react-router-dom";



const JoinRoomForm=({uuid,socket,setuser})=>{

    const [roomId, setroomId] = useState("");
    const [Name, setName] = useState("");
    const navigate = useNavigate();
    const handleJoinroom =(e)=>{
        e.preventDefault();
        //{name,roomId,userId,hostId,host,presenter}
        const roomData = {
            Name,roomId,userId:uuid(),host:false,presenter:false
        }
        setuser(roomData);
        navigate(`/${roomId}`);
        
        socket.emit("userJoined",roomData);
    }

    return(
        <form className="form wd-100 col-md-12">
            <div className="form-group">
                <input type="text" className="form-control my-2" value={Name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Your Name"/>

            </div>
            <div className="form-group ">
                <div className="input-group">
                    <input type="text" className="form-control d-flex align-items-center justify-content-center" value = {roomId} onChange={(e)=>{setroomId(e.target.value)}} placeholder="Paste Room Code" />
                    
                </div>
            
            
            </div>
            <div className="form-group mt-5 ">
                <button type="submit" onClick={handleJoinroom}>Join room</button>
            </div>
        </form>
    );
}
export default JoinRoomForm;