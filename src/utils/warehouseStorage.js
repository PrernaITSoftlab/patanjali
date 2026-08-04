import {read,write} from './storage';
import {appendOwnedRecord,readOwnedCollection,scopedKey} from './accessControl';

export const WAREHOUSE_KEYS={draft:'warehouse_draft',listings:'warehouse_listings',verification:'warehouse_verification_requests',ownerNotifications:'warehouse_owner_notifications',systemNotifications:'system_owner_notifications'};
export const loadWarehouseDraft=user=>read(scopedKey(WAREHOUSE_KEYS.draft,user),null);
export const saveWarehouseDraft=(draft,user)=>{const saved={...draft,lastSavedAt:new Date().toISOString()};write(scopedKey(WAREHOUSE_KEYS.draft,user),saved);return saved;};
export const clearWarehouseDraft=user=>localStorage.removeItem(`trustlogix:${scopedKey(WAREHOUSE_KEYS.draft,user)}`);
export const getOwnerWarehouses=user=>readOwnedCollection(WAREHOUSE_KEYS.listings,user);
export function submitWarehouseListing(data,user){const now=new Date().toISOString();const listing=appendOwnedRecord(WAREHOUSE_KEYS.listings,{...data,id:`WH-${Date.now()}`,status:'Verification Pending',listingStatus:'Unpublished',publicVisible:false,submittedAt:now},user);appendOwnedRecord(WAREHOUSE_KEYS.verification,{id:`VR-${Date.now()}`,warehouseId:listing.id,warehouseName:data.basic.name,status:'Verification Pending',submittedAt:now},user);appendOwnedRecord(WAREHOUSE_KEYS.ownerNotifications,{id:Date.now(),message:'Warehouse submitted for TrustLogix verification.',createdAt:now,read:false},user);write(WAREHOUSE_KEYS.systemNotifications,[{id:Date.now()+1,ownerId:user.id,businessId:user.businessId,message:`New warehouse verification request: ${data.basic.name}`,createdAt:now,read:false},...read(WAREHOUSE_KEYS.systemNotifications,[])]);clearWarehouseDraft(user);return listing;}
