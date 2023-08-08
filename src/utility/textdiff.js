import LCS from '../utility/lcs';
import Caret from '../utility/caret';
import { child } from 'firebase/database';
export default class TextDiff{

    constructor(){
        this.lcs = new LCS();
        this.caret = new Caret();
    }
 

    setActualText(actualText){
        this.actualText = actualText;
    }

    getActualText(){
        return this.actualText;
    }

    handlePaste(event, equipmentId) {
        console.log("handle paste called ....", equipmentId);



        event.preventDefault();
        console.log(event.target.parentElement);
        let editableDiv = event.target.parentElement;
        let paste = (event.clipboardData || window.clipboardData).getData("text");
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        let originalText = (selection.getRangeAt(0).startContainer);
        
        let textNode = document.createTextNode(paste);
        selection.getRangeAt(0).insertNode(textNode);
        selection.collapseToEnd();

        let elementEdited = (selection.getRangeAt(0).startContainer);
        console.log("element being edited ..",paste,elementEdited, originalText);
        let children = (elementEdited.childNodes);
        let startOffset = 0;
        let endOffset = 0;
        for(let i=0;i<children.length;i ++){
            if(children[i] == textNode){
                break;
            }
            startOffset += children[i].length;
        }

        let caretPosition = this.caret.getCaretPositionDuringPaste(editableDiv, textNode);
        console.log(caretPosition);
  
   
        console.log(originalText.length);
        let isNewMarkElementAddedToFront = false;
        let isNewMarkElementAddedToBack = false;
        if(startOffset >= originalText.length ){
            isNewMarkElementAddedToBack = true;
        }
        if(startOffset == 0){
            isNewMarkElementAddedToFront = true;
        }
        endOffset = startOffset+ paste.length;
        console.log("offset during paste ", startOffset, endOffset, originalText);
       
        this.handleMarkInsideDifferentMark(elementEdited, editableDiv, startOffset, endOffset, equipmentId,isNewMarkElementAddedToBack,isNewMarkElementAddedToFront, originalText);

        this.highlightText(editableDiv, equipmentId);
        //this.caret.setCaret(editableDiv, caretPosition);
    
        
    }

    handleMarkInsideDifferentMark(elementEdited, editableDiv, startOffset, endOffset, equipmentId, isNewMarkElementAddedToBack,isNewMarkElementAddedToFront, originalText){
        if(elementEdited.nodeName == "MARK" && elementEdited.getAttribute("equipment") != equipmentId){
            console.log("resolving MARK inside different MARK");
            if(isNewMarkElementAddedToFront || isNewMarkElementAddedToBack){
                console.log("creatign a new mark element");
                let newMark = document.createElement("mark");
            
                newMark.setAttribute("id", "mark-"+Date.now());
                newMark.setAttribute("equipment", equipmentId);

                newMark.innerText = elementEdited.innerText.substring(startOffset, endOffset);
                console.log("text inside new mark", startOffset, endOffset, elementEdited.innerText,"substring" ,elementEdited.innerText.substring(startOffset, endOffset));
                if(isNewMarkElementAddedToBack){
                    console.log("inserting element after MARK");

                    editableDiv.insertBefore(newMark, elementEdited.nextSibling);
                    console.log(originalText);
                    elementEdited.innerText = elementEdited.innerText.substring(0, startOffset);
                    console.log(elementEdited);
                }
                else{
                    console.log("inserting element before MARK");
                   
                    editableDiv.insertBefore(newMark, elementEdited);
                    elementEdited.innerText = elementEdited.innerText.substring(endOffset, elementEdited.innerText.length);
                }
                
                
            }
            else{
                alert("you are editing the line that belongs to a different equipment template ...", equipmentId);
                console.log(elementEdited.innerText);
                
                elementEdited.innerText = originalText;
           
            }
        }
    }

    getCurrentText(editableDiv){
        
        let text = "";
        let children = editableDiv.children;
        let txtPos = {};
        let idx = 0;
        let arr = [];
        for (let i=0; i<children.length; i++){
            let child = children[i];
            let innerText = child.innerText;
            for(let j=0;j<innerText.length; j++){
                txtPos[idx] = [j,child];
                idx += 1;
            }
            text += innerText;
            
        }
        arr.push(text);
        arr.push(txtPos);
        return arr;
    

    }


    highlightText(editableDiv, equipmentId){

        let arr = this.getCurrentText(editableDiv);

        let currentText = arr[0];
        let currentTextParent = arr[1];

        let mat = this.lcs.findLCS(this.actualText, currentText);
        
        console.log("actualText", this.actualText);
        console.log("currentText", currentText);

        let commonText = this.lcs.findCommonText(this.actualText, currentText, mat);
        console.log("common", commonText);
        this.lcs.highlightText(editableDiv, commonText,  currentText, currentTextParent, equipmentId);
       
    }

    handleChange(event, equipmentId){
        console.log("handle change called ...");
     
        if (event.inputType == "insertFromPaste"){
            return;
        }
        let targetId = event.target.id;
        console.log(event);
        let editableDiv = document.getElementById(targetId);
        
         
        let arr = this.caret.getCaretPosition(editableDiv);
        
        let elementEdited = arr[0];
        let caretPosition = arr[1];
        let startOffset = arr[2] -1;
        let endOffset  = startOffset + 1;

        let isNewMarkElementAddedToBack = false;
        let isNewMarkElementAddedToFront = false;
        console.log("offset handle chjange ,.,.,", startOffset, endOffset, elementEdited.innerText.length);
        

        if(startOffset == 0){
            isNewMarkElementAddedToFront = true;
        }

        if(elementEdited.innerText.length -1 == startOffset){
            isNewMarkElementAddedToBack = true;
        }

        let before = elementEdited.innerText.substring(0, startOffset);
        let after = elementEdited.innerText.substring(endOffset, elementEdited.innerText.length);
        let originalText = before + after;
        console.log(originalText, "HERE --->");
        this.handleMarkInsideDifferentMark(elementEdited, editableDiv, startOffset,endOffset, equipmentId, isNewMarkElementAddedToBack,isNewMarkElementAddedToFront, originalText);
        
        
        console.log("caret position", caretPosition);
        this.highlightText(editableDiv, equipmentId);
        this.caret.setCaret(editableDiv, caretPosition);

    }
}