import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Section from './pages/Section';
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/">
        <Route index element={<Home/>}/>
          <Route path="section" element={<Section />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
