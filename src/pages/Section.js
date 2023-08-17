import './styles/Section.css';
import React,  {  useEffect } from 'react';
import parse from 'html-react-parser';
import TextDiff from '../utility/textdiff';
import Util from '../utility/util';
import EquipmentsTable from '../components/Equipment';
import { useState , useRef} from 'react';
import {db} from '../utility/firebase'; 
import { child, onValue, ref , set} from "firebase/database";
import { Button } from '@mui/base';
import 'react-quill/dist/quill.snow.css';
import LCS from '../utility/lcs';

import ReactQuill, { Quill } from 'react-quill';

const Section = () =>{


    const Quill = ReactQuill.Quill
    var Font = Quill.import('formats/font');
    Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial'];
    Quill.register(Font, true);

    var Size = Quill.import('attributors/style/size');
    Size.whitelist = ['14px', '15px', '16px', '17px','18px'];
    Quill.register(Size, true);

   

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block', 'link'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': ['inconsolata', 'roboto', 'mirza', 'arial'] }],
        [{ 'align': [] }],
        [{'size':['14px','15px', '16px', '17px', '18px']}],

        ['clean']                                         // remove formatting button
    ];

    const modules = {
        toolbar:toolbarOptions
      }
      /* 
       * Quill editor formats
       * See https://quilljs.com/docs/formats/
       */
      const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
      ]

    
    let textDiff = new TextDiff();
    let util = new Util();
    let lcs = new LCS();
    const quil = useRef();


    const [pages, setPages] = useState([]);
    const [actualPages, setActualPages] = useState([]);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    


    const[isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const[section, setSection] = useState('hardware');
    var [activeEquipmentId, setActiveEquipmentId] = useState(null);
    

    const [editorValue, setEditorValue] = useState('');
    const [value, setValue] = useState('');

    var modifiedPages = [];
    


    useEffect(() => {
        fetchDocument("hardware");    
   
    }, []);


    const fetchDocument = (sectionId) => {
       
        const query = ref(db, "document/"+ sectionId);
        onValue(query, (snapshot) => {
            let data= snapshot.val();
            
           // let pagesElement = document.getElementById("pages");
           // pagesElement.innerHTML = "";
            let values= [];

            let i= 0;
            for(const[key, value] of Object.entries(data)){
              //  let page = util.createPageElement(i, value);
             //   pagesElement.appendChild(page);
                values.push(value);
               // i += 1;
            }
            setIsDocumentLoaded(true);
            setPages(values);
            setActualPages(values);
        });
        
    }



    const handleSave = (sectionId) => {
        console.log("save called");
        console.log(editorValue);
        /*
        let data = {};
        let pages = document.getElementsByClassName("content");
        for(let i=0;i < pages.length;i ++){
            let page = pages[i];
            data[page.id] = {"content":page.innerHTML, "id":page.id};

        }
        set(ref(db, 'document/' + sectionId), data);
        */

    }


    const handlePagesModified = () =>{

        
        console.log("handling pages modified ...");
        let activeEquipmentId = localStorage.getItem("activeEquipmentId");
        
        let pages = document.getElementsByClassName("ql-editor");
        let values = [];
        for(let i=0;i<pages.length;i++){
             let page = pages[i];
             let underlineElements = page.querySelectorAll('[equipment='+activeEquipmentId+']');
             if(underlineElements.length > 0){
                values.push("page-"+i.toString());
             }
        }
        modifiedPages = values;
        setPagesModified();
    }

    
    
    
    const handleEditorChange= ( pgIdx, source) => {
 
    
        if(source == "api"){
            return;
        }
      
        
        let page = document.getElementsByClassName("ql-editor")[pgIdx];

        let currentText =  quil.current.getEditor().getText();//util.getText(page);
        let actualText = actualPages[pgIdx].text;

        pages[pgIdx].content = page.innerHTML;

        let mat = lcs.findLCS(actualText, currentText);
        let ans = lcs.findCommonText(actualText, currentText, mat);
        
        let diff = ans[1];
        try{
            if (quil && quil != undefined){
                
                for(let i=0;i<diff.length;i++){
                    let start = diff[i][0];
                    let end = diff[i][1];
                
                    quil.current.getEditor().formatText(start, end - start, {        
                        'underline': true
                    });
                }
            }
        }
        catch(exception){

        }   

   
        if(!modifiedPages.includes("page-"+pgIdx.toString())){
            modifiedPages.push("page-"+pgIdx.toString());
            setPagesModified();
        }
        
        
        setPages(pages);


    
        
    }

    const unmountEquipment = (equipmentId, activeEquipmentId) => {
        console.log("unmounting equipment ...");
        console.log( equipmentId, activeEquipmentId);

        if(equipmentId!= null){
            console.log("equipment is being unmounted ....", equipmentId);
            let elements = document.getElementsByTagName("u");
       
            for(let i=0;i< elements.length;i++){
                if(elements[i].getAttribute("equipment") == null){
                    elements[i].setAttribute("equipment", equipmentId);
                    elements[i].setAttribute("class", "removeHighlighter");
                }
            }
        }
       
        
    }


    const mountEquipment = (equipmentId) => {
        console.log("mounting equipment ...", equipmentId);
        let elements = document.getElementsByTagName("u");
    
        for(let i=0;i< elements.length;i++){
            if(elements[i].getAttribute("equipment")){
               if(elements[i].getAttribute("equipment") == equipmentId){
                elements[i].setAttribute("class", "addHighlighter");
               }
               else{
                elements[i].setAttribute("class", "removeHighlighter");
               }
            }
        }
     
    }

    const setEquipmentName = (equipmentName) => {
        document.getElementById("equip-id").innerHTML = equipmentName;
    }

    const setPagesModified = () => {

        let modifiedPageElement = document.getElementById("modifiedPages");
        modifiedPageElement.innerHTML = "";

        for (let i=0;i< modifiedPages.length; i++){
            let divELement = document.createElement("div");
            divELement.setAttribute("class", "modifiedItem");
            let spanElement = document.createElement("span");
            spanElement.innerHTML = modifiedPages[i];

            divELement.appendChild(spanElement);
            modifiedPageElement.appendChild(divELement);
        }
    }


    return (
        <div className='container'>
            <div className='job'>
                <div className='details'>
                    <div className='section'>

                    </div>
                    <div className='equipments'>
                        {isDocumentLoaded && <EquipmentsTable setEquipment ={
                            (equipment) => {
                                console.log(equipment.id);
                                console.log(activeEquipmentId);
                                let currentEquipment = localStorage.getItem("activeEquipmentId");
                                
                                
                     
                                unmountEquipment(currentEquipment, equipment.id);
                                mountEquipment(equipment.id);
                                localStorage.setItem("activeEquipmentId", equipment.id);
                                activeEquipmentId = equipment.id;
                                
                                setEquipmentName(equipment.name);
                                handlePagesModified();
                                

                                
                         
                                
                  
                                
                        }}/>}
                    </div>
                </div>
                <div className='editor'>
                    <div className='metadata'>
                        <div className='title'>

                            <span  id="equip-id"></span>
                            <Button className='save' onClick={() => {handleSave(section)}}>SAVE</Button>
                        </div>
                        <div id="modifiedPages" className='pagesModified'>
                            
                        </div>
                        <div className='textToolBar'>
                          

                        </div>
                    </div>
                    <div className='document'>
                        {
                            
                        
                            pages.map((page, i) => {
              
                                    return (
                                        <div class="content">
                                            <ReactQuill
                                                theme="snow"
                                                ref={quil} 
                                                modules={modules}
                                                formats={formats}
                                                value={page.content}
                                                onChange={(html, delta, source, editor) => {
                                                    handleEditorChange( i, source)}} 
                                            />
                                        </div>
                                    )
                            })
                            
                        }
                    <div className="content">
                 
                    
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Section;