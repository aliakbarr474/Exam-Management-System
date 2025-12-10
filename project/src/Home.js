import { useEffect, useState } from 'react'
import './home.css'
import Navbar from './Navbar'
import { Link } from 'react-router-dom';

export default function Home() {
    const [departmentNum, setDepartmentNum] = useState([]);
    const [stdNum, setStdNum] = useState([]);
    const [roomNum, setRoomNum] = useState([]);
    const [seatNum, setSeatNum] = useState([]);

    const [departmentpopup, toggleDepartmentPopup] = useState(false);
    const [stdpopup, toggleStdPopup] = useState(false);
    const [roomPopup, toggleRoomPopup] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchDepartmentNumber = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard/departments');
                if (!response.ok) {
                    console.log('Error retrieving data');
                    return;
                }

                const result = await response.json();
                setDepartmentNum(result.departmentNum);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchDepartmentNumber();
    }, [])

    useEffect(() => {
        const fetchStudentNumber = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard/students');
                if (!response.ok) {
                    console.log('Error retrieving data');
                    return;
                }

                const result = await response.json();
                setStdNum(result.stdNum);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchStudentNumber();
    }, [])

    useEffect(() => {
        const fetchRoomNumber = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard/rooms');
                if (!response.ok) {
                    console.log('Error retrieving data');
                    return;
                }

                const result = await response.json();
                setRoomNum(result.roomNum);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchRoomNumber();
    }, [])

    useEffect(() => {
        const fetchSeatNumber = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard/seats');
                if (!response.ok) {
                    console.log('Error retrieving data');
                    return;
                }

                const result = await response.json();
                setSeatNum(result.seatNum);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchSeatNumber();
    }, [])

    const showDepartmentPopup = () => {
        toggleDepartmentPopup(!departmentpopup);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/departments/show');
                if (!response.ok) {
                    console.log('Error retreiving data');
                }

                const result = await response.json();
                setDepartments(result);
            } catch (error) {
                console.log('Error occured: ', error);
            }
        };

        fetchData();
    }, []);
    
    const showStdPopup = () => {
        toggleStdPopup(!stdpopup)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/students/show');
                if (!response.ok) {
                    console.log('Error retrieving data:');
                }

                const result = await response.json();
                setStudents(result);

            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchData();
    }, []);

    const showRoomPopup = () => {
        toggleRoomPopup(!stdpopup)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/rooms/show');
                if (!response.ok) {
                    console.log('Error retrieving data:');
                }

                const result = await response.json();
                setRooms(result);

            } catch (error) {
                console.log('Error occured: ', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <Navbar />

            <div className='home-page'>
                <div className='info-box' onClick={showDepartmentPopup}>
                    <h2>Departments: {departmentNum}</h2>
                </div>
                <div className='info-box' onClick={showStdPopup}>
                    <h2>Students: {stdNum}</h2>
                </div>
                <div className='info-box' onClick={showRoomPopup}>
                    <h2>Rooms: {roomNum}</h2>
                </div>
                <Link to='/seats' className='info-box'>
                    <h2>Allocated Seats: {seatNum}</h2>
                </Link>

            </div>

            {departmentpopup && (
                <div className='popup-overlay'>
                    <div className='description-popup'>
                        <div className='close-div'>
                            <button onClick={() => toggleDepartmentPopup(false)} className="close-btn">
                                &times;
                            </button>
                        </div>

                        <div className='description-list'>
                            <ul>
                                <li className='description-list-header'>
                                    <span className='col'>Department Name</span>
                                </li>
                                {departments.map((item, index) => (
                                    <li key={item.department_id || index} className='department-listitem'>
                                        {item.name ? item.name : <span style={{ color: "red" }}>MISSING NAME</span>}

                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )

            }

            {stdpopup && (
                <div className='popup-overlay'>
                    <div className='description-popup'>
                        <div className='close-div'>
                            <button onClick={() => toggleStdPopup(false)} className="close-btn">
                                &times;
                            </button>
                        </div>

                        <div className='description-list'>
                            <ul>
                                <li className='description-list-header'>
                                    <span className='col'>Full Name</span>
                                    <span className='col'>Roll No</span>
                                    <span className='col'>Department</span>
                                    <span className='col'>Semester</span>
                                </li>
                                {students.map((item, index) => (
                                    <li key={item.roll_no || index} className='department-listitem'>
                                        <span className='col'>{item.full_name || <span style={{ color: 'red' }}>MISSING NAME</span>}</span>
                                        <span className='col'>{item.roll_no || <span style={{ color: 'red' }}>MISSING ROLLNO</span>}</span>
                                        <span className='col'>{item.department_name || <span style={{ color: 'red' }}>MISSING DEPARTMENT</span>}</span>
                                        <span className='col'>{item.semester || <span style={{ color: 'red' }}>MISSING SEMESTER</span>}</span>


                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )

            }

            {roomPopup && (
                <div className='popup-overlay'>
                    <div className='description-popup'>
                        <div className='close-div'>
                            <button onClick={() => toggleRoomPopup(false)} className="close-btn">
                                &times;
                            </button>
                        </div>

                        <div className='description-list'>
                            <ul>
                                <li className='description-list-header'>
                                    <span className='col'>Rooms</span>
                                </li>
                                {rooms.map((item, index) => (
                                    <li key={item.room_id || index} className='department-listitem'>
                                        {item.name ? item.name : <span style={{ color: "red" }}>MISSING ROOM</span>}

                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )

            }

        </div>
    )
}