import {read, write} from './storage';

const KEY = 'customer_auth_intent';

export function saveAuthIntent(returnTo, action = 'view-complete-details') {
  const intent = {returnTo, action, createdAt: Date.now()};
  write(KEY, intent);
  return intent;
}

export function getAuthIntent() {
  const intent = read(KEY, null);
  if (!intent || Date.now() - intent.createdAt > 30 * 60 * 1000) return null;
  return intent;
}

export function clearAuthIntent() {
  localStorage.removeItem(`trustlogix:${KEY}`);
}
