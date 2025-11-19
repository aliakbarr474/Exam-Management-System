import { useNavigate } from 'react-router-dom';
import './loginsignup.css'
import { useState } from 'react'
import Swal from 'sweetalert2'

export default function Signup(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username,password})
            });

            const data = await response.json();
            Swal.fire({
                      title: "Account Created Successfully!",
                      icon: "success"
                    });
        } catch (error) {
            console.log(`Error occured: ${error}`);
        }


        setUsername('');
        setPassword('');

        navigate('/home');
    }

    return (
        <div className='main'>
            <div className='main-login'>
                <h1>Signup</h1>
                
                <div className='form-container'>
                    
                    <div className='input-container'>
                        <div className='input-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                        </div>
    
                        <input placeholder='username' type='text'
                        onChange={(e) => setUsername(e.target.value)} value={username}></input>                        
                    </div>

                    <div className='input-container'>
                        <div className='input-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                        </div>
    
                        <input placeholder='password' type='password'
                        onChange={(e) => setPassword(e.target.value)} value={password}></input>                        
                    </div>

                    <button onClick={handleSubmit}>Signup</button>  
                    
                </div>
            </div>
        </div>
    )
}