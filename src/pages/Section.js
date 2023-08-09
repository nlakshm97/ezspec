import './styles/Section.css';
import React,  {  useEffect } from 'react';
import parse from 'html-react-parser';
import TextDiff from '../utility/textdiff';
import Util from '../utility/util';
import EquipmentsTable from '../components/Equipment';
import { useState } from 'react';
import {db} from '../utility/firebase'; 
import { child, onValue, ref , set} from "firebase/database";
import { Button } from '@mui/base';

const Section = () =>{
    
    let textDiff = new TextDiff();
    let util = new Util();

    var pages = [];
   
    const[isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const[section, setSection] = useState('hardware');
    const[activeEquipment, setActiveEquipment] = useState('');
    const[activeEquipmentId, setActiveEquipmentId] = useState('');
    const[pagesModified, setPagesModified] = useState([]);





    useEffect(() => {
        fetchDocument("hardware");            
    }, []);


    const fetchDocument = (sectionId) => {
        const query = ref(db, "document/"+ sectionId);
        onValue(query, (snapshot) => {
            let data= snapshot.val();
            
            let pagesElement = document.getElementById("pages");
            pagesElement.innerHTML = "";
            pages= [];

            let i= 0;
            for(const[key, value] of Object.entries(data)){
                let page = util.createPageElement(i, value);
                page.addEventListener("input", handleChange);
                page.addEventListener("paste", handlePaste);
                pagesElement.appendChild(page);
                pages.push(value);
                i += 1;
            }
            setIsDocumentLoaded(true);
            
        });
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
        let markElements = document.getElementsByTagName("mark");
        for(let i=0;i < markElements.length; i++){
            let mark = markElements[i];
            mark.setAttribute("class", "addHighlighter");
            if (mark.getAttribute("equipment") != equipmentId){
                mark.setAttribute("class", "removeHighlighter");
            }
        }

    }

    const handleSave = (sectionId) => {
        console.log("save called");
        let data = {};
        let pages = document.getElementsByClassName("content");
        for(let i=0;i < pages.length;i ++){
            let page = pages[i];
            data[page.id] = {"content":page.innerHTML, "id":page.id};

        }
        set(ref(db, 'document/' + sectionId), data);

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
                                highlightText(equipment.id);
                                handlePagesModified(equipment.id);
                                
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
                    </div>
                    <div className='document'>
                        <div  id="pages">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Section;