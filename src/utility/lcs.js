import { ChildCareRounded } from '@material-ui/icons';
import { child } from 'firebase/database';
import parse from 'html-react-parser';
export default class LCS{


    static count = 0;
    findLCS(text1, text2) {
  
        let rows = text1.length;
        let cols = text2.length;
       
  
        let matrix = new Array(rows + 1)
          .fill(0)
          .map(() => new Array(cols + 1).fill(0));
      
        for (let i = 1; i <= rows; i++) {
          for (let j = 1; j <= cols; j++) {
            

            if (text1[i - 1] == text2[j - 1]) {
              matrix[i][j] = 1 + matrix[i - 1][j - 1];
            } 
            else {
              matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
          }
        }
        
   
        return matrix;
      }

      findCommonText(text1, text2, matrix) {

        let i = text1.length;
        let j = text2.length; 
        let reverseCommonText = '';

        while (i > 0 && j > 0) {
          if (text1[i - 1] == text2[j - 1]) {
            reverseCommonText = reverseCommonText + text1[i - 1];
            i = i - 1;
            j = j - 1;
          } 
          else {
            if (matrix[i - 1][j] > matrix[i][j - 1]) i = i - 1;
            else j = j - 1;
          }
        }
        return reverseCommonText.split('').reverse().join('');
      }

  

      createElement(left, right, text, elementsToBeReplaced, type){
        let value = text.substring(left, right);
        console.log(left, right, type, value);
        if(value.length == 0){
          return;
        }
        let element = document.createElement("mark");
        console.log(LCS.count);
        element.setAttribute("id", "mark-"+LCS.count);
        if (type == "span"){
          element = document.createElement("span");
          element.setAttribute("id", "span-"+LCS.count);
        }
        LCS.count += 1;
        let textNode = document.createTextNode(value);
        element.appendChild(textNode);
        elementsToBeReplaced.push(element);
      }

      addToSequence(j, currentTextParent, sequence, type){
        let idx = currentTextParent[j][0]
        let node = currentTextParent[j][1];
     
        if (node.nodeName == type){
          return;
        }

        let id = node.id;
        if(sequence[id]){
          sequence[id].push(idx);
        }
        else{
          sequence[id] = [idx];
        }
      }

      

      mismatch(sequence, contentElement, type){
        console.log(sequence);
        for(let each in sequence){
         
          let value = sequence[each];

          let element = document.getElementById(each);
          console.log("speicific element ", each, document.getElementById(each).innerHTML);

              if((type=="markinsidespan" && element.nodeName  == "SPAN") || (type=="spaninsidemark" && element.nodeName  == "MARK")){

        
                let clubValues = [];
        

                let elementsToBeReplaced = [];
                let start = value[0];
                let end = value[0];
                for(let i =1; i< value.length; i++){
                  if(value[i-1] == value[i] - 1){
                    end = value[i];
                  }
                  else{
                    clubValues.push([start, end])
                    start = value[i];
                    end = value[i];
                  }
                }
                clubValues.push([start, end])
           

                let text = element.innerText;
                let left = 0;
                let right = 0;
                for(let k in clubValues){
                  let key = clubValues[k];

                    if (key[0] == key[1]){
                      key[1] += 1;
                    }
              
                    right = key[0];
                    if(type == "markinsidespan"){
                      this.createElement(left, right, text, elementsToBeReplaced, "span");
                    }
                    else{
                      this.createElement(left, right, text, elementsToBeReplaced, "mark");
                    }

                    left = key[0];
                    right = key[1];

                    if(type == "markinsidespan"){
                      this.createElement(left, right, text, elementsToBeReplaced, "mark");
                    }
                    else{
                      this.createElement(left, right, text, elementsToBeReplaced, "span");
                    }

                    left = key[1];
                }
                right = text.length;
                if(type == "markinsidespan"){
                  this.createElement(left, right, text, elementsToBeReplaced, "span");
                }
                else{
                  this.createElement(left, right, text, elementsToBeReplaced, "mark");
                }

            
                
                let nextSibling = (element.nextSibling);
                for(let h=elementsToBeReplaced.length - 1;h>=0;h--){
              
                  contentElement.insertBefore(elementsToBeReplaced[h], nextSibling);
                  nextSibling = elementsToBeReplaced[h];
                }
                contentElement.removeChild(element);
                
          
              }
          }
      }


      highlightText(contentElement, commonText, currentText, currentTextParent) {
        let i = 0;
        let j = 0;
    
       let changedSequence = {};
       let commonSequence = {};
  
        while (i < commonText.length && j < currentText.length) {
          if (commonText[i] == currentText[j]) {
            this.addToSequence(j, currentTextParent, commonSequence, "SPAN")

            i++;
            j++;
          } 
          else {
           this.addToSequence(j, currentTextParent, changedSequence, "MARK" );   
            j++;
          }
        }
        while (j < currentText.length) {
            this.addToSequence(j, currentTextParent, changedSequence, "MARK" );     
            j++;
        }
    
        this.mismatch(changedSequence , contentElement, "markinsidespan");
        this.mismatch(commonSequence, contentElement, "spaninsidemark");

     
        
      };


}