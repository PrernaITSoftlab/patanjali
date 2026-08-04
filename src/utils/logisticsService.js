import {logistics} from '../data/marketplace';
import {normalizeUser,readOwnedCollection} from './accessControl';

export const LOGISTICS_SERVICE_KEY='logistics_service_listings';
export function getOwnerLogisticsServices(user){const owner=normalizeUser(user);if(!owner||owner.role!=='LOGISTICS_OWNER')return [];const saved=readOwnedCollection(LOGISTICS_SERVICE_KEY,owner);const seeded=logistics.filter(service=>service.businessId===owner.businessId||service.owner===owner.name);return [...saved,...seeded.filter(service=>!saved.some(x=>x.id===service.id))]}
