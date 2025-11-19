const express = require("express");
const cors = require("cors");
let mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",   
  database: "exam" 
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});


app.post('/signup', (req, res) => {  
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username or Password missing' });
  }

  const sql = 'INSERT INTO users (username,password) VALUES (?,?)';
  db.query(sql,[username,password], (err, result) => {
    if (err) {
        console.log('Error inserting data: ', err);
        return res.status(500).json({message: 'Database Error'})
    }
  })

  res.json({ message: "User Registered successfully!" });
});

app.post('/login', (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: 'Invalid Username or Password'});
  }

  const sql1 = 'SELECT username FROM users WHERE username = ? AND password = ?';
  db.query(sql1, [username,password], async (err,result) => {
    if (err) {
      console.log('Error finding user: ', err);
      return res.status(500).json({message: 'Database Error'});
    }

    if (result.length === 0) {
      return res.status(401).json({message:'User not found'});
    } else {
      return res.status(200).json({message: 'Login Successful'});
    }
  })
})

app.post('/departments/add', (req, res) => {
  const { department } = req.body;
  const sql = 'INSERT INTO departments (name) VALUES (?)';

  db.query(sql, [department], (err, result) => {
    if (err) {
      console.log('Error inserting data: ', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({ insertId: result.insertId });
  });
});

app.get('/departments/show', (req,res) => {
  const sql = 'SELECT * FROM departments'
  db.query(sql,(err,result) => {
    if (err) {
      console.log('Error retreiving data');
      return res.status(400).json({message: 'Database Error'});
    }
    
    return res.status(200).json(result);
  })
})

app.delete('/departments/delete/:id', (req,res) => {
  const {id} = req.params;
  const sql = 'DELETE FROM departments WHERE department_id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log('Error deleting department:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  });
})

app.post('/students/add', (req, res) => {
  const { studentName, rollNo, semester, department } = req.body;

  const sql1 = 'SELECT department_id, name FROM departments WHERE name = ?';
  db.query(sql1, [department], (err, result) => {
    if (err) {
      console.log('Error retrieving department data:', err);
      return res.status(500).json({ message: 'Database Error' });
    }

    if (result.length > 0) {
      const { department_id, name: department_name } = result[0];
      const sql2 = 'INSERT INTO students (department_id, semester, roll_no, full_name) VALUES (?, ?, ?, ?)';
      db.query(sql2, [department_id, semester, rollNo, studentName], (err, results) => {
        if (err) {
          console.log('Error inserting data:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        return res.status(200).json({
          student_id: results.insertId,
          full_name: studentName,
          roll_no: rollNo,
          semester,
          department_name,
        });
      });
    } else {
      return res.status(400).json({ message: 'Department doesn’t exist' });
    }
  });
});

app.get('/students/show', (req,res) => {
   const sql = `
    SELECT 
      s.student_id,
      s.full_name,
      s.roll_no,
      s.semester,
      d.name AS department_name
    FROM students s
    JOIN departments d ON s.department_id = d.department_id
  `;

  db.query(sql,(err,result) => {
    if (err) {
      console.log('Error retreiving data: ', err);
      return res.status(400).json({message: 'Database error'})
    }

    return res.status(200).json(result);
  })
})

app.delete('/students/delete/:id', (req,res) => {
  const {id} = req.params;
  const sql = 'DELETE FROM students WHERE roll_no = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log('Error deleting student:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  });
})

app.post('/rooms/add', (req,res) => {
  const {name} = req.body;
  const sql = 'INSERT INTO rooms (name) VALUES (?)';

  db.query(sql,[name], (err,result) => {
    if (err) {
      console.log('Error occured: ', err);
      res.status(500).json({message:'Database error'});
    }

    res.status(200).json({
      room_id: result.insertId,
      name: name
    });
  })
})

app.get('/rooms/show', (req,res) => {
  const sql = 'SELECT * FROM rooms';

  db.query(sql,(err,result) => {
    if (err) {
      console.log('Error occured: ', err);
      res.status(500).json({message:'Database error'});
    }

    res.status(200).json(result)
  })
})

let departmentId = '';
let stdSemesterGet = '';

app.post('/students/departments', (req, res) => {
  const { stdDepartment,stdSemester } = req.body;
  const sql = 'SELECT department_id FROM departments WHERE name = ?';

  db.query(sql, [stdDepartment], (err, result) => {
    if (err) {
      console.log('Error finding department:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    departmentId = result[0].department_id;
    stdSemesterGet = stdSemester;

    return res.status(200).json({message: 'Department Found: ', 
      departmentId: departmentId,
      stdSemester: stdSemesterGet});
    
  });
});

app.get('/departments/students', (req, res) => {
  let { departmentId, semester } = req.query;
  semester = Number(semester);

  const sql = 'SELECT full_name FROM students WHERE department_id = ? AND semester = ?';

  db.query(sql, [departmentId, semester], (err, result) => {
    if (err) {
      console.log('Error finding students:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({ students: result });
  });
});

app.post('/students/cms', (req,res) => {
  let {departmentId,student_name} = req.body;
  
  const sql = 'SELECT roll_no FROM students WHERE department_id = ? AND full_name = ?';
  db.query(sql, [departmentId,student_name], (err,result) =>{
    if (err) {
      console.log('Error finding cms:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({cms: result[0].roll_no});
  })
})

app.post('/place/add', (req,res) => {
  const {room,departmentId,stdCMS,selectedSeat} = req.body;

  const sql1 = 'SELECT room_id FROM rooms WHERE name = ?';
  db.query(sql1, [room], (err,result) => {
    if (err) {
      console.log('Error finding room: ', err);
      return res.status(500).json({message: 'Database error'});
    }
    const room_id = result[0].room_id;
    
    const sql2 = 'SELECT student_id FROM students WHERE department_id = ? AND roll_no = ?';
    db.query(sql2, [departmentId,stdCMS], (err2,result2) => {
      if (err2) {
        console.log('Error finding student: ', err2);
        return res.status(500).json({message: 'Database error'});
      }
      const student_id = result2[0].student_id;

      const sql3 = 'INSERT INTO allocated_seats (room_id,seat_no,student_id) VALUES (?,?,?)';
      db.query(sql3, [room_id,selectedSeat,student_id], (err3,result3) => {
        if (err3) {
          console.log('Error inserting student: ', err3);
          return res.status(500).json({message: 'Database error'});
        }

        res.status(200).json({message: result3.insertId});
      })
    })
  })
})

app.get('/place/show', (req,res) => {
  const sql = 'SELECT * FROM allocated_seats';

  db.query(sql,(err,result) => {
    if (err) {
      console.log('Error fetching seats: ', err);
      return res.status(500).json({message: 'Database error'});
    }

    console.log(result);
    return res.status(200).json({message: result});
  })
})


app.listen(5000, () => console.log('server running on port 5000'))