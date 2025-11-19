import { useState,useEffect } from 'react';
import './departments.css'
import Navbar from './Navbar'
import Swal from 'sweetalert2'

export default function Students(){
    const [add,toggleAdd] = useState(false);
    const [studentName,setStudentName] = useState('');
    const [rollNo,setRollNo] = useState('');
    const [semester,setSemester] = useState('');
    const [department,setDepartment] = useState('');
    const [data, setData] = useState([]);


    const showOverlay = () => {
        toggleAdd(!add);
    }

    const addStudent = async () => {
        try {
            const response = await fetch('http://localhost:5000/students/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({studentName,rollNo,semester,department})
            });

            const result = await response.json();
            
            if (response.ok) {
                setData(prev => [
                    ...prev,
                    { 
                        student_id: result.insertId, 
                        full_name: studentName, 
                        roll_no: rollNo, 
                        department_name: department, 
                        semester: semester 
                    }
                ]);
            } else {
                Swal.fire({
                          title: "Department doesnt exist",
                          icon: "error"
                        });
            }
        } catch (error) {
            console.log('Error occured: ',error);
        }

        Swal.fire({
                    title: "Student Added Successfully!",
                    icon: "success"
                  });

        setStudentName('');
        setRollNo('');
        setSemester('');
        setDepartment('');
        toggleAdd(!add);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/students/show');
                if (!response.ok) {
                    console.log('Error retrieving data:');
                }

                const result = await response.json();
                setData(result);

            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchData();
    }, []);

    const deleteStudent = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/students/delete/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
              Swal.fire({
                title: "Student Deleted!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
              });
    
              setData(prev => prev.filter(item => item.roll_no !== id));
            } else {
              const errMsg = await response.text();
              console.log("Error deleting department:", errMsg);
            }
        } catch (error) {
            console.log('Error occured: ', error);
        }
    }

    return (
        <div>
            <Navbar />

            <div className='main-departments'>
                <div className='department-heading'>
                    <h1>Students</h1>

                    <div className='plus-icon' onClick={showOverlay}>
                        <h2>Add</h2>   
                    </div>
                </div>

                {add && (
                    <div className='popup-overlay'>
                        <div className='add-popup student-popup'>
                            <div className='close-div'>
                                <button onClick={() => toggleAdd(false)} className="close-btn">
                                &times;
                                </button>
                            </div>

                            <h2>Add Student</h2>
                            <div className='add-div student-add'>
                                <input placeholder='Full Name'
                                onChange={(e) => setStudentName(e.target.value)} value={studentName}></input>
                            </div>

                            <div className='add-div student-add'>
                                <input placeholder='Roll No'
                                onChange={(e) => setRollNo(e.target.value)} value={rollNo}></input>
                            </div>

                            <div className='add-div student-add'>
                                <input placeholder='Department'
                                onChange={(e) => setDepartment(e.target.value)} value={department}></input>
                            </div>

                            <div className='add-div student-add'>
                                <input placeholder='Semester'
                                onChange={(e) => setSemester(e.target.value)} value={semester}></input>
                            </div>


                            <button className='add-btn std-add-btn' onClick={addStudent}>Add</button>
                        </div>
                    </div>
                )

                }

                <div className='department-list'>
                  <ul>
                    <li className='list-header'>
                      <span className='col'>Full Name</span>
                      <span className='col'>Roll No</span>
                      <span className='col'>Department</span>
                      <span className='col'>Semester</span>
                      <span className='col col-actions'>Options</span>
                    </li>

                    {data.map((item, index) => (
                      <li key={item.roll_no || index} className='department-listitem'>
                        <span className='col'>{item.full_name || <span style={{ color: 'red' }}>MISSING NAME</span>}</span>
                        <span className='col'>{item.roll_no || <span style={{ color: 'red' }}>MISSING ROLLNO</span>}</span>
                        <span className='col'>{item.department_name || <span style={{ color: 'red' }}>MISSING DEPARTMENT</span>}</span>
                        <span className='col'>{item.semester || <span style={{ color: 'red' }}>MISSING SEMESTER</span>}</span>

                        <span className='col col-actions'>
                          <button className='delete-btn' onClick={() => deleteStudent(item.roll_no)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red">
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 
                              56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 
                              0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                

            </div>
        </div>
    )
}