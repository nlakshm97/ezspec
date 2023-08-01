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

    handlePaste(event) {
        console.log("handle paste called ....");



        event.preventDefault();

        let editableDiv = event.currentTarget;
        let paste = (event.clipboardData || window.clipboardData).getData("text");
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();

        let spanElement = document.createElement("span");
        spanElement.appendChild(document.createTextNode(paste));
        selection.getRangeAt(0).insertNode(spanElement);
        selection.collapseToEnd();


        let caretPosition = this.caret.getCaretPositionDuringPaste(editableDiv, spanElement);
        console.log(caretPosition);
        this.highlightText(editableDiv);
        this.caret.setCaret(editableDiv, caretPosition);
    
        
    }

    getCurrentText(editableDiv){
        let text = "";
        let children = editableDiv.children;
        for (let i=0; i<children.length; i++){
            let child = children[i];
            text += child.innerText;
        }
        console.log(text);
        return text;
    }


    highlightText(editableDiv){
        let currentText = this.getCurrentText(editableDiv);
        console.log("current text ...", currentText);
        let mat = this.lcs.findLCS(this.actualText, currentText);
        let commonText = this.lcs.findCommonText(this.actualText, currentText, mat);
        this.lcs.highlightText(editableDiv, commonText,  currentText);
    }

    handleChange(event){
        console.log("handle change called ...");
     
        if (event.inputType == "insertFromPaste"){
            return;
        }
        let targetId = event.target.id;
        let editableDiv = document.getElementById(targetId);
        
         
        let caretPosition = this.caret.getCaretPosition(editableDiv);
        console.log(caretPosition);
        this.highlightText(editableDiv);
        this.caret.setCaret(editableDiv, caretPosition);

    }
}