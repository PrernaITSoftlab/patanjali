import {Plus,Truck} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import ListingCard from '../common/ListingCard';
import {getOwnerLogisticsServices} from '../../utils/logisticsService';

export default function LogisticsServicesPage(){const {user}=useAuth();const services=getOwnerLogisticsServices(user);return <div className="role-page module-page"><div className="module-title"><div><span>TRUSTLOGIX / LOGISTICS OWNER</span><h2>Logistics services</h2><p>Manage your own routes, vehicle coverage and listing visibility.</p></div><div><Link className="btn btn-primary logistics-create-action" to="/logistics-owner/services/add"><Truck/><span>Add New Service</span></Link></div></div>{services.length?<div className="module-listing-grid">{services.map(service=><ListingCard key={service.id} item={service} type="logistics"/>)}</div>:<section className="empty-state"><Truck/><h2>No logistics services yet</h2><p>Create your first customer-facing service listing.</p><Link className="btn btn-primary" to="/logistics-owner/services/add"><Plus/> Add New Service</Link></section>}</div>}
