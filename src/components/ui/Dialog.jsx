import { useEffect, useState } from "react";
import { ClassN } from "../../utility/utils";

const Dialog = ({ Component, CustomStyle, isOpen }) =>{
    useEffect(() => { 
      if(isOpen){
        document.getElementById("DialogModal").showModal();
      }
     }, [isOpen]);
  
    return (
      <>
        <dialog id="DialogModal" className="modal modal-bottom sm:modal-middle">
          <div className={ClassN("modal-box", CustomStyle)}>
            {Component}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </>
    );
};

export default Dialog ;
