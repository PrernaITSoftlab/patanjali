import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Clock3, CreditCard, MessageSquare, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { CUSTOMER_PLANS, activateDemoSubscription, getCustomerSubscription } from "../../utils/customerSubscriptions";
import { readAll, write } from "../../utils/storage";
import "../../styles/customer-subscriptions.css";

export function CustomerSubscriptionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const subscription = getCustomerSubscription(user.id);
  const requested = new URLSearchParams(location.search).get("plan");
  const choose = (code) => {
    activateDemoSubscription(user.id, code);
    refresh((value) => value + 1);
    const planName = code === "CUSTOMER_PREMIUM" ? "Premium" : code === "CUSTOMER_PRO" ? "Pro" : "Standard";
    toast.success(`${planName} customer plan activated`);
    if (location.state?.returnTo) navigate(location.state.returnTo, { replace: true });
  };
  const payments = readAll("customer_subscription_payments", []).filter((entry) => entry.customerId === user.id);
  return <div className="role-page customer-subscription-page"><div className="module-title"><div><span>TRUSTLOGIX / CUSTOMER</span><h2>Customer Subscription</h2><p>Choose contact access for warehouse and logistics providers. Customer plans remain separate from owner partner plans.</p></div></div>{subscription && <section className="customer-current-plan"><ShieldCheck /><div><small>CURRENT CUSTOMER PLAN</small><h3>{subscription.planCode === "CUSTOMER_PREMIUM" ? "Premium" : subscription.planCode === "CUSTOMER_PRO" ? "Pro" : "Standard"}</h3><p>{subscription.effectiveStatus} · Expires {new Date(subscription.expiryDate).toLocaleDateString("en-IN")}</p></div><b>{Math.max(0, Math.ceil((new Date(subscription.expiryDate) - new Date()) / 86400000))} days remaining</b></section>}<div className="customer-subscription-plans">{CUSTOMER_PLANS.map((plan) => <article className={`${plan.recommended ? "recommended" : ""}${requested === plan.code ? " requested" : ""}`} key={plan.code}>{plan.recommended && <em>Recommended</em>}<CreditCard /><h3>{plan.name}</h3><p>{plan.description}</p><strong>₹{plan.price}<small>/30 days</small></strong><ul>{(plan.code === "CUSTOMER_STANDARD" ? ["View provider contact numbers", "Copy contact details", "Warehouse and logistics contacts"] : plan.code === "CUSTOMER_PRO" ? ["Everything in Standard", "One-click Call Now", "WhatsApp Enquiry", "Send text enquiries", "Enquiry history", "Provider replies and notifications"] : ["Everything in Pro", "Unlimited access to all contacts", "Dedicated relationship manager", "Priority support & enquiry tracking", "24/7 Premium customer helpline"]).map((feature) => <li key={feature}><Check />{feature}</li>)}</ul><button className={plan.recommended ? "btn btn-primary" : "btn btn-secondary"} onClick={() => choose(plan.code)}>{subscription?.planCode === plan.code ? "Renew Plan" : subscription ? `Upgrade to ${plan.name}` : `Choose ${plan.name}`}</button></article>)}</div><section className="subscription-payment-history"><h3>Payment history</h3>{payments.length ? payments.map((payment) => <div key={payment.id}><CreditCard /><span><b>₹{payment.amount} {payment.currency}</b><small>{new Date(payment.paidAt).toLocaleString("en-IN")}</small></span><em>{payment.paymentStatus}</em></div>) : <p>No customer subscription payments yet.</p>}</section></div>;
}

export function MyEnquiries() {
  const { user } = useAuth();
  const enquiries = readAll("customer_enquiries", []).filter((entry) => entry.customerId === user.id);
  return <div className="role-page enquiry-history-page"><div className="module-title"><div><span>TRUSTLOGIX / CUSTOMER</span><h2>My Enquiries</h2><p>View enquiry status and provider responses. History remains available after subscription expiry.</p></div><Link className="btn btn-primary" to="/customer/subscription">Manage Subscription</Link></div>{enquiries.length ? <div className="enquiry-history-list">{enquiries.map((entry) => <article key={entry.id}><span className="enquiry-type">{entry.listingType}</span><div><h3>{entry.listingName}</h3><small>{entry.providerName}</small><b>{entry.subject}</b><p>{entry.message.slice(0, 150)}{entry.message.length > 150 ? "…" : ""}</p></div><aside><em className={`enquiry-status status-${entry.status.toLowerCase()}`}>{entry.status}</em><small><Clock3 />{new Date(entry.createdAt).toLocaleString("en-IN")}</small><button className="btn btn-secondary btn-sm" onClick={() => toast.success("Conversation opened")}>View Conversation <ArrowRight /></button></aside></article>)}</div> : <div className="empty-state"><MessageSquare /><h2>No enquiries yet</h2><p>Your sent warehouse and logistics enquiries will appear here.</p></div>}</div>;
}

export function ProviderEnquiries() {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const entries = readAll("customer_enquiries", []).filter((entry) => entry.providerUserId === user.id || entry.providerName === user.name);
  const update = (entry, status) => { const now = new Date().toISOString(); write("customer_enquiries", readAll("customer_enquiries", []).map((record) => record.id === entry.id ? { ...record, status, respondedAt: status === "RESPONDED" ? now : record.respondedAt, closedAt: status === "CLOSED" ? now : record.closedAt, updatedAt: now } : record)); refresh((value) => value + 1); toast.success(`Enquiry marked ${status}`); };
  const reply = (entry) => { const message = window.prompt("Reply to this customer enquiry"); if (!message?.trim()) return; const now = new Date().toISOString(); write("enquiry_messages", [{ id: `MSG-${Date.now()}`, enquiryId: entry.id, senderId: user.id, senderRole: user.role, message: message.trim(), isRead: false, readAt: null, createdAt: now }, ...readAll("enquiry_messages", [])]); update(entry, "RESPONDED"); };
  return <div className="role-page provider-enquiries-page"><div className="module-title"><div><span>TRUSTLOGIX / PROVIDER</span><h2>Customer Enquiries</h2><p>View and respond to enquiries connected to your listings.</p></div></div>{entries.length ? <div className="enquiry-history-list">{entries.map((entry) => <article key={entry.id}><span className="enquiry-type">{entry.listingType}</span><div><h3>{entry.listingName}</h3><b>{entry.subject}</b><p>{entry.message}</p></div><aside><em className={`enquiry-status status-${entry.status.toLowerCase()}`}>{entry.status}</em><button className="btn btn-primary btn-sm" onClick={() => reply(entry)}>Reply</button><button className="btn btn-secondary btn-sm" onClick={() => update(entry, "CLOSED")}>Close</button></aside></article>)}</div> : <div className="empty-state"><MessageSquare /><h2>No customer enquiries</h2><p>New enquiries connected to your listings will appear here.</p></div>}</div>;
}
