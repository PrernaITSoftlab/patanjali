import { readAll, write } from "./storage";

export const CUSTOMER_PLANS = [
  { id: "customer-standard", code: "CUSTOMER_STANDARD", name: "Standard", price: 499, durationDays: 30, billingPeriod: "MONTHLY", description: "Essential contact access" },
  { id: "customer-pro", code: "CUSTOMER_PRO", name: "Pro", price: 999, durationDays: 30, billingPeriod: "MONTHLY", description: "Complete communication access", recommended: true },
  { id: "customer-premium", code: "CUSTOMER_PREMIUM", name: "Premium", price: 1499, durationDays: 30, billingPeriod: "MONTHLY", description: "Priority support and unlimited access" },
];

export const CONTACT_FEATURES = {
  VIEW_CONTACT_NUMBER: ["CUSTOMER_STANDARD", "CUSTOMER_PRO", "CUSTOMER_PREMIUM"],
  COPY_CONTACT_NUMBER: ["CUSTOMER_STANDARD", "CUSTOMER_PRO", "CUSTOMER_PREMIUM"],
  CALL_PROVIDER: ["CUSTOMER_PRO", "CUSTOMER_PREMIUM"],
  WHATSAPP_PROVIDER: ["CUSTOMER_PRO", "CUSTOMER_PREMIUM"],
  SEND_PROVIDER_ENQUIRY: ["CUSTOMER_PRO", "CUSTOMER_PREMIUM"],
};

export function getCustomerSubscription(customerId) {
  const subscriptions = readAll("customer_subscriptions", []);
  const subscription = subscriptions.find((entry) => entry.customerId === customerId);
  if (!subscription) return null;
  const active = subscription.status === "ACTIVE" && subscription.paymentStatus === "PAID" && new Date(subscription.startDate) <= new Date() && new Date(subscription.expiryDate) > new Date() && !subscription.cancelledAt;
  return { ...subscription, active, effectiveStatus: active ? "ACTIVE" : new Date(subscription.expiryDate) <= new Date() ? "EXPIRED" : subscription.status };
}

export function getContactAccess(customerId) {
  const subscription = getCustomerSubscription(customerId);
  const planCode = subscription?.active ? subscription.planCode : null;
  const features = Object.fromEntries(Object.entries(CONTACT_FEATURES).map(([feature, plans]) => [feature, Boolean(planCode && plans.includes(planCode))]));
  return { subscription, planCode, features };
}

export function activateDemoSubscription(customerId, planCode) {
  const plan = CUSTOMER_PLANS.find((entry) => entry.code === planCode);
  if (!plan) throw new Error("Unknown customer subscription plan");
  const now = new Date();
  const expiry = new Date(now.getTime() + plan.durationDays * 86400000);
  const record = { id: `CUS-SUB-${Date.now()}`, customerId, planId: plan.id, planCode, status: "ACTIVE", paymentStatus: "PAID", startDate: now.toISOString(), expiryDate: expiry.toISOString(), autoRenew: false, createdAt: now.toISOString(), updatedAt: now.toISOString() };
  write("customer_subscriptions", [record, ...readAll("customer_subscriptions", []).filter((entry) => entry.customerId !== customerId)]);
  write("customer_subscription_payments", [{ id: `CUS-PAY-${Date.now()}`, customerSubscriptionId: record.id, customerId, amount: plan.price, currency: "INR", paymentGateway: "DEMO_CHECKOUT", gatewayTransactionId: `DEMO-${Date.now()}`, paymentStatus: "PAID", paidAt: now.toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString() }, ...readAll("customer_subscription_payments", [])]);
  return record;
}

export function logContactAccess({ customerId, subscriptionId, listingType, listingId, actionType, accessGranted, denialReason }) {
  write("contact_access_logs", [{ id: `CAL-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, customerId, subscriptionId, listingType, listingId, actionType, accessGranted, denialReason: denialReason || null, createdAt: new Date().toISOString() }, ...readAll("contact_access_logs", [])]);
}

export function getAuthorizedDemoContact({ customerId, listingType, listingId }) {
  const access = getContactAccess(customerId);
  if (!access.features.VIEW_CONTACT_NUMBER) throw new Error("ACTIVE_SUBSCRIPTION_REQUIRED");
  logContactAccess({ customerId, subscriptionId: access.subscription.id, listingType, listingId, actionType: "VIEW_CONTACT", accessGranted: true });
  return "+919876543210";
}
