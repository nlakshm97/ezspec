import './styles/Section.css';
import React, {  useEffect } from 'react';

import TextDiff from '../utility/textdiff';

const Section = () =>{
    let textDiff = new TextDiff();
    useEffect(() => {
        
        let textArea = document.getElementById("contentId");
        textArea.addEventListener('input',handleChange);
        textArea.addEventListener("paste",handlePaste);
        textDiff.setActualText(textArea.innerText);
      }, []);

  
      const handleChange = (event)=> {
        textDiff.handleChange(event);
      }

      const handlePaste = (event) => {
        textDiff.handlePaste(event);
      }




    return (
        <div className='container'>
            <div className='section'>
                <div className='details'>

                </div>
                <div className='document'>
                    <div className='page'>
                        <div contentEditable='true' id="contentId">
                           <span>Hello</span><span>world</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Section;