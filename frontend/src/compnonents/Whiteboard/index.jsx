import rough from "roughjs";
import { useEffect ,useState,useLayoutEffect} from "react";




const roughgenerator = rough.generator();

const Whiteboard=({socket,user,canvasRef,ctxRef,elements,setelements,tool,color})=>{
    const [drawing, setDrawing] = useState(false);
    const [img, setImg] = useState(null);
    useEffect(() => {
        socket.on("whiteboardDataResponse",(data)=>{
          setImg(data.imgUrl);
        });
        
      }, [])

    if(!user?.presenter){
        return(
            <div  className="border border-dark border-3 h-100 overflow-hidden">
                <img src={img} alt="real time image shared" style={{
                    height:window.innerHeight*2,
                    width:"285%"
                }} />
            </div>
        );
    }
    
    
    useEffect(() => {
      const canvas =canvasRef.current;
      canvas.height=window.innerHeight*2;
      canvas.width = window.innerWidth*2;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
      }
      
    }, []);

    useEffect(() => {
      ctxRef.current.strokeStyle = color;

    }, [color])
    
    //refresh then 
    
    
    
    useLayoutEffect(() => {
        if(canvasRef){
      const roughCanvas = rough.canvas(canvasRef.current);
        if(elements.length>0){
            ctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        }
      
        elements.forEach(element => {
            if(element.type=="rect"){
                roughCanvas.draw(roughgenerator.rectangle(element.offsetX,element.offsetY,element.width,element.height,{
                    stroke:element.stroke,strokeWidth:5,roughness:0
                }));
            }
            else if(element.type=="pencil"){
            roughCanvas.linearPath(element.path,{
                stroke:element.stroke,strokeWidth:5,roughness:0
            });
            }
            else if(element.type=="line"){
                roughCanvas.draw(
                roughgenerator.line(element.offsetX,element.offsetY,element.width,element.height,{
                    stroke:element.stroke,strokeWidth:5,roughness:0
                }));
            }
        });
        // image sharing to other users 
        //image is created here whenever the elements are changed and send to backend and with socket.io the image is send to the url
        const canvasimage = canvasRef.current.toDataURL();
        socket.emit("Whiteboard",canvasimage);

    }
    }, [elements])

    const handlemousedown = (e)=>{
        const {offsetX,offsetY} = e.nativeEvent;

        if(tool=="pencil"){
            setelements((prevelement)=>[
                ...prevelement,{
                    type:"pencil",
                    offsetX,
                    offsetY,
                    path:[[offsetX,offsetY]],
                    stroke:color,
                }
            ])
        }
        else if(tool=="line"){
            setelements((prevelement)=>[
                ...prevelement,{
                    type:"line",
                    offsetX,offsetY,
                    width:offsetX,
                    height:offsetY,
                    stroke:color,

                }
            ])
        }
        else if(tool=="rect"){
            setelements((prevelement)=>[
                ...prevelement,{
                    type:'rect',
                    offsetX,offsetY,
                    width:0 ,
                    height:0 ,
                    stroke:color
                }
            ])
        }
       

        setDrawing(true);
    } 
    const handlemousemove = (e)=>{
        const {offsetX,offsetY} = e.nativeEvent;
        if(drawing){

            if(tool=="pencil"){
            const {path} = elements[elements.length-1];    //line one element and last element
            const newpath = [...path,[offsetX,offsetY]];
            
                setelements((prevelement)=>
                prevelement.map((ele,index)=>{
                    if(index==elements.length-1){
                        return{
                            ...ele,
                            path:newpath
                        }
                    }else{
                        return ele;
                    }
                })
                );

            }
            else if(tool=="line"){
                setelements((prevelement)=>
                prevelement.map((ele,index)=>{
                    if(index==elements.length-1){
                        return{
                            ...ele,
                            width:offsetX,
                            height:offsetY
                        }
                    }else{
                        return ele;
                    }
                })
                );
            }

            else if(tool=='rect'){
                setelements((prevelement)=>
                prevelement.map((ele,index)=>{
                    if(index==elements.length-1){
                        return{
                            ...ele,
                            width:offsetX - ele.offsetX,
                            height:offsetY - ele.offsetY
                        }
                    }else{
                        return ele;
                    }
                })
                );
            }
            
        }
    }
    const handlemouseup= (e)=>{
        setDrawing(false);
        const {offsetX,offsetY} = e.nativeEvent;
        
    }

    
    return(
        <>
        <div  
        onMouseDown={handlemousedown}
        onMouseMove={handlemousemove}
        onMouseUp={handlemouseup}
        className="border border-dark border-3 h-100 overflow-hidden">
            <canvas 
            ref={canvasRef}
            />
        </div>
     
     
     </>);
}
export default Whiteboard;