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
        while (i < commonText.length && j < originalText.length) {
          if (commonText[i] == originalText[j]) {
            
            text += "<span>"+ commonText[i] +"</span>";
            i++;
            j++;
          } 
          else {
            text += "<mark>"+originalText[j]+"</mark>";
            j++;
          }
        }

        while (j < originalText.length) {
 
            text += "<mark>"+originalText[j]+"</mark>";
            j++;
        }
        console.log(text);
        contentElementId.innerHTML = text;
      };


}