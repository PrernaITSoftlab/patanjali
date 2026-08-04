import {useState} from 'react';
import {Heart,MapPin,Star,ShieldCheck,GitCompare,ArrowUpRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import toast from 'react-hot-toast';
import {read,write} from '../../utils/storage';

const indianNumber=new Intl.NumberFormat('en-IN');
const rentableArea=capacity=>Number(String(capacity).replace(/[^\d.]/g,''));

function WarehousePrice({item}){
  const availableRentableArea=rentableArea(item.capacity);
  const totalMonthlyPrice=availableRentableArea*item.price;
  return <div className="warehouse-card-price">
    <div className="warehouse-price-row"><small>Rate:</small><span><strong>₹{indianNumber.format(item.price)}</strong> per sq. ft./month</span></div>
    <div className="warehouse-price-row"><small>Total monthly price:</small><span><strong>₹{indianNumber.format(totalMonthlyPrice)}</strong>/month</span></div>
  </div>;
}

export default function ListingCard({item,type='warehouse',onCompare}){
  const [saved,setSaved]=useState(()=>read('saved',[]).includes(item.id));
  const toggle=()=>{const a=read('saved',[]);const n=saved?a.filter(x=>x!==item.id):[...a,item.id];write('saved',n);setSaved(!saved);toast.success(saved?'Removed from saved':'Saved for later')};
  return <article className="listing-card"><div className="listing-image"><img src={item.image} alt={item.name} loading="lazy"/><span className="image-badge"><ShieldCheck size={14}/> {item.tag||'Verified'}</span><button onClick={toggle} className={`heart ${saved?'active':''}`} aria-label="Save listing"><Heart size={19} fill={saved?'currentColor':'none'}/></button></div><div className="listing-body"><div className="listing-meta"><span>{type==='warehouse'?item.type:item.vehicle}</span><b><Star size={14} fill="currentColor"/> {item.rating} <small>({item.reviews})</small></b></div><h3>{item.name}</h3><p><MapPin size={15}/>{type==='warehouse'?`${item.area}, ${item.city}`:item.route}</p><div className="trust-row"><span className="trust-score">{item.score}</span><div><b>Excellent trust score</b><small>Identity & facility checks</small></div></div>{item.facilities&&<div className="facility-list">{item.facilities.slice(0,3).map(x=><span key={x}>{x}</span>)}</div>}<div className={`listing-footer${type==='warehouse'?' warehouse-price-footer':''}`}>{type==='warehouse'?<WarehousePrice item={item}/>:<div><small>Starting from</small><strong>{item.price}</strong><small> {item.unit}</small></div>}<div className="card-actions"><button className="icon-btn" onClick={()=>onCompare?.(item)} aria-label="Compare"><GitCompare size={18}/></button><Link className="btn btn-primary btn-sm" to={`/${type}/${item.id}`}>View details <ArrowUpRight size={15}/></Link></div></div></div></article>;
}
