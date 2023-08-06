import { child } from "firebase/database";

export default class Caret{

    getCaretPosition(editableDiv) {
      
        let children = editableDiv.childNodes;
        let cursorIndex = 0;

        if (window.getSelection) {
          let sel = window.getSelection();
          if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let edit = (range.commonAncestorContainer.parentNode);
            console.log("component being edited ...", edit);
            console.log(range.endOffset);
            for(let i= 0; i<children.length; i++){    
                if(children[i] == edit){
                    cursorIndex += range.endOffset;
                    break;
                }
                if(children[i].nodeName != "#text"){
                    cursorIndex += children[i].innerText.length;
                }
                else{
                    cursorIndex += children[i].length;
                }
                
            }
          }
        } 
        console.log("calculating cursorIndex ...");
        return cursorIndex;
       
      }

      getCaretPositionDuringPaste(editableDiv, textNode){
        let children = editableDiv.children;
        let cursorIndex = 0;

        let isInnerLoopBreak = false;

        for(let i=0;i<children.length;i++){
            let child = children[i];
            let childNodes = child.childNodes;
            for(let j=0;j<childNodes.length;j++){
                if(childNodes[j].nodeName == "#text"){
                    cursorIndex += childNodes[j].length;
                }
                else{
                    cursorIndex += childNodes[j].innerText.length;
                }
                if(childNodes[j] == textNode){
                    isInnerLoopBreak = true;
                    break;
                }
            }

            if(isInnerLoopBreak){
                break;
            }

        }
        return cursorIndex;
      }

      setCaret(editableDiv, pos) {
        
        let children = editableDiv.childNodes;
        var range = document.createRange();
        var sel = window.getSelection();

        
        let cursorIndex = 0;
        let element= null;
       
        for(let i= 0; i<children.length; i++){
            let len = 0;
            if(children[i].nodeName == "#text"){
                len = children[i].length;
            }
            else{
                len = children[i].innerText.length;
            }
            
            if (cursorIndex + len >= pos){
                element = children[i];
                break;
            }
            cursorIndex += len;
        }
        console.log("set caret", element, cursorIndex, pos);


        if(element == null || element.childNodes == null){
           return;
        }
        
         
        range.setStart(element.childNodes[0],pos-cursorIndex);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
   
     
        console.log("focus called");
    }
}