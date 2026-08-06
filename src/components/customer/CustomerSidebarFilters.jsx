import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {Link} from 'react-router-dom';
import {ChevronDown,ChevronLeft,Search,SlidersHorizontal,Truck,Warehouse} from 'lucide-react';
import '../../styles/customer-sidebar-filters.css';

export default function CustomerSidebarFilters({service,activeCount=0,onClear,children}){
  const [target,setTarget]=useState(null);
  const [optionQuery,setOptionQuery]=useState('');
  useEffect(()=>{setTarget(document.getElementById('customer-sidebar-middle'));return()=>setTarget(null)},[]);
  useEffect(()=>{
    if(!target)return;
    const query=optionQuery.trim().toLowerCase();
    target.querySelectorAll('.sidebar-filter-group label').forEach(label=>{
      label.hidden=Boolean(query)&&!label.textContent.toLowerCase().includes(query);
    });
  },[optionQuery,target,children]);
  if(!target)return null;
  return createPortal(<div className="customer-sidebar-filters">
    <Link className="sidebar-back" to="/customer/dashboard"><ChevronLeft/> Marketplace Home</Link>
    <div className="sidebar-service-switch">
      <Link className={service==='warehouse'?'active':''} to="/customer/warehouses"><Warehouse/> Warehouses</Link>
      <Link className={service==='logistics'?'active':''} to="/customer/logistics"><Truck/> Logistics</Link>
    </div>
    <header><span><SlidersHorizontal/><b>Select Filters</b></span>{activeCount>0&&<em>{activeCount} applied</em>}</header>
    <label className="sidebar-option-search"><Search aria-hidden="true"/><input value={optionQuery} onChange={event=>setOptionQuery(event.target.value)} placeholder="Search within filters" aria-label="Search within filters"/></label>
    <div className="sidebar-filter-scroll">{children}</div>
    <button className="sidebar-clear-filters" onClick={onClear}>Clear all filters</button>
  </div>,target);
}

export function SidebarFilterGroup({title,children,defaultOpen=true}){
  return <details className="sidebar-filter-group" open={defaultOpen}><summary><h3>{title}</h3><ChevronDown aria-hidden="true"/></summary><div>{children}</div></details>;
}
