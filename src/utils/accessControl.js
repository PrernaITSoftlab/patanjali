import {read,readAll,write} from './storage';

const ROLE_PREFIX={SYSTEM_OWNER:'sys',WAREHOUSE_OWNER:'wh',LOGISTICS_OWNER:'log',CUSTOMER:'cus'};
export function normalizeUser(user){if(!user)return null;const prefix=ROLE_PREFIX[user.role]||'usr';const stable=(user.email||user.name||prefix).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');return {...user,id:user.id||`${prefix}-${stable}`,businessId:user.businessId||(user.role.endsWith('_OWNER')?`biz-${stable}`:null)}}
export const isSystemOwner=user=>user?.role==='SYSTEM_OWNER';
export const ownsRecord=(user,record)=>isSystemOwner(user)||Boolean(user&&record&&(record.ownerId===user.id||record.businessId===user.businessId));
export const readOwnedCollection=(key,user)=>{const normalized=normalizeUser(user||read('user',null));return read(key,[]).filter(record=>ownsRecord(normalized,record))};
export const readAllForSystem=(key,user)=>isSystemOwner(user)?readAll(key,[]):[];
export const appendOwnedRecord=(key,record,user)=>{const normalized=normalizeUser(user||read('user',null));if(!normalized?.id||!normalized?.businessId||!normalized.role.endsWith('_OWNER'))throw new Error('An authenticated business owner is required.');const owned={...record,ownerId:normalized.id,businessId:normalized.businessId};write(key,[owned,...readAll(key,[])]);return owned};
export const updateAuthorizedRecord=(key,id,changes,user)=>{const records=readAll(key,[]),record=records.find(x=>x.id===id);if(!record||!ownsRecord(normalizeUser(user),record))return false;write(key,records.map(x=>x.id===id?{...x,...changes}:x));return true};
export const publicListings=key=>read(key,[]).filter(x=>x.status==='Approved'&&x.listingStatus==='Published'&&x.publicVisible===true);
export const scopedKey=(key,user)=>{const normalized=normalizeUser(user||read('user',null));return `${key}:${normalized?.businessId||normalized?.id||'anonymous'}`};
