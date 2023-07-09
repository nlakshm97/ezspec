import './styles/Section.css';
import React, {  useEffect } from 'react';

const Section = () =>{


    var  actual= "";
    let diff = [];
    useEffect(() => {
        let textArea = document.getElementById("contentId");
        textArea.addEventListener('input', handleChange);
        actual = textArea.innerText;
      }, []);

    const highlightTextArea = () => {
        console.log("highlight text area ...");

    }

    const handleChange = (event) =>{
        console.log("handle change called ...");


        let current = event.target.innerText;
        let n = Math.min(actual.length, current.length);

        let isDiffDetected = false;

        for (let i= 0; i< n; i++){
            if(actual[i] != current[i]){
                diff.push([i, event.inputType, event.data]);
                isDiffDetected = true;
                break
            }
        }

        if(! isDiffDetected){
           diff.push([current.length - 1, "insertText", current[current.length-1]]); 
        }
        actual = current;
        console.log(diff);
    }


    return (
        <div className='container'>
            <div className='section'>
                <div className='details'>

                </div>
                <div className='document'>
                    <div className='page'>
                        <div contentEditable='true' id="contentId" oninput="handleChange(event)">
                            Hello world
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Section;