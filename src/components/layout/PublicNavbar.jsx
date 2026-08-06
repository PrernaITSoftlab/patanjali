import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {Menu,X} from 'lucide-react';
import Logo from '../common/Logo';
import {useAuth} from '../../context/AuthContext';
export default function PublicNavbar(){const [open,setOpen]=useState(false);const {user}=useAuth();const nav=useNavigate();return <header className="public-nav"><Logo/><button className="icon-btn mobile-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button><nav className={open?'nav-links open':'nav-links'}><Link to="/warehouses">Warehouses</Link><Link to="/logistics">Logistics</Link></nav><div className="nav-actions">{user?<button className="btn btn-dark" onClick={()=>nav(`/${user.role.toLowerCase().replaceAll('_','-')}/dashboard`)}>Dashboard</button>:<><Link className="btn btn-ghost" to="/login">Login</Link><Link className="btn btn-primary" to="/register">Register</Link></>}</div></header>}
