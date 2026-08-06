import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

function CityMapMarker({ city, selected, onSelect }) {
    return (
        <div
            className={`india-hub-marker label-${city.labelPosition}${selected ? " selected" : ""}`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
        >
            <button
                className="india-hub-pin"
                aria-label={`Show warehouse and logistics options in ${city.name}`}
                aria-expanded={selected}
                onClick={() => onSelect(selected ? "" : city.name)}
            ><MapPin /></button>
            <span className="india-hub-label">
                <b>{city.name}</b>
                <small>{city.verifiedOptions} verified options</small>
                <span className="india-hub-actions">
                    <Link to={`/warehouses?city=${encodeURIComponent(city.routeValue)}`} aria-label={`Explore verified warehouses in ${city.name}`}>Warehouses <ArrowRight /></Link>
                    <Link to={`/logistics?location=${encodeURIComponent(city.routeValue)}`} aria-label={`Explore logistics providers in ${city.name}`}>Logistics <ArrowRight /></Link>
                </span>
            </span>
        </div>
    );
}

export default function IndiaBusinessHubsMap({ cities }) {
    const [selectedCity, setSelectedCity] = useState("");

    return (
        <div className="india-hubs-map-wrap">
            <div className="india-hubs-map" aria-label="Popular warehouse hubs across India">
                <svg className="india-map-shape" viewBox="0 0 600 680" role="img" aria-label="Map of India">
                    <defs>
                        <pattern id="india-map-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.4" fill="currentColor" opacity=".22" />
                        </pattern>
                    </defs>
                    <path
                        className="india-map-shadow"
                        d="M529.2 194.1 530.4 202.1 524.8 205.9 526.1 218.8 514.7 215 494 229.6 494.5 241.6 485.7 259.2 484.8 269.4 477.7 286.7 465.2 282 464.6 303.7 461 310.8 462.7 319.8 454.8 324.7 446.3 291.4 441.9 291.5 439.3 304.9 430.5 294 435.5 282.1 442.6 280.9 450 263.1 440.8 259.5 426 259.8 410.7 256.9 409.3 242.3 401.7 241.3 389 232.2 383.4 246.5 394.9 257.6 384.9 265.4 381.4 273.1 391.2 278.7 388.5 291.3 394 307.1 396.5 324.4 394.2 332.1 383.3 331.8 363.6 336.2 364.5 352 356 364.4 333 378.5 315.1 403.3 303 416.5 287.1 430.3 287.1 439.9 279.1 445.1 264.7 452.6 257.2 453.7 252.4 469.7 255.7 497 256.6 514.5 249.8 534.4 249.7 570.1 241.4 571.1 234.2 587.1 239 594.1 224.4 600 219.1 614.3 212.6 620.3 197.5 600.7 190.1 571.3 183.9 550.1 178.3 540.2 169.8 520 165.9 493.8 163.1 480.6 148.5 451.8 141.9 411.1 137.1 384.2 137.2 358.8 134.1 339.1 110.8 351.7 99.5 349.2 78.6 323.7 86.3 316.1 81.6 307.9 62.8 290.1 73.5 276.1 108.7 276.1 105.5 258.1 96.5 247.4 94.7 231.3 84.2 221.8 101.9 199.8 120.4 201.4 137.2 179.4 147.2 158.1 162.7 137 162.5 122.1 176.1 109.9 163.2 99.5 157.7 85.3 152 66.9 159.8 57.9 184.1 63 201.9 59.9 217.4 42.2 234.6 66.8 233 84 239.3 94.7 238.8 105.4 227.3 102.6 231.8 125.8 247.5 139.1 269.8 153.7 259.6 163.3 253.4 182.9 268.9 190.9 284 201.2 304.9 212.9 326.8 215.7 336 226.3 348.4 228.3 367.6 233.2 381 232.9 382.8 224.6 380.7 211.2 381.9 202.2 391.7 197.8 393 214.3 393.4 218.5 407.9 226.5 418 223.2 431.5 224.6 444.5 224 445.7 211.1 439.1 204.4 452 201.8 466.6 186.1 485.1 172.8 498.5 177.9 509.9 169.1 517.4 182.1 512 191Z"
                    />
                    <path
                        className="india-map-land"
                        d="M529.2 194.1 530.4 202.1 524.8 205.9 526.1 218.8 514.7 215 494 229.6 494.5 241.6 485.7 259.2 484.8 269.4 477.7 286.7 465.2 282 464.6 303.7 461 310.8 462.7 319.8 454.8 324.7 446.3 291.4 441.9 291.5 439.3 304.9 430.5 294 435.5 282.1 442.6 280.9 450 263.1 440.8 259.5 426 259.8 410.7 256.9 409.3 242.3 401.7 241.3 389 232.2 383.4 246.5 394.9 257.6 384.9 265.4 381.4 273.1 391.2 278.7 388.5 291.3 394 307.1 396.5 324.4 394.2 332.1 383.3 331.8 363.6 336.2 364.5 352 356 364.4 333 378.5 315.1 403.3 303 416.5 287.1 430.3 287.1 439.9 279.1 445.1 264.7 452.6 257.2 453.7 252.4 469.7 255.7 497 256.6 514.5 249.8 534.4 249.7 570.1 241.4 571.1 234.2 587.1 239 594.1 224.4 600 219.1 614.3 212.6 620.3 197.5 600.7 190.1 571.3 183.9 550.1 178.3 540.2 169.8 520 165.9 493.8 163.1 480.6 148.5 451.8 141.9 411.1 137.1 384.2 137.2 358.8 134.1 339.1 110.8 351.7 99.5 349.2 78.6 323.7 86.3 316.1 81.6 307.9 62.8 290.1 73.5 276.1 108.7 276.1 105.5 258.1 96.5 247.4 94.7 231.3 84.2 221.8 101.9 199.8 120.4 201.4 137.2 179.4 147.2 158.1 162.7 137 162.5 122.1 176.1 109.9 163.2 99.5 157.7 85.3 152 66.9 159.8 57.9 184.1 63 201.9 59.9 217.4 42.2 234.6 66.8 233 84 239.3 94.7 238.8 105.4 227.3 102.6 231.8 125.8 247.5 139.1 269.8 153.7 259.6 163.3 253.4 182.9 268.9 190.9 284 201.2 304.9 212.9 326.8 215.7 336 226.3 348.4 228.3 367.6 233.2 381 232.9 382.8 224.6 380.7 211.2 381.9 202.2 391.7 197.8 393 214.3 393.4 218.5 407.9 226.5 418 223.2 431.5 224.6 444.5 224 445.7 211.1 439.1 204.4 452 201.8 466.6 186.1 485.1 172.8 498.5 177.9 509.9 169.1 517.4 182.1 512 191Z"
                    />
                    <path className="india-map-detail" d="M123 247 208 275 282 244 371 271 439 237M153 371 244 343 335 375 401 331M188 493 272 457 335 474M214 544 294 520" />
                    <circle className="india-map-island" cx="300" cy="666" r="5" />
                </svg>

                {cities.map((city) => (
                    <CityMapMarker
                        city={city}
                        key={city.name}
                        selected={selectedCity === city.name}
                        onSelect={setSelectedCity}
                    />
                ))}
            </div>

            <div className="india-hub-chips" aria-label="Business hub shortcuts">
                {cities.map((city) => (
                    <div key={city.name}>
                        <MapPin /><span><b>{city.name}</b><small>{city.verifiedOptions} options</small></span>
                        <nav><Link to={`/warehouses?city=${encodeURIComponent(city.routeValue)}`}>Warehouses</Link><Link to={`/logistics?location=${encodeURIComponent(city.routeValue)}`}>Logistics</Link></nav>
                    </div>
                ))}
            </div>
        </div>
    );
}
