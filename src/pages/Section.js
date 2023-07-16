import './styles/Section.css';
import React, {  useEffect } from 'react';
import LCS from '../utility/lcs';

const Section = () =>{


    var  actualText= "";
    let lcs = new LCS();

    useEffect(() => {
        let textArea = document.getElementById("contentId");
        textArea.addEventListener('input', handleChange);
        textArea.addEventListener("paste",function(event){
           console.log(event);
            setTimeout( handlePaste);
        }, true);
        actualText = textArea.innerText;
      }, []);

      function getCaretPosition(editableDiv) {
        var caretPos = 0,
          sel, range;
        
        let children = document.getElementById("contentId").children;
        console.log(children);

        let cursorIndex = 0;
        if (window.getSelection) {
          sel = window.getSelection();
          if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            console.log(range);
            let edit = (range.commonAncestorContainer.parentNode);
            console.log(edit);
            for(let i= 0; i<children.length; i++){
                
                if(children[i] == edit){
                    console.log(edit, range.endOffset);
                    cursorIndex += range.endOffset + 1;
                    break;
                }
                cursorIndex += children[i].innerText.length;
            }
            
          }
        } 
        return cursorIndex;
      }


      function setCaret(pos) {
        var el = document.getElementById("contentId");
        var range = document.createRange();
        var sel = window.getSelection();

        let children = el.children;
        let index = 0;
        let element= null;
        for(let i= 0; i<children.length; i++){
            let len = children[i].innerText.length;
            if (index + len >= pos){
                element = children[i];
                break;
            }
            index += len;
        }

        if (element == null){
            element= children[children.length - 1];
            range.setStart(element,1);
        }
        else{
        console.log(element, index, pos);
            if(index == pos){
                range.setStart(element.childNodes[0],1);
                
            }
            else{
                range.setStart(element.childNodes[0],pos-1-index);
            }
        }
         
        
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
   
     
        console.log("focus called");
    }



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
        pasteCursorIndex = 1;
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
        setCaret(pasteCursorIndex);
    }
    else{
        console.log(pasteCursorIndex, "secodn time");
        setCaret(pasteCursorIndex);
    }
    
}




    const handleChange = (event) =>{
        console.log("handle change called ...");
        console.log(event);
        if (event.inputType == "insertFromPaste"){
            return;
        }
        let targetId = event.target.id;
        console.log(targetId);
        console.log("children length",document.getElementById("contentId").children.length )
        if(document.getElementById("contentId").children.length == 1){
            console.log(document.getElementById("contentId").children[0].nodeName);
            if(document.getElementById("contentId").children[0].nodeName ==  "BR"){
                document.getElementById("contentId").innerHTML = "";
                return;
            }
        }
        let caretPosition = getCaretPosition(document.getElementById(targetId));
        console.log(caretPosition);

        let currentText = document.getElementById(targetId).innerText;
        console.log("before", currentText);
        currentText = currentText.replaceAll("<mark>", "");
        currentText = currentText.replaceAll("</mark>", "");
        console.log(currentText);

        console.log(actualText, currentText);
        let mat = lcs.findLCS(actualText, currentText);
        let commonText = lcs.findCommonText(actualText, currentText, mat);
        lcs.highlightText(document.getElementById("contentId"), commonText,  currentText);

        setCaret(caretPosition);

    }


    return (
        <div className='container'>
            <div className='section'>
                <div className='details'>

                </div>
                <div className='document'>
                    <div className='page'>
                        <div contentEditable='true' id="contentId"  onmousemove="getCursorPosition(event)">
                           <span>Hello</span><span>world</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Section;