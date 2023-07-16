import './styles/Section.css';
import React, {  useEffect } from 'react';
import LCS from '../utility/lcs';
import Caret from '../utility/caret';

const Section = () =>{


    var  actualText= "";
    let lcs = new LCS();
    let caret = new Caret();

    useEffect(() => {
        let textArea = document.getElementById("contentId");
        textArea.addEventListener('input', handleChange);
        textArea.addEventListener("paste",handlePaste);
        actualText = textArea.innerText;
      }, []);

  




function handlePaste(event) {
    console.log("handle paste called ....");



    event.preventDefault();

    let editableDiv = event.currentTarget;
    let paste = (event.clipboardData || window.clipboardData).getData("text");
    const selection = window.getSelection();
    console.log(selection);
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();

    let spanElement = document.createElement("span");
    spanElement.appendChild(document.createTextNode(paste));
    selection.getRangeAt(0).insertNode(spanElement);
    selection.collapseToEnd();


    let caretPosition = caret.getCaretPositionDuringPaste(editableDiv, spanElement);
    console.log(caretPosition);
    highlightText(editableDiv);
    caret.setCaret(editableDiv, caretPosition);
  
    
}

    const getCurrentText = (editableDiv) => {
        let text = "";
        let children = editableDiv.children;
        for (let i=0; i<children.length; i++){
            let child = children[i];
            text += child.innerText;
        }
        console.log(text);
        return text;
    }

    const isEditableDivEmpty = (editableDiv) => {
        return false;
    }

    const highlightText = (editableDiv) => {
        let currentText = getCurrentText(editableDiv);
        console.log("current text ...", currentText);
        let mat = lcs.findLCS(actualText, currentText);
        let commonText = lcs.findCommonText(actualText, currentText, mat);
        lcs.highlightText(document.getElementById("contentId"), commonText,  currentText);
    }

    const handleChange = (event) =>{
        console.log("handle change called ...");

        if (event.inputType == "insertFromPaste"){
            return;
        }
        let targetId = event.target.id;
        let editableDiv = document.getElementById(targetId);

        if(isEditableDivEmpty()){
            return;
        }

        let caretPosition = caret.getCaretPosition(editableDiv);
        console.log(caretPosition);
        highlightText(editableDiv);
        caret.setCaret(editableDiv, caretPosition);

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