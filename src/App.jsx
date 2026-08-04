import { useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import {
  Search,
  Warehouse,
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Star,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Grid2X2,
  List,
  BarChart3,
  Users,
  Eye,
  FileCheck2,
  Bell,
  Menu,
  LogOut,
  PackageCheck,
  Clock3,
  Building2,
  TrendingUp,
  Plus,
  Download,
  CalendarDays,
  IndianRupee,
  Activity,
  LockKeyhole,
  Mail,
  EyeOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import PublicNavbar from "./components/layout/PublicNavbar";
import Footer from "./components/layout/Footer";
import ListingCard from "./components/common/ListingCard";
import Modal from "./components/common/Modal";
import Logo from "./components/common/Logo";
import {
  warehouses,
  logistics,
  demoUsers,
  disclaimer,
} from "./data/marketplace";
import { useAuth } from "./context/AuthContext";
import { read, write } from "./utils/storage";
import RoleApp from "./dashboard/RoleApp";
import {
  LogisticsShowcase,
  ProviderVehicles,
  VehicleShowcase,
  WarehouseShowcase,
} from "./components/customer/CustomerShowcaseDetails";
import LandingHome from "./components/landing/LandingHome";

const routes = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
];
function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
function SearchPanel() {
  const [tab, setTab] = useState("warehouse");
  const nav = useNavigate();
  const go = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    nav(
      `/${tab === "warehouse" ? "warehouses" : "logistics"}?location=${encodeURIComponent(fd.get("from") || "India")}`,
    );
  };
  return (
    <div className="search-shell">
      <div className="search-tabs">
        <button
          className={tab === "warehouse" ? "active" : ""}
          onClick={() => setTab("warehouse")}
        >
          <Warehouse /> Warehouses
        </button>
        <button
          className={tab === "logistics" ? "active" : ""}
          onClick={() => setTab("logistics")}
        >
          <Truck /> Logistics
        </button>
      </div>
      <form className="hero-search" onSubmit={go}>
        <label>
          <span>
            {tab === "warehouse" ? "CITY OR AREA" : "PICKUP LOCATION"}
          </span>
          <b>
            <MapPin />{" "}
            <input
              name="from"
              placeholder={
                tab === "warehouse" ? "e.g. Bhiwandi, Mumbai" : "e.g. Mumbai"
              }
            />
          </b>
          <small>
            {tab === "warehouse"
              ? "Where do you need storage?"
              : "Origin city or PIN code"}
          </small>
        </label>
        <label>
          <span>
            {tab === "warehouse" ? "STORAGE TYPE" : "DELIVERY LOCATION"}
          </span>
          <b>
            {tab === "warehouse" ? <Warehouse /> : <MapPin />}
            <select name="type">
              <option>
                {tab === "warehouse" ? "General / Dry" : "Delhi NCR"}
              </option>
              <option>
                {tab === "warehouse" ? "Cold storage" : "Bengaluru"}
              </option>
              <option>{tab === "warehouse" ? "Fulfilment" : "Chennai"}</option>
            </select>
          </b>
          <small>
            {tab === "warehouse"
              ? "Choose storage conditions"
              : "Destination city or PIN"}
          </small>
        </label>
        <label>
          <span>
            {tab === "warehouse" ? "CAPACITY NEEDED" : "GOODS & VEHICLE"}
          </span>
          <b>
            <PackageCheck />
            <input
              placeholder={
                tab === "warehouse" ? "10,000 sq ft" : "5 tonnes, 32 ft truck"
              }
            />
          </b>
          <small>
            {tab === "warehouse"
              ? "Approximate requirement"
              : "Approximate requirement"}
          </small>
        </label>
        <button className="search-submit" aria-label="Search">
          <Search />
        </button>
      </form>
      <p className="search-hint">
        <b>Popular:</b> Bhiwandi warehouses · Bengaluru fulfilment ·
        Mumbai–Delhi freight · Cold chain services
      </p>
    </div>
  );
}
function LegacyHome() {
  const nav = useNavigate();
  return (
    <PublicLayout>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <ShieldCheck /> INDIA'S VERIFIED LOGISTICS MARKETPLACE
            </span>
            <h1>
              Space for your goods.
              <br />
              <em>Routes for your growth.</em>
            </h1>
            <p>
              Discover trusted warehouses and logistics partners, compare
              capabilities, and connect directly—without booking fees.
            </p>
            <div className="hero-proof">
              <span>
                <b>1,200+</b> verified partners
              </span>
              <span>
                <b>86</b> logistics hubs
              </span>
              <span>
                <b>4.8/5</b> customer rating
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="route-line">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="visual-card warehouse-visual">
              <Warehouse />
              <span>48K sq ft</span>
              <b>Space available</b>
            </div>
            <div className="visual-card truck-visual">
              <Truck />
              <span>Live network</span>
              <b>Pan-India routes</b>
            </div>
            <div className="visual-shield">
              <ShieldCheck />
              <span>TRUST SCORE</span>
              <b>96</b>
            </div>
          </div>
        </div>
        <SearchPanel />
      </section>
      <section className="trust-strip">
        <span>
          <ShieldCheck /> Business verified
        </span>
        <span>
          <FileCheck2 /> Facility checked
        </span>
        <span>
          <Star /> Authentic reviews
        </span>
        <span>
          <Phone /> Direct contact
        </span>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">CURATED FOR YOUR BUSINESS</span>
            <h2>Storage spaces you can trust</h2>
            <p>
              High-performing facilities with verified information and fast
              response.
            </p>
          </div>
          <Link to="/warehouses">
            Explore all warehouses <ArrowRight />
          </Link>
        </div>
        <div className="cards-grid">
          {warehouses.slice(0, 3).map((x) => (
            <ListingCard key={x.id} item={x} />
          ))}
        </div>
      </section>
      <section className="process-section">
        <div>
          <span className="eyebrow">HOW TRUSTLOGIX WORKS</span>
          <h2>From requirement to reliable partner</h2>
          <p>
            We bring verified information and direct connections into one
            transparent experience.
          </p>
          <button
            className="btn btn-light"
            onClick={() => nav("/how-it-works")}
          >
            See how verification works <ArrowRight />
          </button>
        </div>
        <ol>
          <li>
            <b>01</b>
            <span>
              <strong>Search precisely</strong>
              <small>Set city, capacity, goods and service needs.</small>
            </span>
          </li>
          <li>
            <b>02</b>
            <span>
              <strong>Compare with confidence</strong>
              <small>
                Review trust score, facilities, pricing and ratings.
              </small>
            </span>
          </li>
          <li>
            <b>03</b>
            <span>
              <strong>Connect directly</strong>
              <small>Reveal verified contact details or send an enquiry.</small>
            </span>
          </li>
        </ol>
      </section>
      <section className="section pale">
        <div className="section-head">
          <div>
            <span className="eyebrow">ON THE MOVE</span>
            <h2>Logistics partners built for every route</h2>
          </div>
          <Link to="/logistics">
            Browse all providers <ArrowRight />
          </Link>
        </div>
        <div className="cards-grid">
          {logistics.slice(0, 3).map((x) => (
            <ListingCard key={x.id} item={x} type="logistics" />
          ))}
        </div>
      </section>
      <section className="city-section">
        <div>
          <span className="eyebrow">POPULAR LOGISTICS HUBS</span>
          <h2>Find reliable space across India</h2>
        </div>
        <div className="city-grid">
          {routes.map((r, i) => (
            <Link to={`/warehouses?city=${r}`} key={r}>
              <span>0{i + 1}</span>
              <b>{r}</b>
              <small>{[184, 162, 147, 119, 103, 96][i]} verified options</small>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
      <section className="cta-band">
        <div>
          <ShieldCheck />
          <span>
            <small>PARTNER WITH TRUSTLOGIX</small>
            <h2>Turn capacity into opportunity.</h2>
            <p>
              Join serious business buyers, build trust, and grow your enquiry
              pipeline.
            </p>
          </span>
        </div>
        <div>
          <Link className="btn btn-light" to="/register">
            List your business
          </Link>
          <Link className="btn btn-outline-light" to="/plans">
            View partner plans
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function Results({ type }) {
  const items = type === "warehouse" ? warehouses : logistics;
  const [sort, setSort] = useState("recommended");
  const [query, setQuery] = useState("");
  const [compare, setCompare] = useState(() => read("compare", []));
  const filtered = useMemo(
    () =>
      items
        .filter((x) =>
          JSON.stringify(x).toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "rating"
            ? b.rating - a.rating
            : sort === "price"
              ? (a.price || 0) - (b.price || 0)
              : b.score - a.score,
        ),
    [items, query, sort],
  );
  const add = (item) => {
    const n = compare.includes(item.id)
      ? compare.filter((x) => x !== item.id)
      : [...compare, item.id].slice(-3);
    setCompare(n);
    write("compare", n);
    toast.success(
      n.includes(item.id) ? "Added to comparison" : "Removed from comparison",
    );
  };
  return (
    <PublicLayout>
      <section className="results-top">
        <span className="eyebrow">TRUSTED MARKETPLACE</span>
        <h1>
          {type === "warehouse"
            ? "Warehouses across India"
            : "Logistics providers for every route"}
        </h1>
        <div className="compact-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              type === "warehouse"
                ? "Search city, area, warehouse type..."
                : "Search provider, route, vehicle..."
            }
          />
          <button className="btn btn-primary">Update search</button>
        </div>
      </section>
      <section className="results-layout">
        <aside className="filters">
          <div className="filter-title">
            <b>
              <SlidersHorizontal /> Filters
            </b>
            <button>Clear all</button>
          </div>
          {[
            "Location",
            "Trust & verification",
            "Pricing",
            "Customer rating",
            "Facilities",
            "Capacity & availability",
          ].map((x, i) => (
            <details open={i < 3} key={x}>
              <summary>
                {x}
                <ChevronRight />
              </summary>
              <label>
                <input type="checkbox" />{" "}
                {i === 0 ? "Near logistics hub" : "Platform verified"}
              </label>
              <label>
                <input type="checkbox" />{" "}
                {i === 1 ? "Facility / fleet verified" : "Fast response"}
              </label>
              <label>
                <input type="checkbox" />{" "}
                {i === 2 ? "Pro Partner" : "4.5+ rating"}
              </label>
            </details>
          ))}
        </aside>
        <div className="results-main">
          <div className="results-toolbar">
            <div>
              <b>{filtered.length} verified options</b>
              <span> matched to your requirement</span>
            </div>
            <div>
              <button className="icon-btn">
                <Grid2X2 />
              </button>
              <button className="icon-btn">
                <List />
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="rating">Customer rating</option>
                <option value="price">Price: low to high</option>
              </select>
            </div>
          </div>
          {compare.length > 0 && (
            <div className="compare-bar">
              <b>{compare.length} selected for comparison</b>
              <Link className="btn btn-dark btn-sm" to="/compare">
                Compare now
              </Link>
            </div>
          )}
          <div className="result-cards">
            {filtered.length ? (
              filtered.map((x) => (
                <ListingCard key={x.id} item={x} type={type} onCompare={add} />
              ))
            ) : (
              <div className="empty-state">
                <Search />
                <h3>No exact matches found</h3>
                <p>
                  Try removing a filter or searching a nearby logistics hub.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setQuery("")}
                >
                  Reset search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Details({ type }) {
  const { id } = useParams();
  const item =
    (type === "warehouse" ? warehouses : logistics).find(
      (x) => x.id === Number(id),
    ) || (type === "warehouse" ? warehouses[0] : logistics[0]);
  const [modal, setModal] = useState(null);
  const reveal = () => {
    write("contactReveals", [
      ...read("contactReveals", []),
      { id: item.id, date: new Date().toISOString() },
    ]);
    setModal("contact");
  };
  const enquire = (e) => {
    e.preventDefault();
    write("enquiries", [
      ...read("enquiries", []),
      { id: Date.now(), listing: item.name, status: "Submitted" },
    ]);
    toast.success("Enquiry sent to the provider");
    setModal(null);
  };
  return (
    <PublicLayout>
      <section className="detail-wrap">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight />
          <Link to={`/${type === "warehouse" ? "warehouses" : "logistics"}`}>
            {type === "warehouse" ? "Warehouses" : "Logistics"}
          </Link>
          <ChevronRight />
          <span>{item.name}</span>
        </div>
        <div className="gallery">
          <img src={item.image} alt={item.name} />
          <img
            src={
              type === "warehouse" ? warehouses[1].image : logistics[1].image
            }
            alt="Facility view"
          />
          <div className="gallery-score">
            <ShieldCheck />
            <span>TRUST SCORE</span>
            <b>{item.score}</b>
            <small>Excellent</small>
          </div>
        </div>
        <div className="detail-grid">
          <div>
            <div className="detail-title">
              <div>
                <span className="eyebrow">
                  {item.tag || "PLATFORM VERIFIED"}
                </span>
                <h1>{item.name}</h1>
                <p>
                  <MapPin />{" "}
                  {type === "warehouse"
                    ? `${item.area}, ${item.city}`
                    : item.route}
                </p>
              </div>
              <div className="rating-box">
                <b>{item.rating}</b>
                <span>
                  <Star fill="currentColor" /> Exceptional
                </span>
                <small>{item.reviews} verified reviews</small>
              </div>
            </div>
            <div className="info-card">
              <h2>
                {type === "warehouse"
                  ? "Space built for modern operations"
                  : "Reliable freight, every kilometre"}
              </h2>
              <p>
                {type === "warehouse"
                  ? "A professionally managed, high-compliance storage facility with flexible capacity, transparent indicative pricing and direct access to the facility team."
                  : "A verified carrier network with trained drivers, compliant vehicles and responsive coordination across major Indian routes."}
              </p>
              <div className="spec-grid">
                {(type === "warehouse"
                  ? [
                      "Available: " + item.capacity,
                      item.type,
                      "24×7 operations",
                      "Large vehicle access",
                    ]
                  : [
                      "Fleet: " + item.fleet,
                      item.vehicle,
                      "GPS available",
                      "Proof of delivery",
                    ]
                ).map((x) => (
                  <span key={x}>
                    <CheckCircle2 />
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div className="info-card">
              <h2>Verification you can inspect</h2>
              <div className="verify-grid">
                <span>
                  <ShieldCheck />
                  <b>Business identity</b>
                  <small>Verified on 24 Jul 2026</small>
                </span>
                <span>
                  <FileCheck2 />
                  <b>
                    {type === "warehouse"
                      ? "Facility assessment"
                      : "Fleet documents"}
                  </b>
                  <small>Checks successfully completed</small>
                </span>
                <span>
                  <Star />
                  <b>Review integrity</b>
                  <small>Authenticated customer feedback</small>
                </span>
              </div>
            </div>
            <div className="disclaimer">
              <ShieldCheck />
              <p>{disclaimer}</p>
            </div>
          </div>
          <aside className="contact-card">
            <span className="eyebrow">DIRECT PROVIDER CONTACT</span>
            <h2>
              {type === "warehouse"
                ? `₹${item.price} ${item.unit}`
                : item.price}
            </h2>
            <p>
              Indicative starting price. Final terms are discussed directly.
            </p>
            <button className="btn btn-primary btn-block" onClick={reveal}>
              <Phone /> Reveal contact number
            </button>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => setModal("enquiry")}
            >
              <MessageSquare /> Send an enquiry
            </button>
            <div className="response-note">
              <Clock3 />
              <span>
                <b>Usually responds in 18 minutes</b>
                <small>No booking or payment is taken here.</small>
              </span>
            </div>
          </aside>
        </div>
      </section>
      <Modal
        open={modal === "contact"}
        onClose={() => setModal(null)}
        title="Verified provider contact"
      >
        <div className="contact-reveal">
          <ShieldCheck />
          <p>
            Contact for <b>{item.name}</b>
          </p>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              navigator.clipboard?.writeText("+91 98765 43210");
              toast.success("Contact copied");
            }}
          >
            Copy contact
          </button>
          <small>{disclaimer}</small>
        </div>
      </Modal>
      <Modal
        open={modal === "enquiry"}
        onClose={() => setModal(null)}
        title="Send your requirement"
      >
        <form className="modal-form" onSubmit={enquire}>
          <label>
            Full name
            <input required minLength="3" placeholder="Your full name" />
          </label>
          <label>
            Mobile number
            <input
              required
              pattern="[6-9][0-9]{9}"
              placeholder="10-digit Indian mobile number"
            />
          </label>
          <label>
            Requirement
            <textarea
              required
              minLength="20"
              placeholder="Describe capacity, goods, route or preferred date"
            />
          </label>
          <button className="btn btn-primary btn-block">Send enquiry</button>
          <small>{disclaimer}</small>
        </form>
      </Modal>
    </PublicLayout>
  );
}

const dashData = [
  { m: "Apr", v: 42, l: 26 },
  { m: "May", v: 57, l: 35 },
  { m: "Jun", v: 49, l: 41 },
  { m: "Jul", v: 76, l: 52 },
  { m: "Aug", v: 89, l: 64 },
  { m: "Sep", v: 104, l: 78 },
];
function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const role = user?.role || "CUSTOMER";
  const roleName = role
    .split("_")
    .map((x) => x[0] + x.slice(1).toLowerCase())
    .join(" ");
  const metrics =
    role === "SYSTEM_OWNER"
      ? [
          ["Verified partners", "1,284", "+12.4%"],
          ["Pending checks", "38", "Action needed"],
          ["Active enquiries", "4,892", "+18.2%"],
          ["Platform trust", "92.6", "Excellent"],
        ]
      : role === "CUSTOMER"
        ? [
            ["Saved listings", "12", "3 new"],
            ["Active enquiries", "6", "2 updated"],
            ["Contact reveals", "9", "This month"],
            ["Reviews submitted", "4", "All published"],
          ]
        : [
            ["Active listings", "8", "All visible"],
            ["New enquiries", "26", "+18.2%"],
            ["Contact reveals", "184", "+22.8%"],
            ["Average trust score", "93", "Excellent"],
          ];
  const menus =
    role === "CUSTOMER"
      ? [
          "Dashboard",
          "Find Warehouses",
          "Find Logistics",
          "Saved Listings",
          "Compare Listings",
          "My Enquiries",
          "Contact History",
          "My Reviews",
          "Complaints & Support",
          "Notifications",
          "Profile & Security",
        ]
      : role === "SYSTEM_OWNER"
        ? [
            "Overview",
            "Verification Queue",
            "Users & Partners",
            "Listings",
            "Reviews",
            "Complaints",
            "Subscriptions",
            "Reports & Analytics",
            "Audit Logs",
            "Settings",
          ]
        : [
            "Dashboard",
            "Business Verification",
            "My Listings",
            "Enquiries & Leads",
            "Contact Activity",
            "Reviews & Ratings",
            "Pricing & Offers",
            "Reports & Analytics",
            "Subscription",
            "Notifications",
            "Business Profile",
          ];
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Logo light />
        <small className="side-label">{roleName.toUpperCase()} PORTAL</small>
        <nav>
          {menus.map((x, i) => (
            <button className={i === 0 ? "active" : ""} key={x}>
              {
                [
                  <Grid2X2 />,
                  <ShieldCheck />,
                  <Building2 />,
                  <MessageSquare />,
                  <Phone />,
                  <Star />,
                  <IndianRupee />,
                  <BarChart3 />,
                  <FileCheck2 />,
                  <Bell />,
                ][i % 10]
              }
              <span>{x}</span>
              {i === 3 && <em>6</em>}
            </button>
          ))}
        </nav>
        <div className="side-user">
          <span>
            {user?.name
              ?.split(" ")
              .map((x) => x[0])
              .join("")}
          </span>
          <div>
            <b>{user?.name}</b>
            <small>{roleName}</small>
          </div>
          <button
            onClick={() => {
              logout();
              nav("/");
            }}
            aria-label="Logout"
          >
            <LogOut />
          </button>
        </div>
      </aside>
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <button className="icon-btn dash-menu">
              <Menu />
            </button>
            <small>MONDAY, 3 AUGUST</small>
            <h1>Good afternoon, {user?.name?.split(" ")[0]}.</h1>
            <p>Here’s what’s happening across your TRUSTLOGIX account.</p>
          </div>
          <div>
            <button className="icon-btn">
              <Search />
            </button>
            <button className="icon-btn badge-dot">
              <Bell />
            </button>
            <button className="btn btn-primary">
              <Plus />{" "}
              {role === "CUSTOMER"
                ? "New search"
                : role === "SYSTEM_OWNER"
                  ? "Review queue"
                  : "Add listing"}
            </button>
          </div>
        </header>
        <section className="metric-grid">
          {metrics.map((m, i) => (
            <article key={m[0]}>
              <span className={`metric-icon m${i}`}>
                {
                  [<Building2 />, <MessageSquare />, <Eye />, <ShieldCheck />][
                    i
                  ]
                }
              </span>
              <small>{m[0]}</small>
              <b>{m[1]}</b>
              <em>{m[2]}</em>
            </article>
          ))}
        </section>
        <section className="dash-grid">
          <article className="chart-card wide">
            <div className="chart-title">
              <div>
                <small>PERFORMANCE</small>
                <h2>Enquiries & contact activity</h2>
              </div>
              <select>
                <option>Last 6 months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={dashData}>
                <defs>
                  <linearGradient id="redfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ed2e35" stopOpacity={0.25} />
                    <stop offset="1" stopColor="#ed2e35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey="v"
                  stroke="#ed2e35"
                  fill="url(#redfill)"
                  strokeWidth={3}
                />
                <Line dataKey="l" stroke="#17233b" />
              </AreaChart>
            </ResponsiveContainer>
          </article>
          <article className="chart-card">
            <div className="chart-title">
              <div>
                <small>TRUST HEALTH</small>
                <h2>Verification status</h2>
              </div>
            </div>
            <div className="trust-donut">
              <span>
                <b>93</b>
                <small>Excellent</small>
              </span>
            </div>
            <ul className="check-list">
              <li>
                <CheckCircle2 /> Business identity <b>Verified</b>
              </li>
              <li>
                <CheckCircle2 /> Document status <b>Current</b>
              </li>
              <li>
                <CheckCircle2 /> Response quality <b>Strong</b>
              </li>
            </ul>
          </article>
          <article className="chart-card wide">
            <div className="chart-title">
              <div>
                <small>RECENT ACTIVITY</small>
                <h2>Latest enquiries</h2>
              </div>
              <button className="text-btn">
                View all <ArrowRight />
              </button>
            </div>
            <div className="data-table">
              <div className="table-head">
                <span>Contact</span>
                <span>Requirement</span>
                <span>Status</span>
                <span>Received</span>
              </div>
              {[
                ["Neha Sharma", "12,000 sq ft • Mumbai", "New", "8 min ago"],
                [
                  "Karan Patel",
                  "32 ft truck • Pune–Delhi",
                  "Contacted",
                  "34 min ago",
                ],
                [
                  "S. Iyer Foods",
                  "Cold storage • 18 pallets",
                  "Negotiation",
                  "2 hr ago",
                ],
              ].map((r) => (
                <div className="table-row" key={r[0]}>
                  <span>
                    <b>{r[0]}</b>
                    <small>Verified customer</small>
                  </span>
                  <span>{r[1]}</span>
                  <span>
                    <em className="status-chip">{r[2]}</em>
                  </span>
                  <span>{r[3]}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="chart-card">
            <div className="chart-title">
              <div>
                <small>QUICK ACTIONS</small>
                <h2>Keep your profile strong</h2>
              </div>
            </div>
            <div className="quick-actions">
              <button>
                <span>
                  <FileCheck2 />
                  <b>Update availability</b>
                  <small>Last updated 2 days ago</small>
                </span>
                <ChevronRight />
              </button>
              <button>
                <span>
                  <MessageSquare />
                  <b>Reply to enquiries</b>
                  <small>6 waiting for response</small>
                </span>
                <ChevronRight />
              </button>
              <button>
                <span>
                  <TrendingUp />
                  <b>View performance</b>
                  <small>Insights for this month</small>
                </span>
                <ChevronRight />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
function Protected() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Navigate to="/login" replace />;
}

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [show, setShow] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const u = demoUsers[role];
    login(u);
    toast.success(`Welcome back, ${u.name}`);
    nav(`/${role.toLowerCase().replaceAll("_", "-")}/dashboard`);
  };
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Logo light />
        <div className="auth-copy">
          <span className="eyebrow">CONNECTED LOGISTICS ECOSYSTEM</span>
          <h1>
            Trust moves
            <br />
            business forward.
          </h1>
          <p>
            One secure portal for warehouse discovery, logistics partnerships,
            enquiries and operations.
          </p>
          <div className="auth-stats">
            <span>
              <ShieldCheck />
              <b>1,200+</b>
              <small>Verified partners</small>
            </span>
            <span>
              <Truck />
              <b>86</b>
              <small>Logistics hubs</small>
            </span>
            <span>
              <Star />
              <b>4.8/5</b>
              <small>Customer trust</small>
            </span>
          </div>
        </div>
        <div className="auth-route">
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-icon">
            <LockKeyhole />
          </div>
          <span className="eyebrow">SECURE OPERATIONS PORTAL</span>
          <h2>Welcome to TRUSTLOGIX</h2>
          <p>Access your account and continue where you left off.</p>
          <label>
            Demo account
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {Object.entries(demoUsers).map(([k, u]) => (
                <option value={k} key={k}>
                  {u.name} — {k.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label>
            Email or mobile number
            <div className="input-icon">
              <Mail />
              <input required defaultValue={demoUsers[role].email} key={role} />
            </div>
          </label>
          <label>
            Password
            <div className="input-icon">
              <LockKeyhole />
              <input
                required
                type={show ? "text" : "password"}
                defaultValue="Trust@123"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Show password"
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          <div className="form-row">
            <label className="check">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button className="btn btn-primary btn-block">
            Sign in <ArrowRight />
          </button>
          <p className="register-link">
            New to TRUSTLOGIX? <Link to="/register">Create an account</Link>
          </p>
          <small className="secure-note">
            <ShieldCheck /> Your data is protected with secure authentication
          </small>
        </form>
      </div>
    </div>
  );
}

function Compare() {
  const ids = read("compare", [1, 2]);
  const all = [...warehouses, ...logistics];
  const list = ids.map((id) => all.find((x) => x.id === id)).filter(Boolean);
  return (
    <PublicLayout>
      <section className="simple-hero">
        <span className="eyebrow">SIDE-BY-SIDE CLARITY</span>
        <h1>Compare verified listings</h1>
        <p>See trust, capability and indicative pricing in one view.</p>
      </section>
      <section className="compare-section">
        {list.length < 2 ? (
          <div className="empty-state">
            <BarChart3 />
            <h3>Add at least two listings</h3>
            <p>Use the compare icon on warehouse or logistics result cards.</p>
            <Link className="btn btn-primary" to="/warehouses">
              Browse warehouses
            </Link>
          </div>
        ) : (
          <div className="compare-table">
            <div className="compare-row heading">
              <b>Criteria</b>
              {list.map((x) => (
                <div key={x.id}>
                  <img src={x.image} alt="" />
                  <b>{x.name}</b>
                </div>
              ))}
            </div>
            {[
              ["Trust score", (x) => x.score],
              ["Customer rating", (x) => `${x.rating} / 5`],
              [
                "Indicative price",
                (x) =>
                  x.price > 100 ? x.price : `₹${x.price} ${x.unit || ""}`,
              ],
              [
                "Availability / Fleet",
                (x) => x.capacity || `${x.fleet} vehicles`,
              ],
              ["Verification", () => "Platform verified"],
            ].map(([label, get]) => (
              <div className="compare-row" key={label}>
                <b>{label}</b>
                {list.map((x) => (
                  <span key={x.id}>{get(x)}</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}

const pageCopy = {
  about: [
    "About TRUSTLOGIX",
    "India’s trust layer for warehouse and logistics discovery.",
    "We make fragmented supply-chain decisions clearer by combining verified business information, facility and fleet checks, authentic customer feedback, and direct provider connections.",
  ],
  "how-it-works": [
    "How TRUSTLOGIX works",
    "A direct path from requirement to reliable provider.",
    "Search with operational criteria, compare transparent profiles, inspect Trust Scores, then reveal contact details or send an enquiry. Final commercial decisions always happen directly with the provider.",
  ],
  verification: [
    "Verification that means something",
    "Evidence-backed profiles, clearly explained.",
    "Business identity, operational documents, facility or fleet evidence, and ongoing expiry monitoring combine into a Trust Score. Paid plans never influence verification.",
  ],
  plans: [
    "Simple partner plans",
    "Choose visibility and insight—not verification.",
    "Standard gives you core listing and enquiry tools. Pro adds richer analytics, offers and priority support. Enterprise supports multi-location operations and custom reporting.",
  ],
  help: [
    "Help centre",
    "Practical answers for customers and partners.",
    "Explore account access, search and comparison, verification, enquiries, reviews, complaints, subscriptions and privacy. Our support team responds Monday to Saturday.",
  ],
  contact: [
    "Contact our team",
    "We’re here to help you move forward.",
    "Reach TRUSTLOGIX support at support@trustlogix.in or +91 80 4567 8900, Monday–Saturday, 9:00–18:00 IST.",
  ],
  register: [
    "Join the TRUSTLOGIX network",
    "Choose how you want to use the marketplace.",
    "Create a customer account to save and compare listings, or register a warehouse or logistics business to begin verification and receive direct enquiries.",
  ],
  "forgot-password": [
    "Reset your password",
    "Secure recovery in a few steps.",
    "Enter your verified email or mobile number. We’ll send a one-time password and help you choose a new password securely.",
  ],
  partners: [
    "Grow through trusted discovery",
    "Turn real capacity and capability into qualified conversations.",
    "Create a professional business profile, complete verification, publish listings, respond to customer enquiries and understand profile performance.",
  ],
  saved: [
    "Your saved listings",
    "Keep promising partners close.",
    "Saved listings are stored on this device. Visit search results and tap the heart icon to build your shortlist.",
  ],
  "trust-safety": [
    "Trust and safety",
    "Transparent information. Responsible connections.",
    "We monitor verification status, reviews, complaints and suspicious profile activity. Always validate commercial terms and documents directly before entering an agreement.",
  ],
  privacy: [
    "Privacy policy",
    "How we handle marketplace information.",
    "We collect account, enquiry and interaction data required to operate TRUSTLOGIX. Contact details are revealed only through deliberate user action and activity is recorded for safety.",
  ],
  terms: [
    "Terms and conditions",
    "Clear rules for a lead-generation marketplace.",
    "TRUSTLOGIX provides discovery, comparison and contact tools. It is not a party to provider agreements, bookings, payments or service delivery.",
  ],
  "review-guidelines": [
    "Review guidelines",
    "Authentic experiences make the network stronger.",
    "Reviews must reflect a genuine provider interaction, remain factual and respectful, and avoid personal or confidential information. Owners may respond but cannot delete customer reviews.",
  ],
  "complaint-policy": [
    "Complaint policy",
    "A fair process for marketplace concerns.",
    "Report incorrect information, fake images, pricing differences, behaviour, safety, goods handling or contact issues. Each complaint receives a status and documented timeline.",
  ],
};
function InfoPage({ kind }) {
  const c = pageCopy[kind] || [
    "TRUSTLOGIX",
    "A better logistics marketplace experience.",
    "Explore verified providers, compare real operational details and make direct business connections.",
  ];
  return (
    <PublicLayout>
      <section className="simple-hero">
        <span className="eyebrow">TRUSTLOGIX RESOURCE</span>
        <h1>{c[0]}</h1>
        <p>{c[1]}</p>
      </section>
      <section className="info-page">
        <article>
          <ShieldCheck />
          <h2>Built around confident decisions</h2>
          <p>{c[2]}</p>
          <div className="info-steps">
            <span>
              <b>01</b>
              <h3>Verified information</h3>
              <p>
                Structured evidence and visible status keep profiles
                accountable.
              </p>
            </span>
            <span>
              <b>02</b>
              <h3>Direct communication</h3>
              <p>
                Reach providers without checkout, booking fees or platform
                commission.
              </p>
            </span>
            <span>
              <b>03</b>
              <h3>Ongoing trust</h3>
              <p>
                Reviews, expiry checks and support help preserve marketplace
                quality.
              </p>
            </span>
          </div>
        </article>
        <aside>
          <h3>Need a hand?</h3>
          <p>Our marketplace support specialists can guide you.</p>
          <Link className="btn btn-primary btn-block" to="/contact">
            Contact support
          </Link>
          <Link className="btn btn-secondary btn-block" to="/warehouses">
            Explore marketplace
          </Link>
        </aside>
      </section>
    </PublicLayout>
  );
}
function NotFound() {
  return (
    <PublicLayout>
      <div className="not-found">
        <b>404</b>
        <h1>This route went off course.</h1>
        <p>The page may have moved, but trusted partners are still close by.</p>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </PublicLayout>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingHome />} />
      <Route path="/warehouses" element={<Results type="warehouse" />} />
      <Route path="/logistics" element={<Results type="logistics" />} />
      <Route path="/warehouse/:id" element={<WarehouseShowcase />} />
      <Route path="/logistics/:id" element={<LogisticsShowcase />} />
      <Route
        path="/customer/warehouses/:warehouseId"
        element={<WarehouseShowcase />}
      />
      <Route
        path="/customer/logistics/:providerId"
        element={<LogisticsShowcase />}
      />
      <Route
        path="/customer/logistics/:providerId/vehicles"
        element={<ProviderVehicles />}
      />
      <Route
        path="/customer/logistics/:providerId/vehicles/:vehicleId"
        element={<VehicleShowcase />}
      />
      <Route path="/compare" element={<Compare />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<NotFound />} />
      {Object.keys(pageCopy).map((k) => (
        <Route key={k} path={`/${k}`} element={<InfoPage kind={k} />} />
      ))}
      <Route path="/:role/*" element={<RoleApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
