export default class Caret{

    getCaretPosition(editableDiv) {
      
        let children = editableDiv.children;
        let cursorIndex = 0;

        if (window.getSelection) {
          let sel = window.getSelection();
          if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let edit = (range.commonAncestorContainer.parentNode);
            
            for(let i= 0; i<children.length; i++){    
                if(children[i] == edit){
                    console.log(edit, range.endOffset);
                    cursorIndex += range.endOffset;
                    break;
                }
                cursorIndex += children[i].innerText.length;
            }
          }
        } 
        return cursorIndex;
      }

      getCaretPositionDuringPaste(editableDiv, element){
        let children = editableDiv.children;
        let cursorIndex = 0;

        let isInnerLoopBreak = false;

        for(let i=0;i<children.length;i++){
            let child = children[i];
            if(child.children.length == 0){
                cursorIndex += child.innerText.length;
            }

            console.log(children[i]);
            if(child == element){
                break;
            }
            
            if(child.children.length == 0){
                continue;
            }
            let childNodes = child.childNodes;
            for(let j=0;j<childNodes.length;j++){
                if(childNodes[j].nodeName == "#text"){
                    cursorIndex += childNodes[j].length;
                }
                else{
                    cursorIndex += childNodes[j].innerText.length;
                }
                if(childNodes[j] == element){
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
        
        let children = editableDiv.children;
        var range = document.createRange();
        var sel = window.getSelection();

        
        let cursorIndex = 0;
        let element= null;
        console.log(editableDiv, editableDiv.children);
        for(let i= 0; i<children.length; i++){
            let len = children[i].innerText.length;
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