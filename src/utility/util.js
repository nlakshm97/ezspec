import { textAlign } from '@mui/system';
import { child } from 'firebase/database';
import parse from 'html-react-parser';
export default class Util{

     getActualTextContent = (pages, targetId) => {
        
       console.log("gettign actual text content ..");
        for(let i=0;i <pages.length; i++){
            if (pages[i].id == targetId){
                return pages[i].text;
            }
        }

        return "";
     }

     createPageElement = (idx, value) => {

        let pageElement = document.createElement('div');
        pageElement.setAttribute("class", "page");

        let contentEditableDiv = document.createElement('div');
        contentEditableDiv.setAttribute("class", "content");

        let spanElement = document.createElement("span");
        spanElement.innerHTML = value["content"];
        contentEditableDiv.innerHTML = value["content"];
        contentEditableDiv.setAttribute("contenteditable", true);
        contentEditableDiv.setAttribute("id", value["id"]);

        let pageIdElement = document.createElement("span");
        pageIdElement.setAttribute("class", "pageNumber");
        if (idx == 0){
            contentEditableDiv.style.marginTop = "30px";
        }
        pageIdElement.innerHTML = value["id"];

       

        pageElement.appendChild(contentEditableDiv);
        pageElement.appendChild(pageIdElement);
        return pageElement;
     }

     getCurrentText = (targetId) =>
     
     {
        let editableDiv = document.getElementById(targetId);
        let children = editableDiv.childNodes;
        let text = "";

        for(let i=0;i < children.length; i++){
            let child = children[i];
            if(child.nodeName == "#text"){
                text += child.nodeValue;
            }else{
                text += child.innerText;
            }
        }
        return text;
     }

     splitElement = () => {

     }

     handleSelection(start, end, startOffset, endOffset){
       let elements  = document.getElementsByClassName("content");
       for(let i=0;i <elements.length; i++){
        let children = elements[i].childNodes;
        for(let j=0;j < children.length; j++){
            if(children[i] == start){
                if(startOffset != 0){

                }
            }
        }
       }


     }


     dfs(element) {

        if(element.nodeName == "#text"){
            this.text += element.nodeValue;
            return;
        }
      
        let children = element.childNodes;
        console.log(element, children, children.length, element.innerHTML);
        
        for(let i=0; i<children.length; i++){
            this.dfs(children[i]);
        }
     }

     getText(element) {
        this.text = "";
        this.dfs(element);
        return this.text;

     }


     highlightText(element, start, end){

     }
}