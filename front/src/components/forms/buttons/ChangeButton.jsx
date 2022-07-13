

const ChangeButton = ({ handleChange, children }) => {
    return ( 
        <button className='text-gray-200 flex items-center justify-center font-bold text-sm p-4 rounded-full b-none m-2 bg-gray-800 bg-opacity-50' onClick={() => handleChange()}>
         {children}
        </button>
     );
}
 
export default ChangeButton;