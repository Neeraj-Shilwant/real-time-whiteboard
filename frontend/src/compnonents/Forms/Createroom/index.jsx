import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const CreateRoomForm=({uuid,socket,setuser})=>{

    const [roomId, setroomId] = useState(uuid());
    const [Name, setName] = useState("");
    
    const [copied, setCopied] = useState(false);
    

    const navigate = useNavigate();

    const handleCreateRoom =(e)=>{
        e.preventDefault();
        //{name,roomId,userId,hostId,host,presenter}
        const roomData = {
            Name,roomId,userId:uuid(),host:true,presenter:true
        }
        setuser(roomData);
        navigate(`/${roomId}`);
        
        socket.emit("userJoined",roomData);
    };
    
    const handlecopy = ()=>{
        toast.success("Room Id Copied Successfully");
    };
    return(
        <form className="form wd-100 col-md-12"> 
            <div className="form-group">
                <input type="text" className="form-control my-2" value={Name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Your Name"/>

            </div>
            <div className="form-group ">
                <div className="input-group">
                    <input type="text" id="roomidinput" disabled className="form-control d-flex align-items-center justify-content-center" value={roomId} placeholder="Generate Room Code" />
                    <div className="input-group-append ">
                        <button className="btn btn-primary btn-sm me-1" type="button" onClick={()=>setroomId(uuid())}>Generate </button>
                        <CopyToClipboard text={roomId} onCopy={()=>setCopied(true)}>
                            <button className="btn btn-outline-danger btn-sm me-1" onClickCapture={handlecopy}   type="button">Copy</button>
                        </CopyToClipboard>
                    </div>
                </div>
            
            
            </div>
            <div className="form-group mt-5 ">
                <button type="submit" onClick={handleCreateRoom}>Create room</button>
            </div>
        </form>

    );
}
export default CreateRoomForm;