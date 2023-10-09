import './styles/Equipment.css';
import MUIDataTable from 'mui-datatables';
import { useState, useEffect } from 'react';
import {db} from '../utility/firebase'; 
import { Button } from '@mui/base';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { child, onValue, ref , set, update} from "firebase/database";
const EquipmentsTable = ({setEquipment}) =>{

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',

    boxShadow: 24,
    p: 4,
  };

    const [data, setData] = useState([{"name":"hello", "isIncluded":false}]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [equipmentName, setEquipmentName] = useState('');

    useEffect(() => {
      fetchEquipmentsData();
    }, []);
    

    const fetchEquipmentsData = () => {
      const query = ref(db, "equipments");
      onValue(query, (snapshot) => {
        let equipments = snapshot.val();
        let payload = [];
        for(const[key, value] of Object.entries(equipments)){
          payload.push(value);
        }
        setData(payload);
        if(payload.length > 0){
          setEquipment(payload[0]);
        }
      });
    }

    const columns = [

      
        { label: 'Name', 
          name: 'name' ,
          options: {
        
          customBodyRender: (value, tableMeta, updateValue) => {
              let rowIndex = tableMeta.rowIndex;
              return (<div className='equipmentName' onClick={() => {
                setEquipment(data[rowIndex]);
              
              }}>{value}</div>)
            }
          }
        },
        { label: 'Include ?', 
          name: 'isIncluded' , 
          options: {
        
          customBodyRender: (value, tableMeta, updateValue) => {
            
            let id = parseInt(tableMeta.rowIndex);
            data[id]["isIncluded"] = value;
      
            return (<input 
           
                className='include'
                type="checkbox" 
                checked={value}
                onChange={event => updateValue(event.target.checked)}
                >
                </input>)
          }
        }}
      
      ];
      const options = {
        filterType: 'checkbox',

      };

      const handleAddEquipment = () => {
        console.log("adding equipment ...");
        let payload = {};

        payload ["isIncluded"] = false;
        payload ["name"] = equipmentName;
        let equipmentId = "equip-"+Date.now();
        payload ["id"] = equipmentId;
        console.log(equipmentId);

        let rs ={};
        rs[equipmentId] = payload;
        update(ref(db, 'equipments/'), rs );

      }

      const handleEquipmentNameChange = (event) => {
        setEquipmentName(event.target.value);
      }
   


      return (
        <React.Fragment>
           <Button className='addEquipmentButton' onClick={handleOpen}>ADD EQUIPMENT</Button>
           <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="modal">
              <div className='modalHeader'>
                <Typography variant="h5" component="h5">
                  Add Equipment
                </Typography>
              </div>
              <div className= "modalBody">
                <TextField id="equipment-name" label="Equipment Name" variant="outlined" onChange={handleEquipmentNameChange}/>
              </div>
              <div className= "modalFooter">
                <Button className='addEquipmentButton' onClick={handleAddEquipment}>ADD EQUIPMENT</Button>
              </div>
              </Box>
            </Modal>
            <div style={{ maxWidth: '100%' }}>
              <MUIDataTable
          
                columns={columns}
                data={data}
                title='Equipments'
                options={options}
                
              />
            </div>
        </React.Fragment>
      );
}

export default EquipmentsTable;