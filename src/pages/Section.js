import './styles/Section.css';
import React, {  useEffect } from 'react';
import parse from 'html-react-parser';
import TextDiff from '../utility/textdiff';
import Util from '../utility/util';
import EquipmentsTable from '../components/Equipment';
import { useState } from 'react';
import {db} from '../utility/firebase'; 
import { onValue, ref } from "firebase/database";

const Section = () =>{
    
    let textDiff = new TextDiff();
    let util = new Util();

    var pages = [];
   
    const[isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const[activeEquipment, setActiveEquipment] = useState('');
    const[activeEquipmentId, setActiveEquipmentId] = useState('');
    const[pagesModified, setPagesModified] = useState([]);





    useEffect(() => {
        fetchDocument();            
    }, []);


    const fetchDocument = () => {
        const query = ref(db, "document");
        onValue(query, (snapshot) => {
            let data= snapshot.val();
            
            let pagesElement = document.getElementById("pages");
            pagesElement.innerHTML = "";
            pages= [];
            
            for(const[key, value] of Object.entries(data)){
                let page = util.createPageElement(value);
                page.addEventListener("input", handleChange);
                page.addEventListener("paste", handlePaste);
                pagesElement.appendChild(page);
                pages.push(value);
            }
            setIsDocumentLoaded(true);
            
        });
    }
    
    const handleChange = (event)=> {
        let targetId = event.target.id;
        console.log(targetId);
        if(textDiff.getActualText() == undefined){
            let content = util.getActualTextContent(pages, targetId);
            textDiff.setActualText(content);
        }
        let equipmentId=  document.getElementById("equip-id").innerHTML;
        textDiff.handleChange(event, equipmentId);
        highlightText(equipmentId)
    }

    const handlePaste = (event) => {
        let targetId = event.target.parentElement.getAttribute("id");
        let content = util.getActualTextContent(pages, targetId);
        console.log("handle paste event .....");
        console.log(content);
        textDiff.setActualText(content);
        let equipmentId=  document.getElementById("equip-id").innerHTML;
        textDiff.handlePaste(event, equipmentId);
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

    return (
        <div className='container'>
            <div className='section'>
                <div className='details'>
                    <div className='name'></div>
                    <div className='equipments'>
                        {isDocumentLoaded && <EquipmentsTable setEquipment ={
                            (equipment) => {
                                console.log(equipment.id);
                                setActiveEquipment(equipment.name);
                                setActiveEquipmentId(equipment.id);
                                setPagesModified(equipment.pagesModified);
                                highlightText(equipment.id);
                                
                        }}/>}
                    </div>
                </div>
                <div className='editor'>
                    <div className='metadata'>
                        <div className='title'><span>{activeEquipment}</span><span>-</span><span  id="equip-id">{activeEquipmentId}</span></div>
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