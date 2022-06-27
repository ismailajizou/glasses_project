import { forwardRef } from "react";

const Canvas = forwardRef(({  }, ref) => {
    return ( 
        <canvas ref={ref} className='absolute z-10 left-0 right-0 my-0 mx-auto'></canvas>
     );
})
 
export default Canvas;