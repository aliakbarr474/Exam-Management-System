import './navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar(){

    function showSidebar(){
        const sidebar = document.querySelector('.sidebar')
        sidebar.style.display = 'flex'
    }

    function hideSidebar(e){
        e.preventDefault();

        const sidebar = document.querySelector('.sidebar')
        sidebar.style.display = 'none'
    }

    return (
        <div className='navbar'>
            
           <nav>
                <ul className="sidebar">
                    <li onClick = {hideSidebar}><a href = "/" className='x-logo'><svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#F7C986"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
                    <li><Link to='/departments'>Departments</Link></li>
                    <li><Link to='/students'>Students</Link></li>
                    <li><Link to='/seats'>Seats</Link></li>
                </ul>

                <li onClick = {showSidebar} className = "menuBtn"><a href = "#"><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#F7C986"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>

                <ul>
                    
                    <li><Link to='/departments'>Departments</Link></li>
                    <li><Link to='/students'>Students</Link></li>
                    <li><Link to='/seats'>Seats</Link></li>
                </ul>
           </nav>

        </div>
    )
}