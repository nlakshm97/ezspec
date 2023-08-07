import parse from 'html-react-parser';
export default class Util{

     getActualTextContent = (pages, targetId) => {
        
       
        let content = "";
        for(let i=0;i <pages.length; i++){
            if (pages[i].id == targetId){
                content = pages[i].content;
                break;
            }
        }

        content = parse(content);
        let text = "";
        for(let i=0;i< content.length; i++){
           if(content[i].type == "span"){
            text += content[i].props.children;
           }
        }
        console.log(text);
        return text;
     }

     createPageElement = (value) => {

        let pageElement = document.createElement('div');
        pageElement.setAttribute("class", "page");

        let contentEditableDiv = document.createElement('div');
        contentEditableDiv.setAttribute("class", "content");
        contentEditableDiv.innerHTML =value["content"];
        contentEditableDiv.setAttribute("contenteditable", true);
        contentEditableDiv.setAttribute("id", value["id"]);

        let pageIdElement = document.createElement("span");
        pageIdElement.setAttribute("class", "pageNumber");
        pageIdElement.innerHTML = value["id"];


        pageElement.appendChild(contentEditableDiv);
        pageElement.appendChild(pageIdElement);
        return pageElement;
     }
}