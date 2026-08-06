export function getClassification(item, type = 'warehouse') {
  if (type === 'warehouse') {
    const verified = item.facilities || [];
    const advanced = ['WMS', 'Cold Storage', 'Temperature Control', 'Loading dock', 'Fire safety', 'Power backup', 'Insurance'];
    const stars = item.facilityStars ?? Math.min(5, 2 + advanced.filter(capability => verified.includes(capability)).length);
    return {stars, label: 'Facility Standard', name: `${stars}-Star Warehouse`, note: 'Based on verified warehouse amenities'};
  }
  const checks = [item.gps, (item.vehicles?.length || 0) > 1, (item.fleet || 0) >= 50, item.vehicle?.includes('Refrigerated')];
  const stars = item.capabilityStars ?? Math.min(5, 2 + checks.filter(Boolean).length);
  return {stars, label: 'Service Capability', name: `${stars}-Star Logistics Provider`, note: 'Based on verified service capabilities'};
}
