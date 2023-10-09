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

      rec(i, visited, diff){
    
          visited[i] = true
          if (i + 1 < diff.length &&  diff[i] + 1 == diff[i+1]){
              return this.rec(i + 1, visited, diff)
          }
          return diff[i]
      }
    

  dfs(diff){
      
      let rng = []
      
      let n = diff.length;
      let visited = [];
      for(let i=0;i<n;i++){
        visited.push(false);
      }
      
      for (let i=0;i< n;i++){
          
          if (! visited[i])
          {
              let start = diff[i];
              let end = this.rec(i, visited, diff);
              rng.push([start, end])
          }
      }
        
      return rng
    }
      findCommonText(text1, text2, matrix) {
        
        let i = text1.length;
        let j = text2.length; 
        let reverseCommonText = '';
        let diff = [];
        
        let similar = [];
        while (i > 0 && j > 0) {
          if (text1[i - 1] == text2[j - 1]) {
            reverseCommonText = reverseCommonText + text1[i - 1];
            i = i - 1;
            j = j - 1;
            similar.push(j-1);
          } 
          else {
            if (matrix[i - 1][j] > matrix[i][j - 1]) {
              i = i - 1;
             
            }
            else {
              j = j - 1;
          
            }
          }
        }

        for(let k=0;k<text2.length; k++){
     
          if(!similar.includes(k)){
            diff.push(k);
          }
        }
        similar.reverse();

        let ans = [this.dfs(similar), this.dfs(diff)];
        return ans;
      }


     


}