import './styles/Equipment.css';
import MUIDataTable from 'mui-datatables';
import { useState, useEffect } from 'react';
import {db} from '../utility/firebase'; 
import { onValue, ref } from "firebase/database";

const EquipmentsTable = ({setEquipment}) =>{


    const [data, setData] = useState([{"name":"hello", "isIncluded":false}]);

    useEffect(() => {
      fetchEquipmentsData();
    }, []);
    

    const fetchEquipmentsData = () => {
      const query = ref(db, "equipments");
      onValue(query, (snapshot) => {
        let equipments = snapshot.val();
        let payload = [];
        for(const[key, value] of Object.entries(equipments)){
          value["pagesModified"] =  Object.keys(value["pagesModified"])
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
      return (
        <div style={{ maxWidth: '100%' }}>
          <MUIDataTable
      
            columns={columns}
            data={data}
            title='Equipments'
            options={options}
            
          />
        </div>
      );
}

export default EquipmentsTable;