const PLAN_FEATURES = {
  CUSTOMER_STANDARD: new Set(["VIEW_CONTACT_NUMBER"]),
  CUSTOMER_PRO: new Set(["VIEW_CONTACT_NUMBER", "CALL_PROVIDER", "WHATSAPP_PROVIDER", "SEND_PROVIDER_ENQUIRY"]),
  CUSTOMER_PREMIUM: new Set(["VIEW_CONTACT_NUMBER", "CALL_PROVIDER", "WHATSAPP_PROVIDER", "SEND_PROVIDER_ENQUIRY"]),
};

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export async function checkCustomerSubscriptionAccess(repository, session, requiredFeature) {
  if (!session?.userId) throw new ApiError(401, "Authentication required");
  if (session.role !== "CUSTOMER") throw new ApiError(403, "Customer account required");
  const subscription = await repository.findActiveCustomerSubscription(session.userId);
  if (!subscription) throw new ApiError(403, "Active subscription required");
  if (subscription.paymentStatus === "PENDING") throw new ApiError(409, "Subscription payment is still pending");
  const now = new Date();
  const active = subscription.status === "ACTIVE" && subscription.paymentStatus === "PAID" && new Date(subscription.startDate) <= now && new Date(subscription.expiryDate) > now && !subscription.cancelledAt;
  if (!active) throw new ApiError(403, "Active subscription required");
  if (!PLAN_FEATURES[subscription.planCode]?.has(requiredFeature)) throw new ApiError(403, "Pro subscription required");
  return subscription;
}

export async function revealProviderContact({ repository, session, listingType, listingId, requestMeta = {} }) {
  const subscription = await checkCustomerSubscriptionAccess(repository, session, "VIEW_CONTACT_NUMBER");
  const listing = await repository.findActiveListingForContact(listingType, listingId);
  if (!listing?.providerPhone) throw new ApiError(404, "Listing or contact information not found");
  await repository.createContactAccessLog({ customerId: session.userId, subscriptionId: subscription.id, listingType, listingId, actionType: "VIEW_CONTACT", accessGranted: true, ipAddress: requestMeta.ipAddress, userAgent: requestMeta.userAgent });
  return { contactNumber: listing.providerPhone };
}

export async function authorizeProviderAction({ repository, session, listingType, listingId, actionType, requestMeta = {} }) {
  const feature = { CALL_NOW: "CALL_PROVIDER", WHATSAPP_ENQUIRY: "WHATSAPP_PROVIDER" }[actionType];
  if (!feature) throw new ApiError(400, "Unsupported contact action");
  const subscription = await checkCustomerSubscriptionAccess(repository, session, feature);
  const listing = await repository.findActiveListingForContact(listingType, listingId);
  if (!listing?.providerPhone) throw new ApiError(404, "Listing or contact information not found");
  await repository.createContactAccessLog({ customerId: session.userId, subscriptionId: subscription.id, listingType, listingId, actionType, accessGranted: true, ipAddress: requestMeta.ipAddress, userAgent: requestMeta.userAgent });
  return { allowed: true };
}

export async function createCustomerEnquiry({ repository, session, input }) {
  await checkCustomerSubscriptionAccess(repository, session, "SEND_PROVIDER_ENQUIRY");
  const listing = await repository.findActiveListingForContact(input.listingType, input.listingId);
  if (!listing) throw new ApiError(404, "Listing not found");
  const duplicate = await repository.findRecentDuplicateEnquiry(session.userId, input.listingType, input.listingId, input.subject);
  if (duplicate) throw new ApiError(409, "A similar enquiry was submitted recently");
  const enquiry = await repository.createEnquiry({ ...input, customerId: session.userId, providerUserId: listing.providerUserId, status: "SENT" });
  await repository.createEnquiryMessage({ enquiryId: enquiry.id, senderId: session.userId, senderRole: "CUSTOMER", message: input.message });
  await repository.createProviderNotification({ providerUserId: listing.providerUserId, enquiryId: enquiry.id, type: "NEW_CUSTOMER_ENQUIRY" });
  return enquiry;
}

export const getCustomerEnquiries = (repository, session) => {
  if (!session?.userId) throw new ApiError(401, "Authentication required");
  if (session.role !== "CUSTOMER") throw new ApiError(403, "Customer account required");
  return repository.findEnquiriesByCustomerId(session.userId);
};

export const getProviderEnquiries = (repository, session) => {
  if (!session?.userId) throw new ApiError(401, "Authentication required");
  if (!["WAREHOUSE_OWNER", "LOGISTICS_OWNER"].includes(session.role)) throw new ApiError(403, "Provider account required");
  return repository.findEnquiriesByProviderId(session.userId);
};
