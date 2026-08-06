import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  HelpCircle,
  Minus,
  PackageSearch,
  Plus,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

const categories = ["All Questions", "Warehouses", "Logistics", "Payments", "Verification"];

const faqItems = [
  { id: "book-warehouse", category: "Warehouses", icon: Warehouse, question: "How do I find and book a warehouse?", answer: "Enter your preferred city, required storage capacity, storage type, booking duration and budget. TrustLogix will show suitable verified warehouses that you can compare, request a quotation for or book where instant booking is available." },
  { id: "partner-verification", category: "Verification", icon: ShieldCheck, question: "How are warehouse and logistics partners verified?", answer: "TrustLogix reviews business information, operational documents, warehouse or fleet details, facility evidence and document validity before displaying verification badges. Business verification and individual listing verification remain separate." },
  { id: "combined-booking", category: "Logistics", icon: Truck, question: "Can I book warehouse and logistics services together?", answer: "Yes. Use the combined booking option to arrange goods pickup, transportation to the warehouse, storage and final delivery through one connected booking workflow." },
  { id: "warehouse-price", category: "Warehouses", icon: CreditCard, question: "How is the warehouse price calculated?", answer: "The final warehouse price is calculated using the required storage area or capacity, booking duration, warehouse rate, handling charges, loading or unloading charges, taxes and any additional services selected by the customer." },
  { id: "compare-providers", category: "Warehouses", icon: PackageSearch, question: "Can I compare different service providers?", answer: "Yes. Customers can compare providers using total price, available capacity, facilities, customer ratings, verified-review count, Trust Score, verification status and service availability." },
  { id: "track-logistics", category: "Logistics", icon: Truck, question: "How can I track my logistics booking?", answer: "After a vehicle and driver are assigned, customers can view shipment status, pickup progress, location updates, estimated delivery progress and proof of delivery from their dashboard." },
  { id: "cancel-refund", category: "Payments", icon: CreditCard, question: "Can I cancel a booking and request a refund?", answer: "Eligible bookings can be cancelled according to the provider’s cancellation policy. The refund amount depends on the booking status, cancellation time, services already used and applicable charges." },
  { id: "submit-review", category: "Verification", icon: BadgeCheck, question: "Who can submit a review?", answer: "Only customers who have completed a verified booking can submit a review. Each review remains connected to its booking ID to reduce fake or misleading ratings." },
  { id: "trust-score", category: "Verification", icon: ShieldCheck, question: "What is the TrustLogix Trust Score?", answer: "The Trust Score is a platform-generated score based on business verification, document compliance, inspection results, booking performance, customer feedback, complaint history and listing accuracy." },
  { id: "payment-options", category: "Payments", icon: CreditCard, question: "What payment options are available?", answer: "Customers can make eligible booking payments through the TrustLogix platform when payment integration is enabled. Payment status, deposits, refunds, invoices and transaction records remain visible in the customer dashboard." },
];

function FAQCategoryTabs({ active, onChange }) {
  return (
    <div className="faq-category-tabs" role="tablist" aria-label="FAQ categories">
      {categories.map((category) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === category}
          className={active === category ? "active" : ""}
          onClick={() => onChange(category)}
          key={category}
        >{category}</button>
      ))}
    </div>
  );
}

function FAQAccordionItem({ item, open, onToggle }) {
  const Icon = item.icon;
  const panelId = `faq-panel-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;
  return (
    <article className={`faq-accordion-item${open ? " open" : ""}`}>
      <button id={triggerId} type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="faq-question-icon"><Icon /></span>
        <span className="faq-question-copy"><b>{item.question}</b><small>{item.category}</small></span>
        <span className="faq-toggle-icon" aria-hidden="true">{open ? <Minus /> : <Plus />}</span>
      </button>
      <div id={panelId} role="region" aria-labelledby={triggerId} className="faq-answer" aria-hidden={!open}>
        <div><p>{item.answer}</p></div>
      </div>
    </article>
  );
}

export default function FAQSection() {
  const [category, setCategory] = useState("All Questions");
  const [openId, setOpenId] = useState(faqItems[0].id);
  const visibleItems = useMemo(
    () => category === "All Questions" ? faqItems : faqItems.filter((item) => item.category === category),
    [category],
  );
  const changeCategory = (nextCategory) => {
    const nextItems = nextCategory === "All Questions" ? faqItems : faqItems.filter((item) => item.category === nextCategory);
    setCategory(nextCategory);
    setOpenId(nextItems[0]?.id || "");
  };

  return (
    <section className="landing-panel landing-faq" aria-labelledby="faq-heading">
      <header>
        <div>
          <small>HELP &amp; SUPPORT</small>
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <p>Find quick answers about warehouse booking, logistics services, payments, verification and shipment tracking.</p>
        </div>
        <HelpCircle aria-hidden="true" />
      </header>
      <FAQCategoryTabs active={category} onChange={changeCategory} />
      <div className="faq-accordion">
        {visibleItems.map((item) => (
          <FAQAccordionItem item={item} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? "" : item.id)} key={item.id} />
        ))}
      </div>
      <aside className="faq-support-cta">
        <span><HelpCircle /><span><b>Still have questions?</b><small>Get assistance with bookings, verification, payments or shipment tracking.</small></span></span>
        <Link className="btn btn-primary" to="/contact">Contact Support <ArrowRight /></Link>
      </aside>
    </section>
  );
}
