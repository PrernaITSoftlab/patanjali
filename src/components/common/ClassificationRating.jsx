import {getClassification} from '../../utils/listingRatings';

export default function ClassificationRating({item, type = 'warehouse', compact = false}) {
  const value = getClassification(item, type);
  return <div className={`classification-rating${compact ? ' compact' : ''}`} aria-label={`${value.label}: ${value.stars} out of 5 stars`}>
    <div><b>{value.label}</b><span className="classification-stars" aria-hidden="true">{'★'.repeat(value.stars)}<i>{'★'.repeat(5-value.stars)}</i></span></div>
    <strong>{value.name}</strong><small>{value.note}</small>
  </div>;
}
