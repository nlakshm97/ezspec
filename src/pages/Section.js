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

    var previousId = null;

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
    const[activeEquipment, setActiveEquipment] = useState('');
    var [activeEquipmentId, setActiveEquipmentId] = useState(null);
    const[pagesModified, setPagesModified] = useState([]);

    const [highlight, setHighlight] = useState(false);
    const [editorValue, setEditorValue] = useState('');
    const [value, setValue] = useState('');

    


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

    
    
    
    const handleEditorChange= (value, pgIdx, equipmentId, source) => {
        console.log("here ....");
        console.log(source);
        if(source == "api"){
            return;
        }
      
     

        //console.log(value);
        
        let page = document.getElementsByClassName("ql-editor")[pgIdx];
        
        let locks = textDiff.getLocks(page, equipmentId);
        //console.log(page);
        console.log("locks being addedd ...");
        console.log(locks);
        let currentText = util.getText(page);
        console.log(currentText);
        let actualText = actualPages[pgIdx].text;

        pages[pgIdx].content = page.innerHTML;

       // console.log(currentText);
       // console.log(currentText.length);

        let mat = lcs.findLCS(actualText, currentText);
        let ans = lcs.findCommonText(actualText, currentText, mat);
        
        let similar = ans[0];
        let diff = ans[1];

        
        console.log(diff);

        let quilText = quil.current.getEditor().getText();
        console.log(quilText);
        
        
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
        
        setPages(pages);

    
        
    }

    const unmountEquipment = (equipmentId, activeEquipmentId, setActiveEquipmentId) => {
        console.log("unmounting equipment ...");
        console.log( equipmentId, activeEquipmentId);

        if(equipmentId!= null){
            console.log("equipment is being unmounted ....", equipmentId);
            let elements = document.getElementsByTagName("u");
       
            for(let i=0;i< elements.length;i++){
                console.log(elements[i].getAttribute("equipment"));
                if(elements[i].getAttribute("equipment") == null){
                    console.log(elements[i]);
                    elements[i].setAttribute("equipment", equipmentId);
                    elements[i].setAttribute("class", "removeHighlighter");
                }
            }
        }
       
        
    }


    const mountEquipment = (equipmentId) => {
        console.log("mounting equipment ...", equipmentId);
        let elements = document.getElementsByTagName("u");
        console.log(elements);
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
                     
                                unmountEquipment(activeEquipmentId, equipment.id, setActiveEquipmentId);
                                mountEquipment(equipment.id);

                                let elements = document.getElementsByClassName("ql-editor");
                                let values= [];
                                for(let i=0;i<elements.length; i++){
                          
                                    pages[i].content = elements[i].innerHTML;
                                   
                                }
                            
                                activeEquipmentId = equipment.id;
                                setEquipmentName(equipment.name);
                  
                                
                        }}/>}
                    </div>
                </div>
                <div className='editor'>
                    <div className='metadata'>
                        <div className='title'>

                            <span>{activeEquipment}</span><span  id="equip-id">{activeEquipmentId}</span>
                            <Button className='save' onClick={() => {handleSave(section)}}>SAVE</Button>
                        </div>
                        <div className='pagesModified'>
                            
                            {
                                pagesModified.map((item) => 
                                    <div className='modifiedItem'>
                                        <span>{item}</span>
                                    </div>
                                )
                            }
                            
                        </div>
                        <div className='textToolBar'>
                          

                        </div>
                    </div>
                    <div className='document'>
                        {
                            
                        
                            pages.map((page, i) => {
                                console.log(page.content);
                                    return (
                                        <div class="content">
                                            <ReactQuill
                                                theme="snow"
                                                ref={quil} 
                                                modules={modules}
                                                formats={formats}
                                                value={page.content}
                                                onChange={(html, delta, source, editor) => {
                                                    handleEditorChange(value, i, activeEquipment, source)}} 
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