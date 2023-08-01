import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDkRv2Z9SSJQdl9FNjco7mhu754lh3seEk",
    authDomain: "yuzu-dev-5a591.firebaseapp.com",
    databaseURL: "https://yuzu-dev-5a591-default-rtdb.firebaseio.com/",
    projectId: "yuzu-dev-5a591",
    storageBucket: "yuzu-dev-5a591.appspot.com"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  
  export {app, db}