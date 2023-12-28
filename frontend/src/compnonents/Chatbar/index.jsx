import { useEffect,useState } from "react";


const Chatpage = ({setOpenchatTab,socket}) => {
    const [message, setmessage] = useState("");
    const [Chat, setChat] = useState([]); 

    useEffect(() => {
      socket.on("messageResponse",(data)=>{
        setChat([...Chat,data]);
        
      });

    }, []);

    const handlesubmit=(e)=>{
        e.preventDefault();
        if(message.trim()!=""){
            socket.emit("message",message);
            setChat([...Chat,{message,name:"You"}]);
            
            
        }
    };
  return (
    <div className="position-fixed top-0  h-100 text-white bg-dark " style={{
        width:"400px",
        left:"0%"
        
    }}> 
        <button type='button' onClick={()=>setOpenchatTab(false)} className='btn btn-light btn-block w-100 mt-5'> Close Chats </button>
        <div className="mt-5 w-100 p-2  border border-2 border-white rounded-3" style={{
            height:"70%"
        }}>
            {Chat.map((msg,index)=>(
                <p key={index*999} className="my-2 text-center w-100 border border-left-0 border-right-0">
                    {msg.name} : {msg.message}
                </p>
            ))}
        </div>

        <form onSubmit={handlesubmit} className="mt-2  w-100  px-3 d-flex  border border-2 border-white rounded-3">
            <input type="text" placeholder="Enter Message" value={message} onChange={(e)=>setmessage(e.target.value)} className="h-100 w-100 " style={{
                backgroundColor:"transparent",
                color: "white",
                
            }} />
            <button type="submit" className="btn btn-primary rounded-0" >Send</button>
        </form>
    </div>
  )
}

export default Chatpage;