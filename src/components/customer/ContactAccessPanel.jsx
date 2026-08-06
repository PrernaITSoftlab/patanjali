import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Clipboard, CreditCard, LockKeyhole, MessageSquare, Phone, Send, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { readAll, write } from "../../utils/storage";
import { CUSTOMER_PLANS, getAuthorizedDemoContact, getContactAccess, logContactAccess } from "../../utils/customerSubscriptions";
import { saveAuthIntent } from "../../utils/authIntent";
import "../../styles/customer-subscriptions.css";

const actionFeature = { reveal: "VIEW_CONTACT_NUMBER", call: "CALL_PROVIDER", whatsapp: "WHATSAPP_PROVIDER", enquiry: "SEND_PROVIDER_ENQUIRY" };
const actionLog = { reveal: "VIEW_CONTACT", call: "CALL_NOW", whatsapp: "WHATSAPP_ENQUIRY", enquiry: "SEND_ENQUIRY" };

function SubscriptionPlanModal({ onClose, returnTo }) {
  const navigate = useNavigate();
  const choose = (code) => navigate(`/customer/subscription?plan=${code}`, { state: { returnTo } });
  return <Modal title="Unlock Provider Contact Details" onClose={onClose} className="customer-plan-modal-dialog"><div className="customer-plan-modal"><p>Choose a subscription plan to access verified warehouse and logistics partner contact options.</p><div>{CUSTOMER_PLANS.map((plan) => <article className={plan.recommended ? "recommended" : ""} key={plan.code}>{plan.recommended && <em>Recommended</em>}<CreditCard /><h3>{plan.name}</h3><p>{plan.code === "CUSTOMER_STANDARD" ? "View provider contact numbers." : plan.code === "CUSTOMER_PRO" ? "Access all direct communication options." : "Premium features and unlimited access."}</p><ul>{(plan.code === "CUSTOMER_STANDARD" ? ["View warehouse contact numbers", "View logistics provider contact numbers", "Copy contact numbers"] : plan.code === "CUSTOMER_PRO" ? ["View contact numbers", "Call providers directly", "Send WhatsApp enquiries", "Send in-platform enquiries", "Track provider responses"] : ["Unlimited contact requests", "Dedicated customer success manager", "24/7 Priority support hotline", "All features of Standard & Pro"]).map((feature) => <li key={feature}><Check />{feature}</li>)}</ul><button className={plan.recommended ? "btn btn-primary" : "btn btn-secondary"} onClick={() => choose(plan.code)}>Choose {plan.name}</button></article>)}</div><button className="btn btn-ghost" onClick={onClose}>Maybe Later</button></div></Modal>;
}

function UpgradeModal({ onClose, returnTo }) {
  const navigate = useNavigate();
  return <Modal title="Unlock All Contact Options" onClose={onClose}><div className="upgrade-pro-modal"><LockKeyhole /><p>Upgrade to Pro to call providers directly, send WhatsApp enquiries and communicate through TrustLogix.</p><button className="btn btn-primary" onClick={() => navigate("/customer/subscription?plan=CUSTOMER_PRO", { state: { returnTo } })}>Upgrade to Pro</button><button className="btn btn-secondary" onClick={onClose}>Continue with Standard</button></div></Modal>;
}

function LoginRequiredModal({ onClose, returnTo, action }) {
  const navigate = useNavigate();
  const go = (destination) => { saveAuthIntent(returnTo, action); navigate(destination, { state: { returnTo, action } }); };
  return <Modal title="Login to Contact Providers" onClose={onClose}><div className="upgrade-pro-modal"><LockKeyhole /><p>Sign in or create a customer account to access provider contact options.</p><button className="btn btn-primary" onClick={() => go("/login")}>Login</button><button className="btn btn-secondary" onClick={() => go("/register")}>Create Account</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div></Modal>;
}

function SendEnquiryModal({ item, type, user, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(event.currentTarget);
    const callback = data.get("callbackTime");
    if (callback && new Date(callback) <= new Date()) return toast.error("Preferred callback time must be in the future");
    setSubmitting(true);
    const now = new Date().toISOString();
    const enquiry = { id: `ENQ-${Date.now()}`, customerId: user.id, listingType: type, warehouseId: type === "warehouse" ? item.id : null, logisticsListingId: type === "logistics" ? item.id : null, providerUserId: `provider-${String(item.owner || item.company).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, providerName: item.owner || item.company, listingName: item.name, subject: data.get("subject").trim(), message: data.get("message").trim(), preferredContactMethod: data.get("contactMethod"), preferredCallbackTime: callback || null, bookingReference: data.get("bookingReference") || null, status: "SENT", createdAt: now, updatedAt: now };
    write("customer_enquiries", [enquiry, ...readAll("customer_enquiries", [])]);
    write("enquiry_messages", [{ id: `MSG-${Date.now()}`, enquiryId: enquiry.id, senderId: user.id, senderRole: "CUSTOMER", message: enquiry.message, isRead: false, readAt: null, createdAt: now }, ...readAll("enquiry_messages", [])]);
    write("provider_notifications", [{ id: `NOT-${Date.now()}`, providerUserId: enquiry.providerUserId, type: "NEW_CUSTOMER_ENQUIRY", enquiryId: enquiry.id, createdAt: now }, ...readAll("provider_notifications", [])]);
    toast.success("Enquiry sent to the provider");
    onClose();
  };
  return <Modal title={`Send enquiry to ${item.name}`} onClose={onClose}><form className="subscription-enquiry-form" onSubmit={submit}><label>Subject<input name="subject" required defaultValue={type === "warehouse" ? "Warehouse availability enquiry" : "Logistics service enquiry"} /></label><label>Message<textarea name="message" required minLength="20" maxLength="2000" placeholder="Describe your requirement, preferred dates and capacity needs." /></label><div><label>Preferred contact method<select name="contactMethod"><option>Email</option><option>Phone Call</option><option>WhatsApp</option></select></label><label>Preferred callback time<input name="callbackTime" type="datetime-local" /></label></div><label>Booking requirement reference (optional)<input name="bookingReference" maxLength="80" /></label><button className="btn btn-primary" disabled={submitting}>{submitting ? "Sending…" : "Send Enquiry"}</button></form></Modal>;
}

export default function ContactAccessPanel({ item, type, resumeAction }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [contact, setContact] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const access = getContactAccess(user?.id);
  const returnTo = `${location.pathname}${location.search}`;
  useEffect(() => { const timer = setInterval(() => setRefresh((value) => value + 1), 60000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (resumeAction) handleAction(resumeAction === "reveal-contact" ? "reveal" : resumeAction === "call-provider" ? "call" : resumeAction === "whatsapp-enquiry" ? "whatsapp" : "enquiry"); }, [resumeAction, refresh]);

  const deny = (action) => {
    const reason = access.planCode === "CUSTOMER_STANDARD" ? "PRO_SUBSCRIPTION_REQUIRED" : "ACTIVE_SUBSCRIPTION_REQUIRED";
    logContactAccess({ customerId: user?.id, subscriptionId: access.subscription?.id, listingType: type, listingId: item.id, actionType: actionLog[action], accessGranted: false, denialReason: reason });
    setModal(access.planCode === "CUSTOMER_STANDARD" ? "upgrade" : "plans");
  };
  const authorizedContact = () => {
    try { return getAuthorizedDemoContact({ customerId: user.id, listingType: type, listingId: item.id }); }
    catch { toast.error("Contact number is currently unavailable."); return null; }
  };
  const handleAction = (action) => {
    if (!user) { setPendingAction(`${action}-provider`); setModal("login"); return; }
    if (user.role !== "CUSTOMER") { toast.error("Customer account required"); return; }
    if (action === "reveal") {
      setModal("plans");
      return;
    }
    if (!access.features[actionFeature[action]]) return deny(action);
    const number = authorizedContact();
    logContactAccess({ customerId: user.id, subscriptionId: access.subscription.id, listingType: type, listingId: item.id, actionType: actionLog[action], accessGranted: true });
    if (action === "call" && number) window.location.href = `tel:${number}`;
    if (action === "whatsapp" && number) { const message = type === "warehouse" ? `Hello, I found ${item.name} on TrustLogix and would like to know more about availability, pricing and booking requirements. Listing ID: ${item.id}.` : `Hello, I found ${item.name} on TrustLogix and would like to know more about availability, pricing and transportation requirements. Listing ID: ${item.id}.`; window.open(`https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }
    if (action === "enquiry") setModal("enquiry");
  };
  const locked = (feature) => !access.features[feature];
  const actionButton = (action, feature, Icon, label) => {
    const isLocked = locked(feature);
    const requirement = access.planCode === "CUSTOMER_STANDARD" ? "Pro subscription required" : "Active customer subscription required";
    const buttonTone = action === "reveal" && !isLocked ? "btn-primary" : "btn-secondary";
    return <button className={`btn ${buttonTone} contact-access-action${isLocked ? " locked" : ""}`} onClick={() => handleAction(action)} aria-label={isLocked ? `${label} — ${requirement}` : label}><Icon className="contact-action-icon" /><span>{label}</span>{isLocked && <LockKeyhole className="action-lock" aria-hidden="true" />}</button>;
  };
  return <aside className="showcase-contact contact-access-panel"><small>ESTIMATED STARTING PRICE</small><h2>{type === "warehouse" ? `₹${item.price} ${item.unit}` : item.price}</h2><strong>Available · responds in {item.response || "18 min"}</strong>{contact ? <div className="revealed-contact"><Phone /><b>{contact.replace(/(\+91)(\d{5})(\d{5})/, "$1 $2 $3")}</b><button aria-label="Copy contact number" onClick={async () => { await navigator.clipboard.writeText(contact); logContactAccess({ customerId: user.id, subscriptionId: access.subscription.id, listingType: type, listingId: item.id, actionType: "COPY_CONTACT", accessGranted: true }); toast.success("Contact number copied"); }}><Clipboard /> Copy</button></div> : actionButton("reveal", "VIEW_CONTACT_NUMBER", Phone, "Show Contact Number")}{actionButton("call", "CALL_PROVIDER", Phone, "Call Now")}{actionButton("whatsapp", "WHATSAPP_PROVIDER", Send, "WhatsApp Enquiry")}{actionButton("enquiry", "SEND_PROVIDER_ENQUIRY", MessageSquare, "Send Enquiry")}<div><ShieldCheck /><p>Subscription access is checked before protected contact actions.</p></div>{access.subscription ? <p className="contact-plan-note">Customer plan: <b>{access.planCode === "CUSTOMER_PRO" ? "Pro" : "Standard"}</b> · {access.subscription.effectiveStatus}</p> : <p className="contact-plan-note">Choose a customer plan to unlock provider contacts.</p>}{modal === "login" && <LoginRequiredModal onClose={() => setModal(null)} returnTo={returnTo} action={pendingAction} />} {modal === "plans" && <SubscriptionPlanModal onClose={() => setModal(null)} returnTo={returnTo} />} {modal === "upgrade" && <UpgradeModal onClose={() => setModal(null)} returnTo={returnTo} />} {modal === "enquiry" && <SendEnquiryModal item={item} type={type} user={user} onClose={() => setModal(null)} />}</aside>;
}
