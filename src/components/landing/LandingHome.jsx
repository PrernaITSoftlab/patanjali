import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HelpCircle,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import Logo from "../common/Logo";
import Footer from "../layout/Footer";
import { useAuth } from "../../context/AuthContext";
import { logistics, warehouses } from "../../data/marketplace";
import ClassificationRating from "../common/ClassificationRating";
import IndiaBusinessHubsMap from "./IndiaBusinessHubsMap";
import FAQSection from "./FAQSection";

const hubs = [
  { name: "Mumbai", routeValue: "Mumbai", verifiedOptions: 96, x: 23, y: 57, labelPosition: "left" },
  { name: "Delhi NCR", routeValue: "Delhi NCR", verifiedOptions: 107, x: 34, y: 28, labelPosition: "right" },
  { name: "Bengaluru", routeValue: "Bengaluru", verifiedOptions: 118, x: 36, y: 76, labelPosition: "left" },
  { name: "Chennai", routeValue: "Chennai", verifiedOptions: 129, x: 43, y: 76, labelPosition: "right" },
  { name: "Hyderabad", routeValue: "Hyderabad", verifiedOptions: 140, x: 38, y: 62, labelPosition: "right" },
  { name: "Pune", routeValue: "Pune", verifiedOptions: 151, x: 26, y: 59, labelPosition: "left pune-label" },
  { name: "Ahmedabad", routeValue: "Ahmedabad", verifiedOptions: 162, x: 22, y: 45, labelPosition: "left" },
  { name: "Indore", routeValue: "Indore", verifiedOptions: 173, x: 31, y: 46, labelPosition: "right" },
  { name: "Jaipur", routeValue: "Jaipur", verifiedOptions: 184, x: 31, y: 33, labelPosition: "left" },
];
const networkPartners = [
  { name: "ITC", image: warehouses[5].image, link: "/warehouses?company=ITC" },
  { name: "PATANJALI", image: warehouses[1].image, link: "/warehouses?company=Patanjali" },
  { name: "RELIANCE RETAIL", image: warehouses[2].image, link: "/warehouses?company=Reliance%20Retail" },
];

const NAV_LINKS = [
  { label: "Warehouses", to: "/warehouses", icon: Warehouse, isRoute: true },
  { label: "Logistics", to: "/logistics", icon: Truck, isRoute: true },
  { label: "How It Works", to: "#how-it-works", icon: Search, isRoute: false },
  { label: "Explore India", to: "#explore-india", icon: MapPin, isRoute: false },
  { label: "FAQ", to: "#faq-section", icon: HelpCircle, isRoute: false },
  { label: "Contact", to: "/contact", icon: Mail, isRoute: true },
];

function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAnchorClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="landing-topbar">
      <Link to="/" className="landing-topbar-logo">
        <Logo />
      </Link>

      {/* Desktop nav */}
      <nav className="landing-nav" aria-label="Site navigation">
        {NAV_LINKS.map(({ label, to, icon: Icon, isRoute }) =>
          isRoute ? (
            <Link key={label} to={to} className="landing-nav-link">
              <Icon />
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={to}
              className="landing-nav-link"
              onClick={(e) => handleAnchorClick(e, to)}
            >
              <Icon />
              {label}
            </a>
          )
        )}
      </nav>

      {/* CTA + hamburger */}
      <div className="landing-topbar-actions">
        <Link
          className="btn btn-primary btn-sm"
          to={
            user
              ? `/${user.role.toLowerCase().replaceAll("_", "-")}/dashboard`
              : "/login"
          }
        >
          {user ? "Dashboard" : "Login"}
        </Link>
        <button
          className="landing-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="landing-mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, to, icon: Icon, isRoute }) =>
            isRoute ? (
              <Link key={label} to={to} className="landing-mobile-nav-link" onClick={() => setMenuOpen(false)}>
                <Icon />
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={to}
                className="landing-mobile-nav-link"
                onClick={(e) => handleAnchorClick(e, to)}
              >
                <Icon />
                {label}
              </a>
            )
          )}
          <Link
            className="btn btn-primary"
            style={{ marginTop: "8px" }}
            to={user ? `/${user.role.toLowerCase().replaceAll("_", "-")}/dashboard` : "/login"}
            onClick={() => setMenuOpen(false)}
          >
            {user ? "Dashboard" : "Login or create account"}
          </Link>
        </div>
      )}
    </header>
  );
}

const BUDGET_PRESETS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1L", value: 100000 },
  { label: "₹2.5L", value: 250000 },
  { label: "₹5L", value: 500000 },
];
const BUDGET_MAX = 500000;
const BUDGET_STEP = 10000;

function formatBudget(val) {
  if (val === 0) return "Any";
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
}

function Finder() {
  const [type, setType] = useState("warehouse");
  const [budget, setBudget] = useState(0);
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("location", data.get("location") || "India");
    ["classification", "rating", "budget"].forEach((key) => {
      const value = data.get(key);
      if (value) params.set(key, value);
    });
    ["verified", "nonVerified"].forEach((key) => {
      if (data.has(key)) params.set(key, "true");
    });
    nav(`/${type === "warehouse" ? "warehouses" : "logistics"}?${params}`);
  };
  return (
    <section className="landing-finder">
      <div className="landing-tabs">
        <button
          className={type === "warehouse" ? "active" : ""}
          onClick={() => setType("warehouse")}
        >
          <Warehouse />
          <span>
            <b>Warehouses</b>
            <small>Verified storage spaces</small>
          </span>
        </button>
        <button
          className={type === "logistics" ? "active" : ""}
          onClick={() => setType("logistics")}
        >
          <Truck />
          <span>
            <b>Logistics</b>
            <small>Trusted transport partners</small>
          </span>
        </button>
      </div>
      <form id="landing-search-form" onSubmit={submit}>
        <label>
          <small>
            {type === "warehouse" ? "CITY, AREA OR HUB" : "PICKUP LOCATION"}
          </small>
          <span>
            <MapPin />
            <input
              name="location"
              placeholder={type === "warehouse" ? "Bhiwandi, Mumbai" : "Mumbai"}
            />
          </span>
        </label>
        <label>
          <small>
            {type === "warehouse" ? "STORAGE TYPE" : "DELIVERY LOCATION"}
          </small>
          <span>
            {type === "warehouse" ? <Warehouse /> : <MapPin />}
            <select>
              <option>
                {type === "warehouse" ? "General / Dry" : "Delhi NCR"}
              </option>
              <option>
                {type === "warehouse" ? "Cold storage" : "Bengaluru"}
              </option>
            </select>
          </span>
        </label>
        <label>
          <small>
            {type === "warehouse" ? "SPACE REQUIRED" : "GOODS & VEHICLE"}
          </small>
          <span>
            <PackageCheck />
            <input
              placeholder={
                type === "warehouse" ? "10,000 sq ft" : "5 tonnes · 32 ft truck"
              }
            />
          </span>
        </label>
        <button>
          <Search /> Search
        </button>
      </form>
      <div className="landing-finder-footer">
        <p>
          <b>Popular:</b> Bhiwandi storage · Bengaluru fulfilment · Mumbai–Delhi
          freight · Cold chain
        </p>
        <details className="landing-filter-menu">
          <summary><SlidersHorizontal /> Filters</summary>
          <div className="landing-filter-panel">
            <label>
              <span>Amenity classification</span>
              <select name="classification" form="landing-search-form" defaultValue="">
                <option value="">Stars</option>
                {[5, 4, 3, 2, 1].map((stars) => <option value={stars} key={stars}>{stars} ★ & up</option>)}
              </select>
            </label>
            <label>
              <span>Customer rating</span>
              <select name="rating" form="landing-search-form" defaultValue="">
                <option value="">Any rating</option>
                <option value="4.5">4.5+ rating</option>
                <option value="4">4.0+ rating</option>
                <option value="3">3.0+ rating</option>
              </select>
            </label>
            <label className="landing-budget-slider-label">
              <span>Max budget</span>
              <div className="landing-budget-compact-wrap">
                <input
                  type="range"
                  className="landing-budget-range"
                  min="0"
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  aria-label="Maximum budget slider"
                  aria-valuetext={formatBudget(budget)}
                  style={{ "--pct": `${(budget / BUDGET_MAX) * 100}%` }}
                />
                <div className="landing-budget-presets" aria-hidden="true">
                  {BUDGET_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`budget-preset-tick${budget === p.value ? " active" : ""}`}
                      onClick={() => setBudget(p.value)}
                    >
                      <i className="budget-tick-line" />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="hidden"
                name="budget"
                form="landing-search-form"
                value={budget === 0 ? "" : budget}
              />
            </label>
            <div className="landing-filter-checks">
              <label><input type="checkbox" name="verified" form="landing-search-form" /> Verified</label>
              <label><input type="checkbox" name="nonVerified" form="landing-search-form" /> Non-verified</label>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

function Offer({ item, type }) {
  const isWarehouse = type === "warehouse";
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const availableArea = Number(String(item.capacity || "").replace(/[^\d.]/g, ""));
  const totalMonthlyPrice = isWarehouse ? availableArea * item.price : 0;
  const amenities = isWarehouse ? item.facilities?.slice(0, 3) : item.vehicles?.slice(0, 3);
  return (
    <article className="landing-offer">
      <div className="landing-offer-image">
        <img src={item.image} alt={`${item.name} cover`} />
        <span><ShieldCheck /> Verified</span>
        <small>1 of 5 public photos</small>
      </div>
      <div>
        <small>{isWarehouse ? "WAREHOUSE SPOTLIGHT" : "ROUTE SPOTLIGHT"}</small>
        <h3>{item.name}</h3>
        <p>
          {isWarehouse
            ? `${item.capacity} · ${item.city}`
            : `${item.route} · ${item.vehicle}`}
        </p>
        <ClassificationRating item={item} type={type} compact />
        <span title="Customer Review Rating">
          <Star fill="currentColor" /> Customer rating {item.rating} ({item.reviews} reviews)
        </span>
        <div className="landing-offer-tags">
          {amenities?.map((value) => <span key={value}>{value}</span>)}
        </div>
        <p className="landing-offer-description">
          {isWarehouse
            ? `Verified ${item.type.toLowerCase()} space near ${item.area} with ${item.capacity} currently rentable.`
            : `Verified transport provider serving ${item.route} with ${item.payload} payload capability.`}
        </p>
        {isWarehouse ? (
          <div className="landing-offer-price">
            <span>Rate <b>₹{item.price} per sq. ft./month</b></span>
            <span>Total monthly price <b>₹{totalMonthlyPrice.toLocaleString("en-IN")}/month</b></span>
          </div>
        ) : (
          <div className="landing-offer-price">
            <span>Starting rate <b>{item.price}</b></span>
            <span>Public fleet size <b>{item.fleet} vehicles</b></span>
          </div>
        )}
        <Link to={`/${isWarehouse ? "warehouse" : "logistics"}/${item.id}`}>
          {isCustomer ? "View Complete Details" : "View Limited Details"} <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

function MarketplaceLane({ items, type, direction }) {
  const isWarehouse = type === "warehouse";
  return (
    <section className={`marketplace-lane lane-${direction}`} aria-label={`${isWarehouse ? "Warehouse" : "Logistics"} highlights`}>
      <div className="marketplace-lane-label">
        {isWarehouse ? <Warehouse /> : <Truck />}
        <span>
          <b>{isWarehouse ? "Warehouse spaces" : "Logistics partners"}</b>

        </span>
      </div>
      <div className="marketplace-lane-window">
        <div className="marketplace-lane-track">
          <div className="marketplace-lane-group">
            {items.map((item) => <Offer key={item.id} item={item} type={type} />)}
          </div>
          <div className="marketplace-lane-group" aria-hidden="true" inert="">
            {items.map((item) => <Offer key={`copy-${item.id}`} item={item} type={type} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroLogisticsAnimations() {
  return (
    <div className="hero-logistics-animations" aria-hidden="true">
      <div className="hero-background">
        <div className="hero-route-grid" />
        <div className="hero-route route-one">
          <i className="route-line" />
          <span className="route-hub route-hub-start" />
          <span className="route-hub route-hub-end" />
          <b className="route-parcel"><PackageCheck /></b>
        </div>
        <div className="hero-route route-two">
          <i className="route-line" />
          <span className="route-hub route-hub-start" />
          <span className="route-hub route-hub-end" />
          <b className="route-parcel"><Truck /></b>
        </div>
        <span className="hero-float float-one"><Warehouse /></span>
        <span className="hero-float float-two"><Truck /></span>
      </div>

      <div className="logistics-animation-suite">
        <div className="suite-particles">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
          {Array.from({ length: 7 }, (_, index) => <b key={index} />)}
        </div>
        <div className="suite-isometric-city">
          <span className="iso-road iso-road-one" />
          <span className="iso-road iso-road-two" />
          <i className="iso-building iso-building-one"><Warehouse /></i>
          <i className="iso-building iso-building-two"><Building2 /></i>
          <i className="iso-building iso-building-three"><Warehouse /></i>
          <b className="iso-truck"><Truck /></b>
          <em className="iso-pickup"><MapPin /></em>
          <em className="iso-destination"><CheckCircle2 /></em>
        </div>
        <div className="suite-data-flow"><i /><i /><i /><b /><b /><b /></div>
        <div className="suite-marketplace-pulse"><ShieldCheck /></div>
      </div>
    </div>
  );
}

export default function LandingHome() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <section className="landing-hero">
          <HeroLogisticsAnimations />
          <div className="landing-hero-copy">
            <h1>
              <span className="hero-highlight-text">India's First</span> Verified Marketplace for Warehouses & Logistics
            </h1>

          </div>
          <Finder />
        </section>
        <section className="landing-trust" aria-label="TrustLogix marketplace benefits">
          {[
            [ShieldCheck, "Verified businesses", "Identity checks completed"],
            [Building2, "Facility checks", "Warehouse evidence reviewed"],
            [Star, "Authentic reviews", "Feedback from real customers"],
            [CheckCircle2, "Direct enquiries", "Connect without middlemen"],
          ].map(([Icon, title, copy], index) => (
            <span className={`trust-signal trust-signal-${index + 1}`} key={title}>
              <i><Icon /></i>
              <span><b>{title}</b><small>{copy}</small></span>
            </span>
          ))}
        </section>
        <section className="landing-panel landing-recommended">
          <header>
            <div>
              <small>HANDPICKED FOR YOU</small>
              <h2>HIGHLY RECOMMENDED</h2>
            </div>
            <nav>
              <Link to="/warehouses">
                <Warehouse /> Warehouses
              </Link>
              <Link to="/logistics">
                <Truck /> Logistics
              </Link>
            </nav>
          </header>
          <div className="landing-offers">
            <MarketplaceLane items={[warehouses[1], warehouses[5], warehouses[8]]} type="warehouse" direction="right" />
            <MarketplaceLane items={[logistics[0], logistics[2], logistics[8]]} type="logistics" direction="left" />
          </div>
        </section>
        <section className="landing-network">
          <div>
            <small>TRUSTLOGIX NETWORK</small>
            <h2>Reliable partners for every stage of your supply chain</h2>
            <p>
              Compare verified capacity, transparent indicative pricing, fleet
              capability and response quality.
            </p>
          </div>
          {networkPartners.map((partner) => (
            <Link to={partner.link} key={partner.name} aria-label={`Explore ${partner.name}`}>
              <img src={partner.image} alt="" />
              <span>
                <small>ENTERPRISE PARTNER</small>
                <strong>{partner.name}</strong>
                <i>Explore network <ArrowRight /></i>
              </span>
            </Link>
          ))}
        </section>
        <section id="how-it-works" className="landing-panel landing-steps">
          <header>
            <div>
              <small>ONE SIMPLE FLOW</small>
              <h2>Search. Compare. Connect.</h2>
            </div>
          </header>
          <div>
            {[
              [
                Search,
                "Search precisely",
                "Tell us the location, capacity and service you need.",
              ],
              [
                ShieldCheck,
                "Compare verified options",
                "Review Trust Scores, facilities, pricing and feedback.",
              ],
              [
                Truck,
                "Connect directly",
                "Send an enquiry or reveal verified contact details.",
              ],
            ].map(([Icon, title, copy], i) => (
              <article key={title}>
                <b>0{i + 1}</b>
                <Icon />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="explore-india" className="landing-panel landing-hubs">
          <header>
            <div>
              <small>POPULAR BUSINESS HUBS</small>
              <h2>Explore partners across India</h2>
            </div>
          </header>
          <IndiaBusinessHubsMap cities={hubs} />
        </section>
        <div id="faq-section"><FAQSection /></div>
        <section className="landing-cta">
          <Warehouse />
          <Truck />
          <span>
            <small>FOR WAREHOUSE & LOGISTICS BUSINESSES</small>
            <h2>Turn capacity into opportunity.</h2>
            <p>
              Build a verified profile and connect with serious business
              customers.
            </p>
          </span>
          <Link className="btn btn-light" to="/register">
            List your business <ArrowRight />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
