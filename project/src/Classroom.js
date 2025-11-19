import { useState, useEffect } from 'react';
import './classroom.css';

export default function Classroom({room}) {
  const [addStd, toggleAddStd] = useState(false);
  const [step, setStep] = useState(1);

  const [stdName, setStdName] = useState('');
  const [stdCMS, setStdCMS] = useState('');
  const [stdDepartment, setStdDepartment] = useState('');
  const [stdSemester, setStdSemester] = useState('');

  const [departmentFetch, setDepartmentFetch] = useState([]);
  const [stdFetch, setStdFetch] = useState([]);

  const [departmentId,setDepartmentId] = useState('');

  const rows = 4;
  const cols = 10;
  const totalSeats = rows * cols;

  const seats = Array.from({ length: totalSeats }, (_, index) => ({
    id: `seat-${index + 1}`,
  }));

  const [selectedSeat, setSelectedSeat] = useState('');

  const nextButton = () => {
    setStep((prev) => prev + 1); 
  };

  const prevButton = () => {
    setStep((prev) => prev - 1); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/departments/show');
        if (!response.ok) {
          console.log('Error retrieving data');
          return;
        }

        const result = await response.json();
        setDepartmentFetch(result);
      } catch (error) {
        console.log('Error occurred: ', error);
      }
    };

    fetchData();
  }, []);

  const selectDepartment = async () => {
  try {
    const response = await fetch('http://localhost:5000/students/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stdDepartment, stdSemester })
    });

    const result = await response.json();

    setDepartmentId(result.departmentId);
    setStdSemester(result.stdSemester);

  } catch (error) {
    console.log('Error occured: ', error);
  }

  setStep((prev) => prev + 1);
};


useEffect(() => {
  if (step !== 2) return;
  if (!departmentId || !stdSemester) return;

  const fetchStd = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/departments/students?departmentId=${departmentId}&semester=${stdSemester}`
      );

      if (!response.ok) {
        console.log('Error retrieving data');
        return;
      }

      const result = await response.json();
      setStdFetch(result.students);
      
    } catch (error) {
      console.log('Error occurred:', error);
    }
  };

  fetchStd();
  }, [step, departmentId, stdSemester]);

  useEffect(() => {
  }, [stdFetch]);

  const selectCMS  = async (e) => {
    const student_name = e.target.value;
    setStdName(student_name);
    try {
      const response = await fetch('http://localhost:5000/students/cms', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({departmentId, student_name})
      })

      const result = await response.json();
      setStdCMS(result.cms);
    } catch (error) {
      console.log('Error occured: ', error);
    }
  }

  useEffect(() => {
  }, [stdCMS])
  useEffect(() => {
  }, [selectedSeat])

  const placeButton = async () => {
    try {
      const response = await fetch('http://localhost:5000/place/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({room,departmentId,stdCMS,selectedSeat})
      })

      const result = await response.json();
    } catch (error) {
      console.log('Error occured: ', error);
    }

    toggleAddStd(false);
  }

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('http://localhost:5000/place/show', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        })

        const result = response.json();
        console.log(result);
      } catch (error) {
        console.log('Error occured: ', error);
      }
    }

    fetchSeats();
  }, [])

  return (
    <div className="main-classroom">
      <div className="classroom-parent">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div className="class-row" key={`row-${rowIndex}`}>
            {seats
              .slice(rowIndex * cols, rowIndex * cols + cols)
              .map((seat) => (
                <div
                  key={seat.id}
                  id={seat.id}
                  className="class-seat"
                  onClick={() => {
                    setSelectedSeat(seat.id);
                    toggleAddStd(true);
                    setStep(1);
                  }}
                >
                  {seat.id}
                </div>
              ))}
          </div>
        ))}
      </div>

      {addStd && (
        <div className="popup-overlay">
          <div className="addStd-popup">
            <div className="close-div">
              <button
                onClick={() => toggleAddStd(false)}
                className="close-btn"
              >
                &times;
              </button>
            </div>

            {step === 1 && (
              <>
                <h2>Department & Semester</h2>
                <select name="departments" required className="department-dropdown" onChange={(e) => setStdDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departmentFetch.map((dptmt) => (
                    <option
                      key={dptmt.department_id}
                      value={dptmt.name}
                    >
                      {dptmt.name}
                    </option>
                  ))}
                </select>

                <div className="add-std-div">
                  <input placeholder="Semester" value={stdSemester}
                  onChange={(e) => setStdSemester(e.target.value)}/>
                </div>

                <button className="add-btn" onClick={selectDepartment}>
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Student Credentials</h2>
                <select className='student-dropdown' onChange={selectCMS}>
                  {stdFetch.map((student, index) => (
                    <option key={index} value={student.full_name}>
                      {student.full_name}
                    </option>
                  ))}
                </select>


                <p><strong>CMS ID:</strong> {stdCMS}</p>

                <div className="btn-group">
                  <button onClick={prevButton}>Back</button>
                  <button onClick={nextButton}>Next</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3>Confirm Details</h3>
                <p><strong>Department:</strong> {stdDepartment}</p>
                <p><strong>Student Name:</strong> {stdName}</p>
                <p><strong>CMS ID:</strong> {stdCMS}</p>

                <div className="btn-group">
                  <button onClick={prevButton}>Back</button>
                  <button onClick={placeButton}>
                    Place
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
