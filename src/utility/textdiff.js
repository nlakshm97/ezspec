import LCS from '../utility/lcs';
import Caret from '../utility/caret';
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

    handlePaste(event) {
        console.log("handle paste called ....");



        event.preventDefault();
        console.log(event.target.parentElement);
        let editableDiv = event.target.parentElement;
        let paste = (event.clipboardData || window.clipboardData).getData("text");
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();

        let textNode = document.createTextNode(paste);
        selection.getRangeAt(0).insertNode(textNode);
        selection.collapseToEnd();


        let caretPosition = this.caret.getCaretPositionDuringPaste(editableDiv, textNode);
        console.log(caretPosition);
        this.highlightText(editableDiv);
        this.caret.setCaret(editableDiv, caretPosition);
    
        
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


    highlightText(editableDiv){

        let arr = this.getCurrentText(editableDiv);

        let currentText = arr[0];
        let currentTextParent = arr[1];

        let mat = this.lcs.findLCS(this.actualText, currentText);
        
        console.log("actualText", this.actualText);
        console.log("currentText", currentText);

        let commonText = this.lcs.findCommonText(this.actualText, currentText, mat);
        console.log("common", commonText);
        this.lcs.highlightText(editableDiv, commonText,  currentText, currentTextParent);
       
    }

    handleChange(event){
        console.log("handle change called ...");
     
        if (event.inputType == "insertFromPaste"){
            return;
        }
        let targetId = event.target.id;
        let editableDiv = document.getElementById(targetId);
        
         
        let caretPosition = this.caret.getCaretPosition(editableDiv);
        console.log("caret position", caretPosition);
        this.highlightText(editableDiv);
        this.caret.setCaret(editableDiv, caretPosition);

    }
}