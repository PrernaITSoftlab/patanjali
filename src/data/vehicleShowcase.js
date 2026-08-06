import {logistics} from './marketplace';
import {read} from '../utils/storage';

const vehicleImages=[
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=1200&q=85',
];

const manufacturers=['Tata','Ashok Leyland','BharatBenz','Eicher'];
const states=['MH','DL','KA','MP'];

// Demo fleet seed: each array entry is a distinct vehicle record. Marketplace
// totals are never used by the search UI; provider quantities are reduced from
// these records after public-status filtering.
export const seededVehicles=logistics.flatMap(provider=>
  Array.from({length:provider.fleet},(_,index)=>{
    const category=provider.vehicles[index%provider.vehicles.length];
    const manufacturer=manufacturers[index%manufacturers.length];
    return {
      id:`${provider.id}-V${index+1}`,
      providerId:provider.id,
      providerName:provider.name,
      category,
      manufacturer,
      model:`${category.replace(' Truck','')} Pro ${index+1}`,
      year:2021+(index%5),
      bodyType:category.includes('Refrigerated')?'Refrigerated':'Closed Body',
      payload:provider.payload,
      availability:index%4===3?'Temporarily Unavailable':'Available',
      availabilityUpdatedAt:new Date(2026,6,24+(index%10)).toISOString(),
      status:'Approved',
      listingStatus:'Published',
      publicVisible:true,
      active:true,
      gps:provider.gps,
      refrigerated:category.includes('Refrigerated'),
      goods:['FMCG Products','Packaged Goods','Industrial Materials'],
      services:['Intercity Transportation','Full Truckload'],
      price:provider.price,
      pricingUnit:'Estimated starting rate',
      registration:`${states[index%states.length]} ${String(10+(index%89)).padStart(2,'0')} ** ****`,
      images:vehicleImages.map((url,imageIndex)=>({
        url,
        category:['Cover Image','Front View','Side View','Cargo Area'][imageIndex],
        caption:`${category} ${['exterior','front profile','side profile','cargo area'][imageIndex]}`,
      })),
    };
  })
);

const normalizeSavedVehicle=vehicle=>{
  const provider=logistics.find(item=>item.id===vehicle.providerId||item.owner===vehicle.owner||item.company===vehicle.basic?.company);
  if(!provider)return null;
  const cover=vehicle.media?.images?.find(image=>image.cover)||vehicle.media?.images?.[0];
  return {
    ...vehicle,
    providerId:provider.id,
    providerName:provider.name,
    category:vehicle.category||vehicle.basic?.category,
    manufacturer:vehicle.manufacturer||vehicle.basic?.manufacturer,
    model:vehicle.model||vehicle.basic?.model,
    bodyType:vehicle.bodyType||vehicle.basic?.bodyType,
    payload:vehicle.payload||`${vehicle.capacity?.payload||''} ${vehicle.capacity?.payloadUnit||''}`.trim(),
    availability:vehicle.availability||vehicle.pricing?.availability,
    availabilityUpdatedAt:vehicle.availabilityUpdatedAt||vehicle.pricing?.lastUpdated||vehicle.submittedAt,
    active:vehicle.active!==false&&vehicle.pricing?.availability!=='Inactive',
    images:vehicle.images||vehicle.media?.images?.map(image=>({...image,url:image.url}))||(cover?[cover]:[]),
  };
};

export function getPublicFleetVehicles(){
  const ownerVehicles=read('vehicle_showcase_listings',[]).map(normalizeSavedVehicle).filter(Boolean);
  return [...seededVehicles,...ownerVehicles].filter(vehicle=>
    vehicle.status==='Approved'&&
    vehicle.listingStatus==='Published'&&
    vehicle.publicVisible===true&&
    vehicle.active!==false
  );
}
