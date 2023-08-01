export default class LCS{

    
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
        console.log(text1, text2, matrix);
        
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


      highlightText(contentElementId, commonText, originalText) {
        let i = 0;
        let j = 0;
    
        let text = "";
        console.log("-->",originalText, commonText);
        let stk = [];
        let txt = [];

        while (i < commonText.length && j < originalText.length) {
          if (commonText[i] == originalText[j]) {
            stk.push("span");
            txt.push(commonText[i]);
            i++;
            j++;
          } 
          else {
         
            stk.push("mark");
            txt.push(originalText[j]);
            j++;
          }
        }

        while (j < originalText.length) {
            stk.push("mark");
            txt.push(originalText[j]);
  
            j++;
        }
        let textOpt = "";
        let current = "";

        if(stk.length > 0){

            current = "<"+stk[0]+">"+txt[0]+"</"+stk[0]+">"   
            
        }
        for(let i =1;i<stk.length;i++){
            if (stk[i-1] == stk[i]){
                    current = current.replace("</"+stk[i]+">", "");
                    current += txt[i] + "</"+stk[i]+">";
            }
            else{
                textOpt += current;
                current = "<"+stk[i]+">"+txt[i]+"</"+stk[i]+">" ;
            }
        }
        textOpt += current;
        contentElementId.innerHTML = textOpt;
        
      };


}