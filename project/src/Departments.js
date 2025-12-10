import { useState,useEffect } from 'react'
import './departments.css'
import Navbar from './Navbar'
import Swal from 'sweetalert2'

export default function Departments(){
    const [add,toggleAdd] = useState(false);
    const [department,toggleDepartment] = useState('');
    const [data,setData] = useState([]);

    const showOverlay = () => {
        toggleAdd(!add);
    }

    const addDepartment = async () => {
        try {
            const response = await fetch('http://localhost:5000/departments/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({department})
            });

            const result = await response.json();
             setData(prev => [
            ...prev,
            { department_id: result.insertId, name: department }
        ]);
        } catch (error) {
            console.log('Error: ', error);
        }

        toggleDepartment('');
        toggleAdd(!add);

        Swal.fire({
          title: "Department Added Successfully!",
          icon: "success",
          text: 'You cannot delete table after adding students to this department'
        });
    }

    useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/departments/show');
                if (!response.ok) {
                    console.log('Error retreiving data');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        };

        fetchData();
    }, []);

    const deleteDepartment = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/departments/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            title: "Department Deleted!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          setData(prev => prev.filter(item => item.department_id !== id));
        } else {
          const errMsg = await response.text();
          console.log("Error deleting department:", errMsg);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };


    return (
        <div>
            <Navbar />

            <div className='main-departments'>
                <div className='department-heading'>
                    <h1>Departments</h1>

                    <div className='plus-icon' onClick={showOverlay}>
                        <h2>Add</h2>
                    </div>
                </div>

                {add && (
                    <div className='popup-overlay'>
                        <div className='add-popup'>
                            <div className='close-div'>
                                <button onClick={() => toggleAdd(false)} className="close-btn">
                                &times;
                                </button>
                            </div>

                            <h2>Add Department</h2>
                            <div className='add-div'>
                                <input placeholder='Department Name'
                                onChange={(e) => toggleDepartment(e.target.value)} value={department}></input>
                            </div>

                            <button className='add-btn' onClick={addDepartment}>Add</button>
                        </div>
                    </div>
                )

                }

                <div className='department-list'>
                    <ul>
                        <li className='list-header'>
                            <span className='col'>Department Name</span>    
                            <span className='col-actions'>Options</span>
                        </li>
                      {data.map((item, index) => (
                          <li key={item.department_id || index} className='department-listitem'>
                            {item.name ? item.name : <span style={{color: "red"}}>MISSING NAME</span>}
                            <button className='delete-btn' onClick={() => deleteDepartment(item.department_id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            </button>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}