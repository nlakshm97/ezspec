import parse from 'html-react-parser';
export default class Util{

     getActualTextContent = (pages, targetId) => {
        
        console.log(targetId);
        let content = "";
        for(let i=0;i <pages.length; i++){
            if (pages[i].id == targetId){
                content = pages[i].content;
                break;
            }
        }

        let tags = ["span", "mark"];
        for(let i=0;i< tags.length; i++){
            content = content.replaceAll("<"+tags[i]+">", "");
            content = content.replaceAll("</"+tags[i]+">", "");
        }
        return content;
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