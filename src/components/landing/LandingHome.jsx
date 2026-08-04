import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Building2,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Warehouse,
} from "lucide-react";
import Logo from "../common/Logo";
import Footer from "../layout/Footer";
import { useAuth } from "../../context/AuthContext";
import { logistics, warehouses } from "../../data/marketplace";

const hubs = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Indore",
  "Jaipur",
];
const faqs = [
  [
    "How do I find a warehouse?",
    "Choose Warehouses, enter a city, select the storage type and add your approximate space requirement.",
  ],
  [
    "How are partners verified?",
    "TrustLogix reviews business identity, facility or fleet evidence, operational documents and customer feedback.",
  ],
  [
    "Can I compare providers?",
    "Save or compare listings, review Trust Scores and contact the most suitable provider directly.",
  ],
  [
    "Does TrustLogix process payments?",
    "No. Agreements, bookings and payments are finalised directly between customers and providers.",
  ],
];

function Header() {
  const { user } = useAuth();
  return (
    <header className="landing-topbar">
      <Link to="/">
        <Logo />
      </Link>
      <nav>
        <Link to="/warehouses">
          <Warehouse /> Warehouses
        </Link>
        <Link to="/logistics">
          <Truck /> Logistics
        </Link>
      </nav>
      <div>
        <Link className="landing-saved" to="/saved">
          <Bookmark /> Saved
        </Link>
        <Link
          className="btn btn-primary btn-sm"
          to={
            user
              ? `/${user.role.toLowerCase().replaceAll("_", "-")}/dashboard`
              : "/login"
          }
        >
          {user ? "Dashboard" : "Login or create account"}
        </Link>
      </div>
    </header>
  );
}

function Finder() {
  const [type, setType] = useState("warehouse");
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    nav(
      `/${type === "warehouse" ? "warehouses" : "logistics"}?location=${encodeURIComponent(data.get("location") || "India")}`,
    );
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
      <form onSubmit={submit}>
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
      <p>
        <b>Popular:</b> Bhiwandi storage · Bengaluru fulfilment · Mumbai–Delhi
        freight · Cold chain
      </p>
    </section>
  );
}

function Offer({ item, type }) {
  const isWarehouse = type === "warehouse";
  return (
    <article className="landing-offer">
      <img src={item.image} alt="" />
      <div>
        <small>{isWarehouse ? "WAREHOUSE SPOTLIGHT" : "ROUTE SPOTLIGHT"}</small>
        <h3>{item.name}</h3>
        <p>
          {isWarehouse
            ? `${item.capacity} · ${item.city}`
            : `${item.route} · ${item.vehicle}`}
        </p>
        <span>
          <ShieldCheck /> Trust Score {item.score}
        </span>
        <Link to={`/${isWarehouse ? "warehouse" : "logistics"}/${item.id}`}>
          View details <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

function AnimatedHeroBackground() {
  return (
    <div className="hero-background" aria-hidden="true">
      <div className="hero-aurora hero-aurora-one" />
      <div className="hero-aurora hero-aurora-two" />
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
      <span className="hero-float float-two"><MapPin /></span>
      <span className="hero-float float-three"><ShieldCheck /></span>
    </div>
  );
}

export default function LandingHome() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <section className="landing-hero">
          <AnimatedHeroBackground />
          <div className="landing-hero-copy">
            <span>
              <ShieldCheck /> INDIA'S VERIFIED SUPPLY-CHAIN MARKETPLACE
            </span>
            <h1>
              Move smarter.
              <br />
              Store with confidence.
            </h1>
            <p>
              Find trusted warehouse space and logistics partners in one clear,
              direct marketplace.
            </p>
          </div>
          <div className="landing-motion" aria-hidden="true">
            <Warehouse />
            <i></i>
            <Truck />
          </div>
          <Finder />
        </section>
        <section className="landing-trust">
          <span>
            <ShieldCheck />
            <span><b>Verified businesses</b><small>Identity checks completed</small></span>
          </span>
          <span>
            <Building2 />
            <span><b>Facility checks</b><small>Warehouse evidence reviewed</small></span>
          </span>
          <span>
            <Star />
            <span><b>Authentic reviews</b><small>Feedback from real customers</small></span>
          </span>
          <span>
            <CheckCircle2 />
            <span><b>Direct enquiries</b><small>Connect without middlemen</small></span>
          </span>
        </section>
        <section className="landing-panel">
          <header>
            <div>
              <small>HANDPICKED FOR YOU</small>
              <h2>Marketplace highlights</h2>
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
            <Offer item={warehouses[1]} type="warehouse" />
            <Offer item={logistics[0]} type="logistics" />
            <Offer item={warehouses[5]} type="warehouse" />
            <Offer item={logistics[2]} type="logistics" />
            <Offer item={warehouses[8]} type="warehouse" />
            <Offer item={logistics[8]} type="logistics" />
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
          {warehouses.slice(0, 3).map((x) => (
            <Link to={`/warehouse/${x.id}`} key={x.id}>
              <img src={x.image} alt="" />
              <span>{x.name}</span>
            </Link>
          ))}
        </section>
        <section className="landing-panel landing-steps">
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
        <section className="landing-panel landing-hubs">
          <header>
            <div>
              <small>POPULAR BUSINESS HUBS</small>
              <h2>Explore partners across India</h2>
            </div>
          </header>
          <div>
            {hubs.map((hub, i) => (
              <Link to={`/warehouses?city=${hub}`} key={hub}>
                <span>0{i + 1}</span>
                <b>{hub}</b>
                <small>{96 + i * 11} verified options</small>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="landing-panel landing-faq">
          <header>
            <div>
              <small>HELPFUL ANSWERS</small>
              <h2>Planning your next move?</h2>
            </div>
          </header>
          <div>
            {faqs.map(([q, a]) => (
              <article key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </article>
            ))}
          </div>
        </section>
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
