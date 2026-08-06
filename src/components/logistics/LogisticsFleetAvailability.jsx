import {useMemo,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {CheckCircle2,ChevronDown,ChevronUp,Clock3,MapPin,MessageSquare,Phone,Search,ShieldCheck,Truck,XCircle} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import {logistics} from '../../data/marketplace';
import {getPublicFleetVehicles} from '../../data/vehicleShowcase';
import {read,write} from '../../utils/storage';
import {useAuth} from '../../context/AuthContext';
import CustomerSidebarFilters,{SidebarFilterGroup} from '../customer/CustomerSidebarFilters';
import '../../styles/fleet-availability.css';

const isAvailable=vehicle=>vehicle.availability==='Available';

function AvailabilityEnquiry({provider,search,onClose}){
  const {user}=useAuth();
  const submit=event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const enquiry={
      id:`FLEET-ENQ-${Date.now()}`,
      customerId:user.id,
      owner:provider.owner,
      targetId:provider.id,
      targetType:'fleet-availability',
      targetName:provider.name,
      category:search.category,
      requiredQuantity:search.quantity,
      pickup:search.pickup,
      destination:search.destination,
      goods:data.get('goods'),
      preferredDate:data.get('preferredDate'),
      message:data.get('message'),
      status:'Submitted',
      createsBooking:false,
      createdAt:new Date().toISOString(),
    };
    write('enquiries',[enquiry,...read('enquiries',[])]);
    toast.success('Availability enquiry sent to the Logistics Owner');
    onClose();
  };
  return <Modal title={`Availability enquiry · ${provider.name}`} onClose={onClose}>
    <form className="modal-form fleet-enquiry" onSubmit={submit}>
      <div className="fleet-enquiry-summary">
        <span><small>Vehicle category</small><b>{search.category}</b></span>
        <span><small>Required quantity</small><b>{search.quantity} vehicles</b></span>
        <span><small>Route</small><b>{search.pickup} → {search.destination}</b></span>
      </div>
      <label>Goods or material<input name="goods" required /></label>
      <label>Preferred movement date<input name="preferredDate" type="date" required /></label>
      <label>Additional requirement<textarea name="message" minLength="20" required /></label>
      <button className="btn btn-primary btn-block"><MessageSquare /> Send Availability Enquiry</button>
      <small>This enquiry does not reserve or book a vehicle. Final availability, price and transportation terms are confirmed directly by the Logistics Owner.</small>
    </form>
  </Modal>;
}

function MatchingVehicles({provider,vehicles}){
  return <div className="matching-vehicle-grid">
    {vehicles.map(vehicle=><article key={vehicle.id}>
      <img src={vehicle.images?.[0]?.url} alt={`${vehicle.manufacturer} ${vehicle.model}`} />
      <div>
        <span className={isAvailable(vehicle)?'available':'unavailable'}>{vehicle.availability}</span>
        <h4>{vehicle.manufacturer} {vehicle.model}</h4>
        <p>{vehicle.category} · {vehicle.payload}</p>
        <small>{vehicle.registration} · Updated {new Date(vehicle.availabilityUpdatedAt).toLocaleDateString('en-IN')}</small>
        <Link to={`/customer/logistics/${provider.id}/vehicles/${vehicle.id}`}>View vehicle and photographs</Link>
      </div>
    </article>)}
  </div>;
}

export default function LogisticsFleetAvailability(){
  const navigate=useNavigate();
  const vehicles=useMemo(()=>getPublicFleetVehicles(),[]);
  const categories=useMemo(()=>[...new Set(vehicles.map(vehicle=>vehicle.category))].sort(),[vehicles]);
  const [search,setSearch]=useState(null);
  const [expanded,setExpanded]=useState(null);
  const [enquiry,setEnquiry]=useState(null);
  const emptyProviderFilters={match:'all',rating:'0',coverage:'all',gps:false,refrigerated:false,minAvailable:'',minFleet:'',maxRate:'',maxResponse:''};
  const [providerFilters,setProviderFilters]=useState(emptyProviderFilters);
  const results=useMemo(()=>{
    if(!search)return [];
    const pickup=search.pickup.toLowerCase(),destination=search.destination.toLowerCase();
    return logistics.map(provider=>{
      const owned=vehicles.filter(vehicle=>vehicle.providerId===provider.id&&vehicle.category===search.category);
      const available=owned.filter(isAvailable);
      const route=provider.route.toLowerCase();
      return {...provider,matchingVehicles:owned,availableVehicles:available,routeMatch:route.includes('pan india')||(route.includes(pickup)&&route.includes(destination)),fullMatch:available.length>=search.quantity};
    }).filter(provider=>provider.matchingVehicles.length>0&&provider.routeMatch)
      .sort((a,b)=>Number(b.fullMatch)-Number(a.fullMatch)||b.availableVehicles.length-a.availableVehicles.length);
  },[search,vehicles]);
  const filteredResults=useMemo(()=>results.filter(provider=>{
    const route=provider.route.toLowerCase();
    const rate=Number(String(provider.price).replace(/[^\d.]/g,''));
    const responseMinutes=Number(String(provider.response).replace(/[^\d.]/g,''));
    const refrigerated=provider.vehicles?.some(vehicle=>vehicle.toLowerCase().includes('refrigerated'));
    const coverageMatch=providerFilters.coverage==='all'||
      (providerFilters.coverage==='local'&&route.includes('local'))||
      (providerFilters.coverage==='intercity'&&route.includes('â†’'))||
      (providerFilters.coverage==='national'&&route.includes('pan india'));
    return (providerFilters.match==='all'||(providerFilters.match==='full'&&provider.fullMatch)||(providerFilters.match==='partial'&&!provider.fullMatch))&&
      provider.rating>=Number(providerFilters.rating)&&coverageMatch&&
      (!providerFilters.gps||provider.gps)&&(!providerFilters.refrigerated||refrigerated)&&
      (!providerFilters.minAvailable||provider.availableVehicles.length>=Number(providerFilters.minAvailable))&&
      (!providerFilters.minFleet||provider.fleet>=Number(providerFilters.minFleet))&&
      (!providerFilters.maxRate||rate<=Number(providerFilters.maxRate))&&
      (!providerFilters.maxResponse||responseMinutes<=Number(providerFilters.maxResponse));
  }),[results,providerFilters]);
  const activeFilterCount=Number(providerFilters.match!=='all')+Number(providerFilters.rating!=='0')+
    Number(providerFilters.coverage!=='all')+Number(providerFilters.gps)+Number(providerFilters.refrigerated)+
    Number(Boolean(providerFilters.minAvailable))+Number(Boolean(providerFilters.minFleet))+
    Number(Boolean(providerFilters.maxRate))+Number(Boolean(providerFilters.maxResponse));
  const submit=event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    setExpanded(null);
    setSearch({category:data.get('category'),quantity:Number(data.get('quantity')),pickup:data.get('pickup').trim(),destination:data.get('destination').trim()});
  };
  return <div className="role-page fleet-search-page">
    <CustomerSidebarFilters service="logistics" activeCount={activeFilterCount} onClear={()=>setProviderFilters(emptyProviderFilters)}>
      <SidebarFilterGroup title="Requirement match"><label><input type="radio" name="provider-match" checked={providerFilters.match==='all'} onChange={()=>setProviderFilters(current=>({...current,match:'all'}))}/><span>All matching providers</span></label><label><input type="radio" name="provider-match" checked={providerFilters.match==='full'} onChange={()=>setProviderFilters(current=>({...current,match:'full'}))}/><span>Full availability only</span></label><label><input type="radio" name="provider-match" checked={providerFilters.match==='partial'} onChange={()=>setProviderFilters(current=>({...current,match:'partial'}))}/><span>Partial availability only</span></label></SidebarFilterGroup>
      <SidebarFilterGroup title="Transport coverage"><select value={providerFilters.coverage} onChange={event=>setProviderFilters(current=>({...current,coverage:event.target.value}))}><option value="all">All route coverage</option><option value="local">Local / city transport</option><option value="intercity">Intercity routes</option><option value="national">Pan-India interstate</option></select></SidebarFilterGroup>
      <SidebarFilterGroup title="Customer rating"><select value={providerFilters.rating} onChange={event=>setProviderFilters(current=>({...current,rating:event.target.value}))}><option value="0">All ratings</option><option value="4">4.0 and above</option><option value="4.5">4.5 and above</option><option value="4.8">4.8 and above</option></select></SidebarFilterGroup>
      <SidebarFilterGroup title="Fleet availability"><label>Minimum vehicles available<input type="number" min="0" placeholder="Any quantity" value={providerFilters.minAvailable} onChange={event=>setProviderFilters(current=>({...current,minAvailable:event.target.value}))}/></label></SidebarFilterGroup>
      <SidebarFilterGroup title="Provider fleet size"><label>Minimum total fleet<input type="number" min="0" placeholder="Any fleet size" value={providerFilters.minFleet} onChange={event=>setProviderFilters(current=>({...current,minFleet:event.target.value}))}/></label></SidebarFilterGroup>
      <SidebarFilterGroup title="Transport rate"><label>Maximum rate per kilometre<input type="number" min="0" placeholder="Any rate" value={providerFilters.maxRate} onChange={event=>setProviderFilters(current=>({...current,maxRate:event.target.value}))}/></label></SidebarFilterGroup>
      <SidebarFilterGroup title="Response time"><select value={providerFilters.maxResponse} onChange={event=>setProviderFilters(current=>({...current,maxResponse:event.target.value}))}><option value="">Any response time</option><option value="10">Within 10 minutes</option><option value="20">Within 20 minutes</option><option value="30">Within 30 minutes</option></select></SidebarFilterGroup>
      <SidebarFilterGroup title="Vehicle capabilities"><label><input type="checkbox" checked={providerFilters.gps} onChange={event=>setProviderFilters(current=>({...current,gps:event.target.checked}))}/><span>GPS-supported fleet</span></label><label><input type="checkbox" checked={providerFilters.refrigerated} onChange={event=>setProviderFilters(current=>({...current,refrigerated:event.target.checked}))}/><span>Refrigerated / cold-chain vehicles</span></label></SidebarFilterGroup>
    </CustomerSidebarFilters>
    <section className="fleet-search-hero">
      <div><small>INDIVIDUAL VEHICLE AVAILABILITY</small><h2>Find a fleet that matches your requirement</h2><p>Quantities are calculated from approved, published vehicle records and the owner’s latest availability status.</p></div><Truck />
    </section>
    <form className="fleet-search-form" onSubmit={submit}>
      <label><span>Vehicle category</span><select name="category" required defaultValue="22-Foot Truck">{categories.map(category=><option key={category}>{category}</option>)}</select></label>
      <label><span>Required quantity</span><input name="quantity" type="number" min="1" step="1" defaultValue="15" required /></label>
      <label><span>Pickup location</span><div><MapPin /><input name="pickup" placeholder="e.g. Delhi" required /></div></label>
      <label><span>Destination</span><div><MapPin /><input name="destination" placeholder="e.g. Ahmedabad" required /></div></label>
      <button className="btn btn-primary"><Search /> Search Providers</button>
    </form>
    <div className="fleet-rule-note"><ShieldCheck /><p><b>Discovery and enquiry only.</b> Displayed availability does not reserve a vehicle. Final availability, price, agreement, payment and transport confirmation take place directly with the Logistics Owner.</p></div>
    {search&&<section className="fleet-results">
      <header><div><small>SEARCH RESULTS</small><h3>{filteredResults.length} providers with matching published vehicles</h3><p>{search.quantity} × {search.category} · {search.pickup} → {search.destination}</p></div><div><span className="full-dot"/> Full availability <span className="partial-dot"/> Partial availability</div></header>
      {filteredResults.length===0?<div className="empty-state"><Truck /><h2>No matching provider found</h2><p>Try a different route or clear one or more sidebar filters. No unavailable or unpublished vehicle has been counted.</p></div>:filteredResults.map(provider=>{
        const visible=expanded===provider.id;
        return <article className={`fleet-provider-result ${provider.fullMatch?'full-match':'partial-match'}`} key={provider.id}>
          <div className="fleet-provider-main">
            <img src={provider.image} alt={provider.name} />
            <div className="fleet-provider-copy"><span><ShieldCheck /> Approved Logistics Provider</span><h3>{provider.name}</h3><p><MapPin /> {provider.route}</p><small><Clock3 /> Availability based on latest vehicle status updates</small></div>
            <div className="fleet-count"><span><small>Matching owned</small><b>{provider.matchingVehicles.length}</b></span><span><small>Currently available</small><b>{provider.availableVehicles.length}</b></span><span><small>Required</small><b>{search.quantity}</b></span></div>
            <div className="fleet-match-state">{provider.fullMatch?<><CheckCircle2 /><b>Full availability</b><small>Can meet the requested quantity</small></>:<><XCircle /><b>Partial availability</b><small>{Math.max(0,search.quantity-provider.availableVehicles.length)} more vehicles required</small></>}</div>
          </div>
          <footer>
            <button className="btn btn-secondary btn-sm" onClick={()=>setExpanded(visible?null:provider.id)}>{visible?<ChevronUp/>:<ChevronDown/>}{visible?'Hide':'View'} Matching Vehicles</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>navigate(`/logistics/${provider.id}`)}><Phone /> Contact Provider</button>
            <button className="btn btn-primary btn-sm" onClick={()=>setEnquiry(provider)}><MessageSquare /> Send Availability Enquiry</button>
          </footer>
          {visible&&<MatchingVehicles provider={provider} vehicles={provider.matchingVehicles}/>} 
        </article>;
      })}
    </section>}
    {!search&&<section className="fleet-search-empty"><Truck /><h3>Enter an exact fleet requirement</h3><p>Full-match providers will appear first, followed by providers that can fulfil only part of the requested quantity.</p></section>}
    {enquiry&&<AvailabilityEnquiry provider={enquiry} search={search} onClose={()=>setEnquiry(null)}/>} 
  </div>;
}
