import CreateRoomForm from "./Createroom";
import JoinRoomForm from "./Joinroom";
import "./index.css"
const Forms =({uuid,socket,setuser})=>{
    return(
        <>
        <div className="mt-3">
            <h1 className="font-extrabold leading-tight  text-center" style={{
                fontSize:"4rem",
                fontFamily:"Copperplate Gothic Light",
            
            }}>
                SketchFuse Hub  
            </h1>
            <h3 className="text-center" style={{fontFamily:"Montserrat"}}>Real-Time WhiteBoard</h3>
        </div>
        <div className="row">

         <div className="form-box py-3 px-5 col-md-4 mt-5 border border-2  mx-auto d-flex flex-column align-items-center">
                <h1>Create Room</h1>
                <CreateRoomForm uuid={uuid} socket={socket} setuser={setuser}/>
            </div>
            <div className="form-box py-3 px-5 col-md-4 mt-5 border border-2 mx-auto d-flex flex-column align-items-center">
            <h1>Join Room</h1>
                <JoinRoomForm uuid={uuid} socket={socket} setuser={setuser}/>
            </div> 
        </div>
        </>
    );
}
export default Forms;