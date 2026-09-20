import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Train,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  TrendingDown,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  Ticket
} from "lucide-react";

// Dhaka Metro Rail (MRT Line-6) Stations in Sequence (Uttara North -> Kamalapur)
const MRT_STATIONS = [
  {
    id: "uttara-north",
    name: "Uttara North (Diabari)",
    bnName: "উত্তরা উত্তর (দিয়াবাড়ী)",
    order: 1,
    avgRent2BHK: "৳15,000 - ৳22,000",
    avgBachelorSublet: "৳4,000 - ৳6,500",
    keyNearby: ["Diabari Lake", "Milestone College", "Uttara Sector 15-18", "BRTA Diabari"],
    vibe: "Peaceful, modern wide roads, open air, great for families and Diabari students.",
  },
  {
    id: "uttara-center",
    name: "Uttara Center",
    bnName: "উত্তরা সেন্টার",
    order: 2,
    avgRent2BHK: "৳18,000 - ৳26,000",
    avgBachelorSublet: "৳5,000 - ৳7,500",
    keyNearby: ["Uttara Sector 10, 11, 12", "Zamzam Tower", "Scholastica"],
    vibe: "Prime residential sectors with top schools, banks, and shopping malls.",
  },
  {
    id: "uttara-south",
    name: "Uttara South",
    bnName: "উত্তরা দক্ষিণ",
    order: 3,
    avgRent2BHK: "৳18,000 - ৳25,000",
    avgBachelorSublet: "৳5,000 - ৳7,000",
    keyNearby: ["Uttara Sector 8, 9", "Airport Road Access", "Rajlaxmi Complex"],
    vibe: "High accessibility to Airport, railway station, and Dhaka-Mymensingh highway.",
  },
  {
    id: "pallabi",
    name: "Pallabi",
    bnName: "পল্লবী",
    order: 4,
    avgRent2BHK: "৳14,000 - ৳20,000",
    avgBachelorSublet: "৳3,800 - ৳5,500",
    keyNearby: ["Mirpur 12 Bus Stand", "Pallabi Thana", "Eastern Housing", "Sagarika"],
    vibe: "Highly affordable bachelors & family flats with low grocery and market costs.",
  },
  {
    id: "mirpur-11",
    name: "Mirpur 11",
    bnName: "মিরপুর ১১",
    order: 5,
    avgRent2BHK: "৳15,000 - ৳22,000",
    avgBachelorSublet: "৳4,200 - ৳6,000",
    keyNearby: ["Bihari Camp Kebabs", "Purobi Cinema Hall", "Mirpur 11 Kitchen Market"],
    vibe: "Vibrant food culture, bustling local bazaars, great for foodies and bachelors.",
  },
  {
    id: "mirpur-10",
    name: "Mirpur 10",
    bnName: "মিরপুর ১০",
    order: 6,
    avgRent2BHK: "৳17,000 - ৳25,000",
    avgBachelorSublet: "৳4,500 - ৳6,800",
    keyNearby: ["Sher-e-Bangla National Cricket Stadium", "Mirpur 10 Golchokkor", "Fire Service"],
    vibe: "Central transit interchange with connecting buses to everywhere in Dhaka.",
  },
  {
    id: "kazipara",
    name: "Kazipara",
    bnName: "কাজীপাড়া",
    order: 7,
    avgRent2BHK: "৳16,000 - ৳23,000",
    avgBachelorSublet: "৳4,500 - ৳6,500",
    keyNearby: ["Rokeya Sarani", "Kazipara Bus Stand", "Model High School"],
    vibe: "Popular middle-class family neighborhood with quiet inner alleys and quick metro access.",
  },
  {
    id: "shewrapara",
    name: "Shewrapara",
    bnName: "শেওড়াপাড়া",
    order: 8,
    avgRent2BHK: "৳16,500 - ৳24,000",
    avgBachelorSublet: "৳4,800 - ৳6,800",
    keyNearby: ["West Shewrapara Bazaar", "East Shewrapara", "Hazi Ashraf Ali High School"],
    vibe: "Thriving residential neighborhood with immediate walking proximity to stations.",
  },
  {
    id: "agargaon",
    name: "Agargaon",
    bnName: "আগারগাঁও",
    order: 9,
    avgRent2BHK: "৳20,000 - ৳30,000",
    avgBachelorSublet: "৳6,000 - ৳8,500",
    keyNearby: ["Passport Office", "Election Commission", "IDB Bhaban", "Sher-e-Bangla Nagar"],
    vibe: "Government officers zone, IT hub, wide green spaces, and clean environment.",
  },
  {
    id: "bijoy-sarani",
    name: "Bijoy Sarani",
    bnName: "বিজয় সরণি",
    order: 10,
    avgRent2BHK: "৳24,000 - ৳38,000",
    avgBachelorSublet: "৳7,000 - ৳10,000",
    keyNearby: ["Military Museum", "Novotheatre", "Tejgaon Old Airport", "Rangs Bhaban"],
    vibe: "Prime central Dhaka connection with fast transit to Banani & Farmgate.",
  },
  {
    id: "farmgate",
    name: "Farmgate",
    bnName: "ফার্মগেট",
    order: 11,
    avgRent2BHK: "৳22,000 - ৳34,000",
    avgBachelorSublet: "৳6,000 - ৳9,000",
    keyNearby: ["Holy Cross College", "Tejgaon College", "Indira Road", "Ananda Cinema"],
    vibe: "Major educational coaching & student hub, walkable to Kawran Bazar and Green Road.",
  },
  {
    id: "karwan-bazar",
    name: "Karwan Bazar",
    bnName: "কাওরান বাজার",
    order: 12,
    avgRent2BHK: "৳24,000 - ৳38,000",
    avgBachelorSublet: "৳7,000 - ৳10,000",
    keyNearby: ["Petrobangla", "Titas Gas HQ", "Media TV Channels", "Wholesale Market"],
    vibe: "Dhaka's prime commercial media & corporate heartland.",
  },
  {
    id: "shahbagh",
    name: "Shahbagh",
    bnName: "শাহবাগ",
    order: 13,
    avgRent2BHK: "৳25,000 - ৳40,000",
    avgBachelorSublet: "৳7,500 - ৳11,000",
    keyNearby: ["BSMMU (PG Hospital)", "BIRDEM", "National Museum", "Dhaka Club"],
    vibe: "Medical & cultural nucleus of Bangladesh, adjacent to Ramna Park and TSC.",
  },
  {
    id: "dhaka-university",
    name: "Dhaka University (DU)",
    bnName: "ঢাকা বিশ্ববিদ্যালয়",
    order: 14,
    avgRent2BHK: "৳20,000 - ৳32,000",
    avgBachelorSublet: "৳5,500 - ৳8,500",
    keyNearby: ["Curzon Hall", "TSC", "BUET Campus", "Dhaka Medical College (DMC)"],
    vibe: "Historical academic district, lush greenery, university student & doctor residences.",
  },
  {
    id: "secretariat",
    name: "Bangladesh Secretariat",
    bnName: "বাংলাদেশ সচিবালয়",
    order: 15,
    avgRent2BHK: "৳22,000 - ৳35,000",
    avgBachelorSublet: "৳6,500 - ৳9,500",
    keyNearby: ["National Press Club", "High Court", "Baitul Mukarram", "Topkhana Road"],
    vibe: "Administrative power center, lawyers, journalists, and government executives.",
  },
  {
    id: "motijheel",
    name: "Motijheel",
    bnName: "মতিঝিল",
    order: 16,
    avgRent2BHK: "৳20,000 - ৳32,000",
    avgBachelorSublet: "৳6,000 - ৳9,000",
    keyNearby: ["Bangladesh Bank HQ", "Shapla Chattar", "Dilkusha C/A", "Notre Dame College"],
    vibe: "Financial & banking capital of Bangladesh, optimal for corporate bankers & accountants.",
  },
];

export default function MetroTransitHubModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stations"); // "stations" | "fare_calculator" | "mrt_pass"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState(MRT_STATIONS[5]); // Default Mirpur 10

  // Route & Fare Calculator State
  const [originStationId, setOriginStationId] = useState("uttara-north");
  const [destStationId, setDestStationId] = useState("motijheel");

  // Filtered Stations
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return MRT_STATIONS;
    const q = searchQuery.toLowerCase();
    return MRT_STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.bnName.includes(q) ||
        s.keyNearby.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Fare & Commute Calculation
  const routeCalculation = useMemo(() => {
    const origin = MRT_STATIONS.find((s) => s.id === originStationId) || MRT_STATIONS[0];
    const dest = MRT_STATIONS.find((s) => s.id === destStationId) || MRT_STATIONS[15];

    const stationDifference = Math.abs(origin.order - dest.order);
    
    // Dhaka MRT Line-6 Fare Calculation:
    // Minimum fare is ৳20 (covers up to 2 stations)
    // Roughly ৳5 per additional station, max ৳100 for full Uttara to Motijheel
    let singleFare = 20;
    if (stationDifference > 2) {
      singleFare = Math.min(100, 20 + (stationDifference - 2) * 6);
    }
    if (stationDifference === 0) singleFare = 0;

    // Rapid Pass / MRT Pass gives 10% instant discount
    const mrtPassFare = Math.round(singleFare * 0.9);

    // Approx travel time: ~2 minutes per station + 45 seconds dwell time
    const metroTravelMins = stationDifference === 0 ? 0 : Math.round(stationDifference * 2.4);
    // Typical Dhaka bus/car travel time in peak traffic
    const roadTravelMins = stationDifference === 0 ? 0 : Math.round(stationDifference * 5.5 + 15);
    const timeSavedMins = Math.max(0, roadTravelMins - metroTravelMins);

    // Monthly Savings (assuming 22 working days, 2 trips per day = 44 trips)
    const monthlyPassCost = mrtPassFare * 44;
    const monthlyCngOrUberCost = singleFare * 44 * 4; // CNG/Ride sharing comparison
    const monthlyMoneySaved = Math.max(0, monthlyCngOrUberCost - monthlyPassCost);

    return {
      origin,
      dest,
      stationDifference,
      singleFare,
      mrtPassFare,
      metroTravelMins,
      roadTravelMins,
      timeSavedMins,
      monthlyPassCost,
      monthlyMoneySaved,
    };
  }, [originStationId, destStationId]);

  const handleSearchStationRentals = (stationName) => {
    onClose();
    // Extract base area keyword (e.g. "Mirpur" or "Uttara" or "Agargaon")
    let keyword = stationName.split(" ")[0].replace("(", "").replace(")", "");
    navigate(`/search?search=${encodeURIComponent(keyword)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Train className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Dhaka Metro Rail (MRT) Living & Transit Hub
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                  Line-6
                </span>
              </h2>
              <p className="text-xs text-teal-100">
                Explore rent indices near 16 MRT stations, calculate commute times, fares & find metro-connected rentals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "stations", label: "Station Living Guide & Rent Indices", icon: Building },
            { id: "fare_calculator", label: "Commute Time & Fare Calculator", icon: Clock },
            { id: "mrt_pass", label: "MRT Pass & Rapid Pass Rules", icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: STATION EXPLORER & RENT INDICES */}
          {activeTab === "stations" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Station List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search station or university..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredStations.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => setSelectedStation(station)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        selectedStation.id === station.id
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500"
                          : "bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {station.order}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                            {station.name}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {station.bnName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                        {station.avgRent2BHK.split("-")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Selected Station Spotlight (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-emerald-500/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                        Station #{selectedStation.order} • MRT Line-6
                      </span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        {selectedStation.bnName}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mt-1">
                      {selectedStation.name}
                    </h3>
                    <p className="text-xs text-teal-200 mt-1 leading-relaxed">
                      {selectedStation.vibe}
                    </p>

                    {/* Rent Index Cards */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold">
                          Avg. 2 BHK Family Flat
                        </div>
                        <div className="text-sm font-bold text-yellow-300 mt-0.5">
                          {selectedStation.avgRent2BHK}
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold">
                          Avg. Bachelor Sublet / Seat
                        </div>
                        <div className="text-sm font-bold text-yellow-300 mt-0.5">
                          {selectedStation.avgBachelorSublet}
                        </div>
                      </div>
                    </div>

                    {/* Key Landmark Tags */}
                    <div className="mt-4">
                      <span className="text-[11px] font-semibold text-teal-300 block mb-1.5">
                        Key Landmarks & Walking Catchments:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStation.keyNearby.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] bg-white/10 text-teal-100 px-2.5 py-0.5 rounded-lg border border-white/10"
                          >
                            📍 {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-5 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleSearchStationRentals(selectedStation.name)}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-teal-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Search className="w-4 h-4" />
                        Find Rental Homes Near {selectedStation.name}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMUTE & FARE CALCULATOR */}
          {activeTab === "fare_calculator" && (
            <div className="space-y-5">
              <div className="bg-teal-50/60 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/40">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                  <Navigation className="w-4 h-4 text-teal-600" />
                  Select Your Daily Commute Origin & Destination
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Origin Station (Boarding)
                    </label>
                    <select
                      value={originStationId}
                      onChange={(e) => setOriginStationId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold"
                    >
                      {MRT_STATIONS.map((s) => (
                        <option key={`origin-${s.id}`} value={s.id}>
                          #{s.order} {s.name} ({s.bnName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Destination Station (Alighting)
                    </label>
                    <select
                      value={destStationId}
                      onChange={(e) => setDestStationId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold"
                    >
                      {MRT_STATIONS.map((s) => (
                        <option key={`dest-${s.id}`} value={s.id}>
                          #{s.order} {s.name} ({s.bnName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Commute Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Travel Time Comparison */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Commute Duration
                  </div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {routeCalculation.metroTravelMins} mins
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Vs ~<strong>{routeCalculation.roadTravelMins} mins</strong> via bus/car in Dhaka road traffic.
                  </p>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Saves {routeCalculation.timeSavedMins} mins every trip!
                  </div>
                </div>

                {/* 2. Fare Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    Trip Ticket Fare
                  </div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    ৳{routeCalculation.singleFare}{" "}
                    <span className="text-xs font-normal text-gray-400">Single</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ৳{routeCalculation.mrtPassFare} with MRT Pass (10% OFF)
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Distance: {routeCalculation.stationDifference} intermediate stations
                  </p>
                </div>

                {/* 3. Monthly Financial Savings */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4" />
                    Monthly Commute Budget
                  </div>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                    ৳{routeCalculation.monthlyPassCost.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Based on 44 office/university trips per month using Rapid Pass.
                  </p>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                    ~৳{routeCalculation.monthlyMoneySaved.toLocaleString()} BDT saved vs ride-sharing.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MRT PASS & RAPID PASS RULES */}
          {activeTab === "mrt_pass" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                  <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    1. Where to Buy MRT Pass & Rapid Pass
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Purchase at any MRT station ticket counter (7:15 AM - 7:45 PM). MRT Pass cost: <strong>৳500</strong> (৳200 card deposit refundable + ৳300 initial balance). Requires NID & Passport photo copy.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                  <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    2. Flat 10% Discount on Every Journey
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Cardholders automatically receive a 10% discount on standard single-journey ticket prices across all 16 stations from Uttara to Motijheel.
                  </p>
                </div>

                <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                  <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    3. Rapid Pass Multi-Modal Transit
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Rapid Pass (issued by DTCA) is valid on both Dhaka Metro Rail Line-6 and select BRTC AC bus routes and Hatirjheel water taxis. Rechargeable via Dutch-Bangla Bank branches.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    4. Train Operating Schedule (Friday & Peak Hours)
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    First train from Uttara North departs at <strong>7:10 AM</strong>, last train from Motijheel departs at <strong>9:40 PM</strong>. Headway during peak hours is <strong>5-8 minutes</strong>. Trains operate on Fridays from 3:00 PM.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-emerald-500" />
            <span>Updated with DMTCL official schedule and station rent averages</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => handleSearchStationRentals("Mirpur")}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Search Metro Zone Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
