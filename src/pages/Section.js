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
        textArea.addEventListener("paste",function(event){
           console.log(event);
            setTimeout( handlePaste);
        }, true);
        actualText = textArea.innerText;
      }, []);

  



var pasteCursorIndex = 0;
function handlePaste(e) {
  
    let element = document.getElementById("contentId");
    let children = element.childNodes;
    let spanElement = document.createElement("span");
    let text = "";
    let others = [];
    
    for(let i=0;i<children.length;i++){
        console.log(children[i].nodeName);
        if (children[i].nodeName == "#text"){
            others.push("#text");
            text += (children[i].nodeValue);
        }
        else{
            others.push(children[i]);
        }

    }
    if(text.length > 0){
        pasteCursorIndex = 0;
    }

    spanElement.innerHTML = text;
    element.innerHTML = "";
    console.log(children);
    let isSpanInserted = false;
    for(let i=0;i<others.length;i++){
        if (others[i] != "#text"){
            element.appendChild(others[i]);
            if(!isSpanInserted){
                if(text.length > 0){
                    pasteCursorIndex  += others[i].innerText.length;
                }
            }
        }
        else{
            if(!isSpanInserted){
                isSpanInserted= true;
                element.appendChild(spanElement);
            }
        }
    }
    
    if(text.length > 0){
        pasteCursorIndex  += text.length;
        console.log(pasteCursorIndex);
        let currentText = document.getElementById("contentId").innerText;
        console.log("before", currentText);
        currentText = currentText.replaceAll("<mark>", "");
        currentText = currentText.replaceAll("</mark>", "");
        console.log(currentText);

        console.log(actualText, currentText);
        let mat = lcs.findLCS(actualText, currentText);
        let commonText = lcs.findCommonText(actualText, currentText, mat);
        lcs.highlightText(document.getElementById("contentId"), commonText,  currentText);
        caret.setCaret(element, pasteCursorIndex);
    }
    else{
        console.log(pasteCursorIndex, "secodn time");
        caret.setCaret(element, pasteCursorIndex);
    }
    
}

    const getCurrentText = (editableDiv) => {
        let text = "";
        let children = editableDiv.children;
        for (let i=0; i<children.length; i++){
            let child = children[i];
            text += child.innerText;
        }
        return text;
    }
    const isEditableDivEmpty = (editableDiv) => {
        return false;
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

        let currentText = getCurrentText(editableDiv);
        console.log("current text ...", currentText);
        let mat = lcs.findLCS(actualText, currentText);
        let commonText = lcs.findCommonText(actualText, currentText, mat);
        lcs.highlightText(document.getElementById("contentId"), commonText,  currentText);

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