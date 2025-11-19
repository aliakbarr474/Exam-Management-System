import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Departments from './Departments';
import Students from './Students';
import Seats from './Seats';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/home' element={<Home />}/>
              <Route path="*" element={<Navigate to="/login" />} />
            <Route path='/departments' element={<Departments />} />
            <Route path='/students' element={<Students />} />
            <Route path='/seats' element={<Seats />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
