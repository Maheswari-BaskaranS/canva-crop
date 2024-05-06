import { useRef, useEffect } from "react";

export function Canvas (props){
    const canvasRef = useRef(null);
    useEffect(()=>{
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'red';
        context.fillRect(0,0,props.width,props.height);

        const clickHandler = ()=>{
            context.fillStyle='blue';
            context.fillRect(0,0,props.width,props.height);
        }

        canvas.addEventListener("click",clickHandler)

        return()=>{
            canvas.removeEventListener("click",clickHandler);
        }
    },[]);
  return <canvas ref ={canvasRef} width={props.width} height={props.height}/>  
}


