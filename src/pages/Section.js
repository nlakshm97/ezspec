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
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    


    const[isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const[section, setSection] = useState('hardware');
    const[activeEquipment, setActiveEquipment] = useState('');
    const[activeEquipmentId, setActiveEquipmentId] = useState('');
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
        });
        
    }

    const handleEnter = (event) =>{ 
        if(event.keyCode == 13){
            event.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
            return false;
        }
    }
    
    const handlePagesModified = (equipmentId) =>{
        let pagesModified = [];
        let pages = document.getElementsByClassName("content");
        for(let i=0;i < pages.length;i ++){
            let children = pages[i].children;
            for(let j =0;j<children.length; j ++){
                if (children[j].nodeName== "MARK" && children[j].getAttribute("equipment") == equipmentId){
                    pagesModified.push(pages[i].id);
                    break;
                }
            }
        }
        setPagesModified(pagesModified);
    }

    const handleChange = (event)=> {

        if(event.inputType == "insertParagraph"){
            return;
        }
        console.log(event);
        let targetId = event.target.id;
        console.log(targetId);

       
       
        let content = util.getActualTextContent(pages, targetId);
        textDiff.setActualText(content);
        
        let equipmentId=  document.getElementById("equip-id").innerHTML;
        textDiff.handleChange(event, equipmentId);
        highlightText(equipmentId)
        handlePagesModified(equipmentId);
    }

    const handlePaste = (event) => {

        if(event.inputType == "insertParagraph"){
            return;
        }
        let targetId = event.target.parentElement.getAttribute("id");
        let content = util.getActualTextContent(pages, targetId);
        textDiff.setActualText(content);
        let equipmentId=  document.getElementById("equip-id").innerHTML;
        textDiff.handlePaste(event, equipmentId);
        highlightText(equipmentId)
        handlePagesModified(equipmentId);
    }

    const highlightText = (equipmentId) =>{
        console.log("trying to highlight text with equipment id " + equipmentId);
        /*
        let markElements = document.getElementsByTagName("mark");
        for(let i=0;i < markElements.length; i++){
            let mark = markElements[i];
            mark.setAttribute("class", "addHighlighter");
            if (mark.getAttribute("equipment") != equipmentId){
                mark.setAttribute("class", "removeHighlighter");
            }
        }
        */
       

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
        let actualText = pages[pgIdx].text;



       // console.log(currentText);
       // console.log(currentText.length);

        let mat = lcs.findLCS(actualText, currentText);
        let ans = lcs.findCommonText(actualText, currentText, mat);
        
        let similar = ans[0];
        let diff = ans[1];

        
        console.log(diff);

        let quilText = quil.current.getEditor().getText();
        
        let i=0;
        let j = 0;
        let dct = {};
        while (i < currentText.length && j< quilText.length){
            if(currentText[i] == quilText[j]){
                dct[i] = j;
                i += 1;
                j += 1;
            }
            else{
                j += 1;
            }
        }
     
        //console.log(quil);
        
        
        try{
            if (quil && quil != undefined){
                
                for(let i=0;i<diff.length;i++){
                    let start = diff[i][0];
                    let end = diff[i][1];
                   
                    
                    console.log(dct[start], dct[end]);
                    quil.current.getEditor().formatText(dct[start], dct[end] - dct[start] + 2, {        
                        'underline': true
                    });
                }
            }
        }
        catch(exception){

        }   
        
        

    
        
    }

    const mountEquipment = (equipmentId) => {

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
                                setActiveEquipment(equipment.name);
                                setActiveEquipmentId(equipment.id);
                                mountEquipment(equipment.id);
                                
                                
                                
                        }}/>}
                    </div>
                </div>
                <div className='editor'>
                    <div className='metadata'>
                        <div className='title'>

                            <span>{activeEquipment}</span><span className="displayNone" id="equip-id">{activeEquipmentId}</span>
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
                                
                                    return (
                                        <div class="content">
                                            <ReactQuill
                                                theme="snow"
                                                ref={quil} 
                                                modules={modules}
                                                formats={formats}
                                                value={page.content}
                                                onChange={(html, delta, source, editor) => {handleEditorChange(value, i, activeEquipment, source)}} 
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