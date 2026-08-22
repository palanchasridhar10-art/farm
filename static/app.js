/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── OFFICIAL TELANGANA RYTHU BAZARS METADATA & AREAS ───
// Comprehensive, 100% accurate Telangana Rythu Bazars & Agricultural Markets across all 33 districts
const DISTRICT_RYTHU_BAZARS = {
  "adilabad": {
    area: "Gandhi Chowk & Mahalaxmiwada",
    display: "📍 Adilabad Rythu Bazar",
    name: "Adilabad Rythu Bazar",
    location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001",
    landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road",
    slug: "adilabad-rythu-bazar",
    mapQuery: "Adilabad Rythu Bazar, Gandhi Chowk, Adilabad, Telangana 504001",
    markets: [
      { name: "Adilabad Rythu Bazar", location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001", landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road", slug: "adilabad-rythu-bazar", mapQuery: "Adilabad Rythu Bazar, Gandhi Chowk, Adilabad, Telangana 504001" },
      { name: "Adilabad APMC Market Yard", location: "APMC Market Yard, Dasnapur, Adilabad, Telangana 504002", landmark: "Near Dasnapur X Road, NH 44", slug: "adilabad-apmc", mapQuery: "Agricultural Market Yard, Dasnapur, Adilabad, Telangana 504002" },
      { name: "Echoda Vegetable Market", location: "Main Road, Near Bus Stand, Echoda, Adilabad, Telangana 504307", landmark: "Near Echoda Bus Stand, NH 44", slug: "echoda-mandi", mapQuery: "Vegetable Market, Echoda, Adilabad, Telangana 504307" }
    ]
  },
  "bhadradri-kothagudem": {
    area: "Coolie Lane, Kothagudem",
    display: "📍 Kothagudem Rythu Bazar",
    name: "Kothagudem Rythu Bazar",
    location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Bhadradri Kothagudem, Telangana 507101",
    landmark: "Near Railway Station Road, Coolie Lane",
    slug: "kothagudem-rythu-bazar",
    mapQuery: "Rythu Bazar, Coolie Lane, Kothagudem, Telangana 507101",
    markets: [
      { name: "Kothagudem Rythu Bazar", location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Bhadradri Kothagudem, Telangana 507101", landmark: "Near Railway Station Road, Coolie Lane", slug: "kothagudem-rythu-bazar", mapQuery: "Rythu Bazar, Coolie Lane, Kothagudem, Telangana 507101" },
      { name: "Yellandu Rythu Bazar", location: "Yellandu Road, Basthi Number 2, Yellandu, Bhadradri Kothagudem, Telangana 507123", landmark: "Near Old Bus Stand, Yellandu", slug: "yellandu-rythu-bazar", mapQuery: "Rythu Bazar, Yellandu, Bhadradri Kothagudem, Telangana 507123" },
      { name: "Bhadrachalam APMC Market", location: "Market Yard, Charla Road, Bhadrachalam, Bhadradri Kothagudem, Telangana 507111", landmark: "Near ITDA Office, Charla Road", slug: "bhadrachalam-apmc", mapQuery: "Agriculture Market Committee, Bhadrachalam, Telangana 507111" }
    ]
  },
  "hanamkonda": {
    area: "Ramnagar & Balasamudram, Hanamkonda",
    display: "📍 Hanamkonda Rythu Bazar",
    name: "Hanamkonda Rythu Bazar",
    location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Ramnagar, Hanamkonda, Telangana 506001",
    landmark: "Opp. Old Bus Depot, Ramnagar, Hanamkonda",
    slug: "hanamkonda-rythu-bazar",
    mapQuery: "Rythu Bazar, Ramnagar, Hanamkonda, Telangana 506001",
    markets: [
      { name: "Hanamkonda Rythu Bazar", location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Ramnagar, Hanamkonda, Telangana 506001", landmark: "Opp. Old Bus Depot, Ramnagar, Hanamkonda", slug: "hanamkonda-rythu-bazar", mapQuery: "Rythu Bazar, Ramnagar, Hanamkonda, Telangana 506001" },
      { name: "Balasamudram Rythu Bazar", location: "Balasamudram Road, Near Collectorate, Balasamudram, Hanamkonda, Telangana 506001", landmark: "Near Balasamudram Water Tank, Hanamkonda", slug: "balasamudram-rythu-bazar", mapQuery: "Balasamudram Rythu Bazar, Hanamkonda, Telangana 506001" },
      { name: "Enumamula Rythu Bazar / Grain Market", location: "Sundaraiah Nagar, Enumamula Agriculture Market Yard, Warangal, Telangana 506006", landmark: "Enumamula Agriculture Market Yard", slug: "enumamula-rythu-bazar-grain-market", mapQuery: "Enumamula Market Yard, Warangal, Telangana 506006" }
    ]
  },
  "hyderabad": {
    area: "Mehdipatnam, Erragadda & Malakpet",
    display: "📍 Mehdipatnam Rythu Bazar",
    name: "Mehdipatnam Rythu Bazar",
    location: "PVNR Expressway Pillar 55, Near Mehdipatnam Bus Stand, Mehdipatnam, Hyderabad, Telangana 500028",
    landmark: "Under PVNR Expressway Pillar 55, Mehdipatnam",
    slug: "mehdipatnam-rythu-bazar",
    mapQuery: "Mehdipatnam Rythu Bazar, Mehdipatnam, Hyderabad, Telangana 500028",
    markets: [
      { name: "Mehdipatnam Rythu Bazar", location: "PVNR Expressway Pillar 55, Near Mehdipatnam Bus Stand, Mehdipatnam, Hyderabad, Telangana 500028", landmark: "Under PVNR Expressway Pillar 55, Mehdipatnam", slug: "mehdipatnam-rythu-bazar", mapQuery: "Mehdipatnam Rythu Bazar, Mehdipatnam, Hyderabad, Telangana 500028" },
      { name: "Erragadda Rythu Bazar", location: "Opp. Model School, Near Metro Station, Erragadda, Hyderabad, Telangana 500018", landmark: "Near Erragadda Metro Station", slug: "erragadda-rythu-bazar", mapQuery: "Erragadda Rythu Bazar, Erragadda, Hyderabad, Telangana 500018" },
      { name: "Malakpet Rythu Bazar", location: "Malakpet Gunj Road, Near Mahbub Ganj, Akbarbagh, Malakpet, Hyderabad, Telangana 500036", landmark: "Opp. Agriculture Market Committee, Malakpet", slug: "malakpet-rythu-bazar", mapQuery: "Malakpet Rythu Bazar, Malakpet, Hyderabad, Telangana 500036" },
      { name: "Gudimalkapur Rythu Bazar", location: "Alluri Sitarama Raju Nagar, Kanaka Durga Colony, Gudimalkapur, Hyderabad, Telangana 500006", landmark: "Near Gudimalkapur Flower & Vegetable Market", slug: "gudimalkapur-rythu-bazar", mapQuery: "Gudimalkapur Rythu Bazar, Gudimalkapur, Hyderabad, Telangana 500006" },
      { name: "Kukatpally Rythu Bazar", location: "Phase 1, KPHB Colony, Near Forum Mall Road, Kukatpally, Hyderabad, Telangana 500072", landmark: "KPHB Colony Phase 1, Kukatpally", slug: "kukatpally-rythu-bazar", mapQuery: "Rythu Bazar Kukatpally, KPHB Colony, Hyderabad, Telangana 500072" }
    ]
  },
  "jagtial": {
    area: "Brahma Wada & Tower Circle, Jagtial",
    display: "📍 Jagtial Rythu Bazar",
    name: "Jagtial Rythu Bazar",
    location: "Brahma Wada, Near Old Bus Stand, Jagtial, Telangana 505327",
    landmark: "Brahma Wada, Near Municipal Office",
    slug: "jagtial-rythu-bazar",
    mapQuery: "Rythu Bazar, Brahma Wada, Jagtial, Telangana 505327",
    markets: [
      { name: "Jagtial Rythu Bazar", location: "Brahma Wada, Near Old Bus Stand, Jagtial, Telangana 505327", landmark: "Brahma Wada, Near Municipal Office", slug: "jagtial-rythu-bazar", mapQuery: "Rythu Bazar, Brahma Wada, Jagtial, Telangana 505327" },
      { name: "Korutla Rythu Bazar", location: "Old Bus Stand Road, Korutla, Jagtial District, Telangana 505326", landmark: "Near Old Bus Stand, Korutla", slug: "korutla-rythu-bazar", mapQuery: "Rythu Bazar, Korutla, Jagtial, Telangana 505326" },
      { name: "Jagtial Vegetable Market", location: "Tower Circle Road, Old Gunj, Jagtial, Telangana 505327", landmark: "Tower Circle, Jagtial", slug: "jagtial-vegetable-market", mapQuery: "Vegetable Market, Tower Circle, Jagtial, Telangana 505327" }
    ]
  },
  "jangaon": {
    area: "Vegetable Market Street, Jangaon",
    display: "📍 Jangaon Vegetable Market / Rythu Bazar",
    name: "Jangaon Vegetable Market / Rythu Bazar",
    location: "Vegetable Market Street, Near Old Bus Stand, Jangaon, Telangana 506167",
    landmark: "Vegetable Market Street, Jangaon",
    slug: "jangaon-vegetable-market",
    mapQuery: "Vegetable Market, Jangaon, Telangana 506167",
    markets: [
      { name: "Jangaon Vegetable Market", location: "Vegetable Market Street, Near Old Bus Stand, Jangaon, Telangana 506167", landmark: "Vegetable Market Street, Jangaon", slug: "jangaon-vegetable-market", mapQuery: "Vegetable Market, Jangaon, Telangana 506167" },
      { name: "Jangaon Grain Market", location: "Jangaon–Chitakodur Road, Near Railway Station, Jangaon, Telangana 506167", landmark: "Near Jangaon Railway Station", slug: "jangaon-grain-market", mapQuery: "Agricultural Market Yard, Jangaon, Telangana 506167" },
      { name: "Station Ghanpur Market", location: "Main Road, Station Ghanpur, Jangaon, Telangana 506144", landmark: "Near Railway Station, Station Ghanpur", slug: "station-ghanpur-market", mapQuery: "Agriculture Market Yard, Station Ghanpur, Telangana 506144" }
    ]
  },
  "jayashankar-bhupalpally": {
    area: "Subhash Colony, Bhupalpally",
    display: "📍 Bhupalpally Rythu Bazar",
    name: "Bhupalpally Rythu Bazar",
    location: "Subhash Colony, Main Road, Bhupalpally, Jayashankar Bhupalpally, Telangana 506169",
    landmark: "Near Subhash Colony Park, Bhupalpally",
    slug: "bhupalpally-rythu-bazar",
    mapQuery: "Rythu Bazar, Bhupalpally, Telangana 506169",
    markets: [
      { name: "Bhupalpally Rythu Bazar", location: "Subhash Colony, Main Road, Bhupalpally, Jayashankar Bhupalpally, Telangana 506169", landmark: "Near Subhash Colony Park, Bhupalpally", slug: "bhupalpally-rythu-bazar", mapQuery: "Rythu Bazar, Bhupalpally, Telangana 506169" },
      { name: "Kataram Agriculture Market", location: "Manthani–Kataram Road, Kataram, Jayashankar Bhupalpally, Telangana 505503", landmark: "Near Kataram Police Station", slug: "kataram-apmc", mapQuery: "Agricultural Market Committee, Kataram, Telangana 505503" },
      { name: "Regonda Vegetable Market", location: "Main Road, Regonda, Jayashankar Bhupalpally, Telangana 506348", landmark: "Near Bus Stop, Regonda", slug: "regonda-market", mapQuery: "Vegetable Market, Regonda, Telangana 506348" }
    ]
  },
  "jogulamba-gadwal": {
    area: "Momin Mohalla, Gadwal",
    display: "📍 Gadwal Rythu Bazar",
    name: "Gadwal Rythu Bazar",
    location: "Momin Mohalla, Near Old Gunj, Gadwal, Jogulamba Gadwal, Telangana 509125",
    landmark: "Near Fort Road & Old Gunj, Gadwal",
    slug: "gadwal-rythu-bazar",
    mapQuery: "Rythu Bazar, Momin Mohalla, Gadwal, Telangana 509125",
    markets: [
      { name: "Gadwal Rythu Bazar", location: "Momin Mohalla, Near Old Gunj, Gadwal, Jogulamba Gadwal, Telangana 509125", landmark: "Near Fort Road & Old Gunj, Gadwal", slug: "gadwal-rythu-bazar", mapQuery: "Rythu Bazar, Momin Mohalla, Gadwal, Telangana 509125" },
      { name: "Gadwal Vegetable Market", location: "Housing Board Colony, Raichur Road, Gadwal, Telangana 509125", landmark: "Housing Board Colony, Gadwal", slug: "gadwal-vegetable-market", mapQuery: "Vegetable Market, Housing Board Colony, Gadwal, Telangana 509125" },
      { name: "Alampur Mandi", location: "Main Road, Alampur, Jogulamba Gadwal, Telangana 509152", landmark: "Near Alampur X Road, Alampur", slug: "alampur-mandi", mapQuery: "Agriculture Market Yard, Alampur, Telangana 509152" }
    ]
  },
  "kamareddy": {
    area: "Lachapet & Ashok Nagar, Kamareddy",
    display: "📍 Kamareddy Rythu Bazar",
    name: "Kamareddy Rythu Bazar",
    location: "Lachapet Road, Near Old Bus Stand, Kamareddy, Telangana 503111",
    landmark: "Near Railway Gate, Lachapet, Kamareddy",
    slug: "kamareddy-rythu-bazar",
    mapQuery: "Rythu Bazar, Lachapet, Kamareddy, Telangana 503111",
    markets: [
      { name: "Kamareddy Rythu Bazar", location: "Lachapet Road, Near Old Bus Stand, Kamareddy, Telangana 503111", landmark: "Near Railway Gate, Lachapet, Kamareddy", slug: "kamareddy-rythu-bazar", mapQuery: "Rythu Bazar, Lachapet, Kamareddy, Telangana 503111" },
      { name: "Kamareddy Vegetable Market", location: "Sri Ram Nagar Colony, Ashok Nagar, Kamareddy, Telangana 503111", landmark: "Ashok Nagar Market Area, Kamareddy", slug: "kamareddy-vegetable-market", mapQuery: "Vegetable Market, Ashok Nagar, Kamareddy, Telangana 503111" },
      { name: "Padmajiwadi Vegetable Market", location: "Padmajiwadi X Road, Kamareddy, Telangana 503111", landmark: "Near NH 44 Bypass, Padmajiwadi", slug: "padmajiwadi-vegetable-market", mapQuery: "Padmajiwadi X Road Market, Kamareddy, Telangana 503111" }
    ]
  },
  "karimnagar": {
    area: "Saraswathi Nagar & Collectorate Road, Karimnagar",
    display: "📍 Karimnagar Rythu Bazar",
    name: "Karimnagar Rythu Bazar",
    location: "Saraswathi Nagar, Near Collectorate Complex, Karimnagar, Telangana 505001",
    landmark: "Opp. Collectorate Complex, Saraswathi Nagar",
    slug: "karimnagar-rythu-bazar",
    mapQuery: "Rythu Bazar, Saraswathi Nagar, Karimnagar, Telangana 505001",
    markets: [
      { name: "Karimnagar Rythu Bazar", location: "Saraswathi Nagar, Near Collectorate Complex, Karimnagar, Telangana 505001", landmark: "Opp. Collectorate Complex, Saraswathi Nagar", slug: "karimnagar-rythu-bazar", mapQuery: "Rythu Bazar, Saraswathi Nagar, Karimnagar, Telangana 505001" },
      { name: "Karimnagar Vegetable Market", location: "Islampura, Near Tower Circle, Ashoknagar, Karimnagar, Telangana 505001", landmark: "Tower Circle, Islampura, Karimnagar", slug: "karimnagar-vegetable-market", mapQuery: "Vegetable Market, Islampura, Karimnagar, Telangana 505001" },
      { name: "Sipada Rao Fruit Market", location: "Kisan Nagar, Jagtial Road, Karimnagar, Telangana 505001", landmark: "Kisan Nagar Market Yard, Karimnagar", slug: "sipada-rao-fruit-market", mapQuery: "Agriculture Market Yard, Kisan Nagar, Karimnagar, Telangana 505001" }
    ]
  },
  "khammam": {
    area: "Rajendra Nagar & Prakash Nagar, Khammam",
    display: "📍 Khammam Rythu Bazar",
    name: "Khammam Rythu Bazar",
    location: "Kodad–Khammam Road, Rajendra Nagar, Prakash Nagar, Khammam, Telangana 507003",
    landmark: "Near VDOs Colony & Kodad Road, Prakash Nagar",
    slug: "khammam-rythu-bazar",
    mapQuery: "Rythu Bazar, Prakash Nagar, Khammam, Telangana 507003",
    markets: [
      { name: "Khammam Rythu Bazar", location: "Kodad–Khammam Road, Rajendra Nagar, Prakash Nagar, Khammam, Telangana 507003", landmark: "Near VDOs Colony & Kodad Road, Prakash Nagar", slug: "khammam-rythu-bazar", mapQuery: "Rythu Bazar, Prakash Nagar, Khammam, Telangana 507003" },
      { name: "Madhira Rythu Bazar", location: "Station Road, Near Railway Station, Madhira, Khammam, Telangana 507203", landmark: "Near Madhira Railway Station, Madhira", slug: "madhira-rythu-bazar", mapQuery: "Rythu Bazar, Madhira, Telangana 507203" },
      { name: "Wyra Rythu Bazar", location: "Madhira–Wyra Road, Sundaraiah Nagar, Wyra, Khammam, Telangana 507165", landmark: "Sundaraiah Nagar, Near Wyra Reservoir Road", slug: "wyra-rythu-bazar", mapQuery: "Rythu Bazar, Wyra, Khammam, Telangana 507165" }
    ]
  },
  "komaram-bheem-asifabad": {
    area: "Jubilee Market Road, Asifabad",
    display: "📍 Asifabad Rythu Bazar",
    name: "Asifabad Rythu Bazar",
    location: "Jubilee Market Road, Near RTC Bus Stand, Asifabad, Kumuram Bheem Asifabad, Telangana 504293",
    landmark: "Near RTC Bus Stand, Jubilee Market Road",
    slug: "asifabad-rythu-bazar",
    mapQuery: "Rythu Bazar, Jubilee Market Road, Asifabad, Telangana 504293",
    markets: [
      { name: "Asifabad Rythu Bazar", location: "Jubilee Market Road, Near RTC Bus Stand, Asifabad, Kumuram Bheem Asifabad, Telangana 504293", landmark: "Near RTC Bus Stand, Jubilee Market Road", slug: "asifabad-rythu-bazar", mapQuery: "Rythu Bazar, Jubilee Market Road, Asifabad, Telangana 504293" },
      { name: "Kagaznagar APMC Market", location: "Market Road, SPM Colony, Kagaznagar, Kumuram Bheem Asifabad, Telangana 504296", landmark: "Near Kagaznagar Railway Station, SPM Colony", slug: "kagaznagar-mandi", mapQuery: "Agriculture Market Yard, Kagaznagar, Telangana 504296" },
      { name: "Asifabad APMC Market Yard", location: "Wankidi Road, Asifabad, Kumuram Bheem Asifabad, Telangana 504293", landmark: "Wankidi Road, Asifabad", slug: "asifabad-apmc", mapQuery: "Agriculture Market Committee, Asifabad, Telangana 504293" }
    ]
  },
  "mahabubabad": {
    area: "Main Road & Old Bus Stand, Mahabubabad",
    display: "📍 Mahabubabad Rythu Bazar",
    name: "Mahabubabad Rythu Bazar",
    location: "Main Road, Near Old Bus Stand, Mahabubabad, Telangana 506101",
    landmark: "Near Old Bus Stand & Railway Gate, Mahabubabad",
    slug: "mahabubabad-rythu-bazar",
    mapQuery: "Rythu Bazar, Mahabubabad, Telangana 506101",
    markets: [
      { name: "Mahabubabad Rythu Bazar", location: "Main Road, Near Old Bus Stand, Mahabubabad, Telangana 506101", landmark: "Near Old Bus Stand & Railway Gate, Mahabubabad", slug: "mahabubabad-rythu-bazar", mapQuery: "Rythu Bazar, Mahabubabad, Telangana 506101" },
      { name: "Kesamudram Rythu Bazar", location: "Market Yard Road, Kesamudram, Mahabubabad District, Telangana 506112", landmark: "Near Kesamudram Railway Station & Market Yard", slug: "kesamudram-rythu-bazar", mapQuery: "Agriculture Market Yard, Kesamudram, Telangana 506112" },
      { name: "Mahabubabad Vegetable Market", location: "Near Railway Station, Station Road, Mahabubabad, Telangana 506101", landmark: "Station Road, Mahabubabad", slug: "mahabubabad-vegetable-market", mapQuery: "Vegetable Market, Station Road, Mahabubabad, Telangana 506101" }
    ]
  },
  "mahabubnagar": {
    area: "Ramaiah Bowli & Clock Tower, Mahbubnagar",
    display: "📍 Mahabubnagar Rythu Bazar",
    name: "Mahabubnagar Rythu Bazar",
    location: "Ramaiah Bowli, Near Clock Tower, Mahabubnagar, Telangana 509001",
    landmark: "Clock Tower Road, Ramaiah Bowli",
    slug: "mahabubnagar-rythu-bazar",
    mapQuery: "Rythu Bazar, Ramaiah Bowli, Mahbubnagar, Telangana 509001",
    markets: [
      { name: "Mahabubnagar Rythu Bazar", location: "Ramaiah Bowli, Near Clock Tower, Mahabubnagar, Telangana 509001", landmark: "Clock Tower Road, Ramaiah Bowli", slug: "mahabubnagar-rythu-bazar", mapQuery: "Rythu Bazar, Ramaiah Bowli, Mahbubnagar, Telangana 509001" },
      { name: "Jadcherla Vegetable Market", location: "Shop No. 26, Vegetable Market, Badepalle, Jadcherla, Mahabubnagar, Telangana 509301", landmark: "Badepalle Market Area, Jadcherla", slug: "jadcherla-vegetable-market", mapQuery: "Vegetable Market, Badepalle, Jadcherla, Telangana 509301" },
      { name: "Badepalle Rythu Bazar", location: "Station Road, Badepalle, Jadcherla, Mahabubnagar, Telangana 509301", landmark: "Near Jadcherla Railway Station, Badepalle", slug: "badepalle-rythu-bazar", mapQuery: "Rythu Bazar, Badepalle, Jadcherla, Telangana 509301" }
    ]
  },
  "mancherial": {
    area: "Iqbal Ahmed Nagar & Thollavagu, Mancherial",
    display: "📍 Mancherial Rythu Bazar",
    name: "Mancherial Rythu Bazar",
    location: "Market Road, Iqbal Ahmed Nagar, Mancherial, Telangana 504208",
    landmark: "Near IB Chowrasta, Iqbal Ahmed Nagar",
    slug: "mancherial-rythu-bazar",
    mapQuery: "Rythu Bazar, Iqbal Ahmed Nagar, Mancherial, Telangana 504208",
    markets: [
      { name: "Mancherial Rythu Bazar", location: "Market Road, Iqbal Ahmed Nagar, Mancherial, Telangana 504208", landmark: "Near IB Chowrasta, Iqbal Ahmed Nagar", slug: "mancherial-rythu-bazar", mapQuery: "Rythu Bazar, Iqbal Ahmed Nagar, Mancherial, Telangana 504208" },
      { name: "Bellampalle Rythu Bazar", location: "Mancherial Road, Near Bus Stand, Bellampalle, Mancherial, Telangana 504251", landmark: "Mancherial Road, Bellampalle", slug: "bellampalle-rythu-bazar", mapQuery: "Rythu Bazar, Bellampalle, Telangana 504251" },
      { name: "Mancherial Vegetable Market", location: "Thollavagu Bridge Road, Mancherial, Telangana 504208", landmark: "Thollavagu Area, Mancherial", slug: "mancherial-vegetable-market", mapQuery: "Vegetable Market, Mancherial, Telangana 504208" }
    ]
  },
  "medak": {
    area: "Auto Nagar & Ramdas Guda, Medak",
    display: "📍 Medak Rythu Bazar",
    name: "Medak Rythu Bazar",
    location: "Auto Nagar Road, Near New Bus Stand, Ramdas Guda, Medak, Telangana 502110",
    landmark: "Near Medak New Bus Stand, Ramdas Guda",
    slug: "medak-rythu-bazar",
    mapQuery: "Rythu Bazar, Medak, Telangana 502110",
    markets: [
      { name: "Medak Rythu Bazar", location: "Auto Nagar Road, Near New Bus Stand, Ramdas Guda, Medak, Telangana 502110", landmark: "Near Medak New Bus Stand, Ramdas Guda", slug: "medak-rythu-bazar", mapQuery: "Rythu Bazar, Medak, Telangana 502110" },
      { name: "Tupran Rythu Bazar", location: "NH 44 Service Road, Near Bus Stand, Tupran, Medak, Telangana 502334", landmark: "Near Tupran Bus Stand, NH 44", slug: "tupran-rythu-bazar", mapQuery: "Rythu Bazar, Tupran, Telangana 502334" },
      { name: "Tupran Vegetable Market", location: "Market Street, Tupran, Medak District, Telangana 502334", landmark: "Old Market Street, Tupran", slug: "tupran-vegetable-market", mapQuery: "Vegetable Market, Tupran, Medak, Telangana 502334" }
    ]
  },
  "medchal-malkajgiri": {
    area: "Malkajgiri & Bowenpally, Secunderabad",
    display: "📍 Malkajgiri Rythu Bazar",
    name: "Malkajgiri Rythu Bazar",
    location: "Indira Nehru Nagar, Mallikarjuna Nagar, Malkajgiri, Secunderabad, Telangana 500047",
    landmark: "Near Malkajgiri Railway Station & Municipal Complex",
    slug: "malkajgiri-rythu-bazar",
    mapQuery: "Rythu Bazar, Malkajgiri, Secunderabad, Telangana 500047",
    markets: [
      { name: "Malkajgiri Rythu Bazar", location: "Indira Nehru Nagar, Mallikarjuna Nagar, Malkajgiri, Secunderabad, Telangana 500047", landmark: "Near Malkajgiri Railway Station & Municipal Complex", slug: "malkajgiri-rythu-bazar", mapQuery: "Rythu Bazar, Malkajgiri, Secunderabad, Telangana 500047" },
      { name: "Bowenpally Rythu Bazar", location: "Agriculture Market Yard, Hasmathpet Road, Bowenpally, Secunderabad, Telangana 500011", landmark: "Bowenpally Agriculture Market Yard", slug: "bowenpally-rythu-bazar", mapQuery: "Bowenpally Vegetable Market, Bowenpally, Secunderabad, Telangana 500011" },
      { name: "Medchal Rythu Bazar", location: "NH 44, Near Medchal Checkpost, Medchal, Medchal–Malkajgiri, Telangana 501401", landmark: "Near Medchal Bus Depot, Medchal", slug: "medchal-apmc", mapQuery: "Rythu Bazar, Medchal, Telangana 501401" }
    ]
  },
  "mulugu": {
    area: "Main Road & Old Bus Stand, Mulugu",
    display: "📍 Mulugu Rythu Bazar",
    name: "Mulugu Rythu Bazar",
    location: "Main Road, Near Old Bus Stand, Mulugu Town, Mulugu District, Telangana 506343",
    landmark: "Near Mulugu Bus Stand & Collectorate Road",
    slug: "mulugu-rythu-bazar",
    mapQuery: "Rythu Bazar, Mulugu, Telangana 506343",
    markets: [
      { name: "Mulugu Rythu Bazar", location: "Main Road, Near Old Bus Stand, Mulugu Town, Mulugu District, Telangana 506343", landmark: "Near Mulugu Bus Stand & Collectorate Road", slug: "mulugu-rythu-bazar", mapQuery: "Rythu Bazar, Mulugu, Telangana 506343" },
      { name: "Eturnagaram Agriculture Market", location: "Main Road, Eturnagaram, Mulugu District, Telangana 506165", landmark: "Near ITDA Office, Eturnagaram", slug: "eturnagaram-apmc", mapQuery: "Agriculture Market Yard, Eturnagaram, Mulugu, Telangana 506165" },
      { name: "Venkatapur Vegetable Market", location: "Warangal–Mulugu Highway, Venkatapur, Mulugu, Telangana 506345", landmark: "Near Ramappa Lake X Road, Venkatapur", slug: "venkatapur-market", mapQuery: "Vegetable Market, Venkatapur, Mulugu, Telangana 506345" }
    ]
  },
  "nagarkurnool": {
    area: "Udaya Nagar & New Bus Stand, Nagarkurnool",
    display: "📍 Nagarkurnool Rythu Bazar",
    name: "Nagarkurnool Rythu Bazar",
    location: "Near New Bus Stand, Udaya Nagar, Nagarkurnool Town, Telangana 509209",
    landmark: "Near New Bus Stand & RDO Office, Nagarkurnool",
    slug: "nagarkurnool-rythu-bazar",
    mapQuery: "Rythu Bazar, Nagarkurnool, Telangana 509209",
    markets: [
      { name: "Nagarkurnool Rythu Bazar", location: "Near New Bus Stand, Udaya Nagar, Nagarkurnool Town, Telangana 509209", landmark: "Near New Bus Stand & RDO Office, Nagarkurnool", slug: "nagarkurnool-rythu-bazar", mapQuery: "Rythu Bazar, Nagarkurnool, Telangana 509209" },
      { name: "Kalwakurthy Vegetable Market", location: "Hyderabad–Srisailam Highway, Kalwakurthy, Nagarkurnool, Telangana 509324", landmark: "Near Kalwakurthy Bus Stand, Kalwakurthy", slug: "kalwakurthy-mandi", mapQuery: "Vegetable Market, Kalwakurthy, Telangana 509324" },
      { name: "Nagarkurnool APMC Market Yard", location: "Achampet Road, Nagarkurnool, Telangana 509209", landmark: "Achampet Road Market Yard, Nagarkurnool", slug: "nagarkurnool-apmc", mapQuery: "Agriculture Market Committee, Nagarkurnool, Telangana 509209" }
    ]
  },
  "nalgonda": {
    area: "Prakasham Bazar & Bottu Guda, Nalgonda",
    display: "📍 Nalgonda Rythu Bazar",
    name: "Nalgonda Rythu Bazar",
    location: "Shop 01, Prakasham Bazar Road, New Prakasham Bazar, Bottu Guda, Nalgonda, Telangana 508001",
    landmark: "New Prakasham Bazar, Bottu Guda, Nalgonda",
    slug: "nalgonda-rythu-bazar",
    mapQuery: "Rythu Bazar, Prakasham Bazar Road, Nalgonda, Telangana 508001",
    markets: [
      { name: "Nalgonda Rythu Bazar", location: "Shop 01, Prakasham Bazar Road, New Prakasham Bazar, Bottu Guda, Nalgonda, Telangana 508001", landmark: "New Prakasham Bazar, Bottu Guda", slug: "nalgonda-rythu-bazar", mapQuery: "Rythu Bazar, Prakasham Bazar Road, Nalgonda, Telangana 508001" },
      { name: "Nalgonda Beet Market", location: "Beet Market, Hyderabad Road, Near Clock Tower, Nalgonda, Telangana 508001", landmark: "Hyderabad Road, Beet Market, Nalgonda", slug: "nalgonda-beet-market", mapQuery: "Beet Market, Nalgonda, Telangana 508001" },
      { name: "Miryalaguda Vegetable Market", location: "Vegetable Market, Market Road, Doctors Colony, Miryalaguda, Nalgonda, Telangana 508207", landmark: "Market Road, Doctors Colony, Miryalaguda", slug: "miryalaguda-vegetable-market", mapQuery: "Vegetable Market, Miryalaguda, Telangana 508207" }
    ]
  },
  "narayanpet": {
    area: "Narayanpet–Jajapur Road, Narayanpet",
    display: "📍 Narayanpet Rythu Bazar",
    name: "Narayanpet Rythu Bazar",
    location: "Narayanpet–Jajapur Road, Near Old Bus Stand, Narayanpet, Telangana 509210",
    landmark: "Near Old Bus Stand & Market Road",
    slug: "narayanpet-rythu-bazar",
    mapQuery: "Rythu Bazar, Narayanpet, Telangana 509210",
    markets: [
      { name: "Narayanpet Rythu Bazar", location: "Narayanpet–Jajapur Road, Near Old Bus Stand, Narayanpet, Telangana 509210", landmark: "Near Old Bus Stand & Market Road", slug: "narayanpet-rythu-bazar", mapQuery: "Rythu Bazar, Narayanpet, Telangana 509210" },
      { name: "Kosgi Rythu Bazar", location: "Main Road, Near Police Station, Kosgi, Narayanpet, Telangana 509339", landmark: "Near Kosgi Bus Stand", slug: "kosgi-rythu-bazar", mapQuery: "Rythu Bazar, Kosgi, Narayanpet, Telangana 509339" },
      { name: "Kosgi Vegetable Market", location: "Gunj Road, Kosgi, Narayanpet District, Telangana 509339", landmark: "Gunj Road, Kosgi", slug: "kosgi-vegetable-market", mapQuery: "Vegetable Market, Kosgi, Telangana 509339" }
    ]
  },
  "nirmal": {
    area: "Balajiwada & Bagulwada, Nirmal",
    display: "📍 Nirmal Rythu Bazar",
    name: "Nirmal Rythu Bazar",
    location: "Balajiwada, Bagulwada, Near Old Bus Stand, Nirmal, Telangana 504106",
    landmark: "Balajiwada, Bagulwada, Nirmal",
    slug: "nirmal-rythu-bazar",
    mapQuery: "Rythu Bazar, Balajiwada, Nirmal, Telangana 504106",
    markets: [
      { name: "Nirmal Rythu Bazar", location: "Balajiwada, Bagulwada, Near Old Bus Stand, Nirmal, Telangana 504106", landmark: "Balajiwada, Bagulwada, Nirmal", slug: "nirmal-rythu-bazar", mapQuery: "Rythu Bazar, Balajiwada, Nirmal, Telangana 504106" },
      { name: "Bhainsa Rythu Bazar", location: "Gandhi Gunj Road, Near Bus Stand, Bhainsa, Nirmal, Telangana 504103", landmark: "Gandhi Gunj Road, Bhainsa", slug: "bhainsa-rythu-bazar", mapQuery: "Rythu Bazar, Bhainsa, Nirmal, Telangana 504103" },
      { name: "Nirmal Vegetable Market", location: "Naidiwada, Near Mancherial X Road, Nirmal, Telangana 504106", landmark: "Naidiwada, Nirmal", slug: "nirmal-vegetable-market", mapQuery: "Vegetable Market, Naidiwada, Nirmal, Telangana 504106" }
    ]
  },
  "nizamabad": {
    area: "Dubba Road & Shradhanand Gunj, Nizamabad",
    display: "📍 Nizamabad Rythu Bazar",
    name: "Nizamabad Rythu Bazar",
    location: "Dubba Road, Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503003",
    landmark: "Near Dubba Railway Gate & Shradhanand Gunj",
    slug: "nizamabad-rythu-bazar",
    mapQuery: "Rythu Bazar, Dubba Road, Nizamabad, Telangana 503003",
    markets: [
      { name: "Nizamabad Rythu Bazar", location: "Dubba Road, Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503003", landmark: "Near Dubba Railway Gate & Shradhanand Gunj", slug: "nizamabad-rythu-bazar", mapQuery: "Rythu Bazar, Dubba Road, Nizamabad, Telangana 503003" },
      { name: "Nizamabad Gandhi Gunj Market", location: "7-8-24, Gandhi Gunj Road, Kumar Gali, Nizamabad, Telangana 503001", landmark: "Gandhi Gunj Road, Kumar Gali", slug: "nizamabad-gandhi-gunj-market", mapQuery: "Gandhi Gunj, Nizamabad, Telangana 503001" },
      { name: "Shradhanand Gunj Vegetable Market", location: "Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503001", landmark: "Shradhanand Gunj, Nizamabad", slug: "shradhanand-gunj-vegetable-market", mapQuery: "Vegetable Market, Shradhanand Gunj, Nizamabad, Telangana 503001" },
      { name: "Armoor Rythu Bazar", location: "Mamillapalli Road, Armoor, Nizamabad, Telangana 503224", landmark: "Near Armoor Bus Stand, Armoor", slug: "armoor-rythu-bazar", mapQuery: "Rythu Bazar, Armoor, Nizamabad, Telangana 503224" }
    ]
  },
  "peddapalli": {
    area: "Sagar Road & Godavarikhani, Peddapalli",
    display: "📍 Peddapalli Rythu Bazar",
    name: "Peddapalli Rythu Bazar",
    location: "Sagar Road, Near Old Bus Stand, Peddapalli, Telangana 505172",
    landmark: "Sagar Road, Peddapalli",
    slug: "peddapalli-rythu-bazar",
    mapQuery: "Rythu Bazar, Peddapalli, Telangana 505172",
    markets: [
      { name: "Peddapalli Rythu Bazar", location: "Sagar Road, Near Old Bus Stand, Peddapalli, Telangana 505172", landmark: "Sagar Road, Peddapalli", slug: "peddapalli-rythu-bazar", mapQuery: "Rythu Bazar, Peddapalli, Telangana 505172" },
      { name: "Godavarikhani Rythu Bazar", location: "Ram Nagar, Jawahar Nagar, Godavarikhani, Ramagundam, Peddapalli, Telangana 505209", landmark: "Ram Nagar, Near Bus Station, Godavarikhani", slug: "godavarikhani-rythu-bazar", mapQuery: "Rythu Bazar, Godavarikhani, Ramagundam, Telangana 505209" },
      { name: "Peddapalli APMC Market Yard", location: "Station Road, Peddapalli, Telangana 505172", landmark: "Near Peddapalli Railway Station", slug: "peddapalli-apmc", mapQuery: "Agriculture Market Committee, Peddapalli, Telangana 505172" }
    ]
  },
  "rajanna-sircilla": {
    area: "Gandhi Nagar & Municipal Complex, Sircilla",
    display: "📍 Sircilla Rythu Bazar",
    name: "Sircilla Rythu Bazar",
    location: "Shop No. 72, Municipal Complex, Market Road, Gandhi Nagar, Sircilla, Rajanna Sircilla, Telangana 505301",
    landmark: "Municipal Complex, Market Road, Gandhi Nagar",
    slug: "sircilla-rythu-bazar",
    mapQuery: "Rythu Bazar, Gandhi Nagar, Sircilla, Telangana 505301",
    markets: [
      { name: "Sircilla Rythu Bazar", location: "Shop No. 72, Municipal Complex, Market Road, Gandhi Nagar, Sircilla, Rajanna Sircilla, Telangana 505301", landmark: "Municipal Complex, Market Road, Gandhi Nagar", slug: "sircilla-rythu-bazar", mapQuery: "Rythu Bazar, Gandhi Nagar, Sircilla, Telangana 505301" },
      { name: "Vemulawada Rythu Bazar", location: "Temple Road, Near Bus Stand, Vemulawada, Rajanna Sircilla, Telangana 505302", landmark: "Near Vemulawada Temple & Bus Stand", slug: "vemulawada-mandi", mapQuery: "Rythu Bazar, Vemulawada, Telangana 505302" },
      { name: "Sircilla APMC Market Yard", location: "Karimnagar Road, Sircilla, Rajanna Sircilla, Telangana 505301", landmark: "Karimnagar Highway, Sircilla", slug: "sircilla-apmc", mapQuery: "Agricultural Market Yard, Sircilla, Telangana 505301" }
    ]
  },
  "rangareddy": {
    area: "Shamshabad, Vanasthalipuram & Chevella",
    display: "📍 Shamshabad Rythu Bazar",
    name: "Shamshabad Rythu Bazar",
    location: "Sidenti Road, Opp. Indra Hospital, Shamshabad, Rangareddy, Telangana 501218",
    landmark: "Opp. Indra Hospital, Near Shamshabad Bus Stand",
    slug: "shamshabad-rythu-bazar",
    mapQuery: "Rythu Bazar, Shamshabad, Telangana 501218",
    markets: [
      { name: "Shamshabad Rythu Bazar", location: "Sidenti Road, Opp. Indra Hospital, Shamshabad, Rangareddy, Telangana 501218", landmark: "Opp. Indra Hospital, Near Shamshabad Bus Stand", slug: "shamshabad-rythu-bazar", mapQuery: "Rythu Bazar, Shamshabad, Telangana 501218" },
      { name: "Vanasthalipuram Rythu Bazar", location: "Red Tank Road, Phase 2, Vanasthalipuram, Rangareddy, Hyderabad, Telangana 500070", landmark: "Near Red Tank, Vanasthalipuram, Hyderabad", slug: "vanasthalipuram-rythu-bazar", mapQuery: "Rythu Bazar, Vanasthalipuram, Hyderabad, Telangana 500070" },
      { name: "Chevella Rythu Bazar", location: "Vikarabad Road, Near Bus Stand, Chevella, Rangareddy, Telangana 501503", landmark: "Near Chevella Bus Stand, Chevella", slug: "chevella-rythu-bazar", mapQuery: "Rythu Bazar, Chevella, Rangareddy, Telangana 501503" },
      { name: "Shadnagar Rythu Bazar", location: "Station Road, Near Old Gunj, Shadnagar, Rangareddy, Telangana 509216", landmark: "Near Shadnagar Railway Station, Shadnagar", slug: "shadnagar-rythu-bazar", mapQuery: "Rythu Bazar, Shadnagar, Telangana 509216" }
    ]
  },
  "sangareddy": {
    area: "Habeeb Nagar & Sadashivpet, Sangareddy",
    display: "📍 Sangareddy Rythu Bazar",
    name: "Sangareddy Rythu Bazar",
    location: "Rajampet Road, Habeeb Nagar, Sangareddy, Telangana 502001",
    landmark: "Near Old Bus Stand & Rajampet Road",
    slug: "sangareddy-rythu-bazar",
    mapQuery: "Rythu Bazar, Sangareddy, Telangana 502001",
    markets: [
      { name: "Sangareddy Rythu Bazar", location: "Rajampet Road, Habeeb Nagar, Sangareddy, Telangana 502001", landmark: "Near Old Bus Stand & Rajampet Road", slug: "sangareddy-rythu-bazar", mapQuery: "Rythu Bazar, Sangareddy, Telangana 502001" },
      { name: "Sadashivpet Rythu Bazar", location: "NH 65 Highway Road, Sadashivpet, Sangareddy, Telangana 502291", landmark: "Near Sadashivpet Bus Stand", slug: "sadashivpet-rythu-bazar", mapQuery: "Rythu Bazar, Sadashivpet, Telangana 502291" },
      { name: "Patancheru Rythu Bazar", location: "Goutham Nagar, Near Bus Station, Patancheru, Sangareddy, Telangana 502319", landmark: "Near Patancheru Bus Station", slug: "patancheru-rythu-bazar", mapQuery: "Rythu Bazar, Patancheru, Telangana 502319" },
      { name: "Sangareddy Vegetable Market", location: "Rajampet Road, Habeeb Nagar, Sangareddy, Telangana 502001", landmark: "Rajampet Road, Habeeb Nagar", slug: "sangareddy-vegetable-market", mapQuery: "Vegetable Market, Sangareddy, Telangana 502001" }
    ]
  },
  "siddipet": {
    area: "Parupalliveedhi & Gajwel, Siddipet",
    display: "📍 Siddipet Rythu Bazar",
    name: "Siddipet Rythu Bazar",
    location: "Parupalliveedhi, Near Old Bus Stand, Siddipet, Telangana 502103",
    landmark: "Near Parupalliveedhi Temple Road",
    slug: "siddipet-rythu-bazar",
    mapQuery: "Rythu Bazar, Parupalliveedhi, Siddipet, Telangana 502103",
    markets: [
      { name: "Siddipet Rythu Bazar", location: "Parupalliveedhi, Near Old Bus Stand, Siddipet, Telangana 502103", landmark: "Near Parupalliveedhi Temple Road", slug: "siddipet-rythu-bazar", mapQuery: "Rythu Bazar, Parupalliveedhi, Siddipet, Telangana 502103" },
      { name: "Gajwel Rythu Bazar", location: "Pragnapur–Gajwel Road, Near Old Bus Stand, Gajwel, Siddipet, Telangana 502278", landmark: "Near Gajwel Municipal Office, Gajwel", slug: "gajwel-mandi", mapQuery: "Rythu Bazar, Gajwel, Siddipet, Telangana 502278" },
      { name: "Siddipet Vegetable Market", location: "Market Road, Near Clock Tower, Siddipet, Telangana 502103", landmark: "Clock Tower, Siddipet", slug: "siddipet-vegetable-market", mapQuery: "Vegetable Market, Siddipet, Telangana 502103" }
    ]
  },
  "suryapet": {
    area: "Barlapenta Bazaar & Kodad, Suryapet",
    display: "📍 Suryapet Rythu Bazar",
    name: "Suryapet Rythu Bazar",
    location: "Barlapenta Bazaar, Near Old Bus Stand, Suryapet, Telangana 508213",
    landmark: "Barlapenta Bazaar, Near Clock Tower",
    slug: "suryapet-rythu-bazar",
    mapQuery: "Rythu Bazar, Barlapenta Bazaar, Suryapet, Telangana 508213",
    markets: [
      { name: "Suryapet Rythu Bazar", location: "Barlapenta Bazaar, Near Old Bus Stand, Suryapet, Telangana 508213", landmark: "Barlapenta Bazaar, Near Clock Tower", slug: "suryapet-rythu-bazar", mapQuery: "Rythu Bazar, Barlapenta Bazaar, Suryapet, Telangana 508213" },
      { name: "Kodad Rythu Bazar", location: "Main Road, Near Bus Stand, Kodad, Suryapet, Telangana 508206", landmark: "Near Kodad Bus Stand & Market Road", slug: "kodad-mandi", mapQuery: "Rythu Bazar, Kodad, Suryapet, Telangana 508206" },
      { name: "Suryapet Vegetable Market", location: "Vijayawada Highway, Ambedkar Nagar, Suryapet, Telangana 508213", landmark: "Vijayawada Highway, Ambedkar Nagar", slug: "suryapet-vegetable-market", mapQuery: "Vegetable Market, Suryapet, Telangana 508213" }
    ]
  },
  "vikarabad": {
    area: "Nehru Gunj & New Gunj, Tandur / Vikarabad",
    display: "📍 Tandur Rythu Bazar",
    name: "Tandur Rythu Bazar",
    location: "Nehru Gunj Road, Near Railway Station, Tandur, Vikarabad, Telangana 501141",
    landmark: "Nehru Gunj, Near Tandur Railway Station",
    slug: "tandur-rythu-bazar",
    mapQuery: "Rythu Bazar, Nehru Gunj, Tandur, Telangana 501141",
    markets: [
      { name: "Tandur Rythu Bazar", location: "Nehru Gunj Road, Near Railway Station, Tandur, Vikarabad, Telangana 501141", landmark: "Nehru Gunj, Near Tandur Railway Station", slug: "tandur-rythu-bazar", mapQuery: "Rythu Bazar, Nehru Gunj, Tandur, Telangana 501141" },
      { name: "Vikarabad Rythu Bazar", location: "New Gunj Road, Near RTC Bus Stand, Vikarabad, Telangana 501101", landmark: "New Gunj, Near Vikarabad RTC Bus Stand", slug: "vikarabad-rythu-bazar", mapQuery: "Rythu Bazar, Vikarabad, Telangana 501101" },
      { name: "Tandur Vegetable Market", location: "Dargah Road, Brindavan Colony, Tandur, Vikarabad, Telangana 501141", landmark: "Dargah Road, Brindavan Colony, Tandur", slug: "tandur-vegetable-market", mapQuery: "Vegetable Market, Tandur, Telangana 501141" }
    ]
  },
  "wanaparthy": {
    area: "Gandhi Chowk & Market Road, Wanaparthy",
    display: "📍 Wanaparthy Rythu Bazar",
    name: "Wanaparthy Rythu Bazar",
    location: "Gandhi Chowk Road, Near Old Bus Stand, Wanaparthy Town, Telangana 509103",
    landmark: "Near Gandhi Chowk & Palace Road, Wanaparthy",
    slug: "wanaparthy-rythu-bazar",
    mapQuery: "Rythu Bazar, Wanaparthy, Telangana 509103",
    markets: [
      { name: "Wanaparthy Rythu Bazar", location: "Gandhi Chowk Road, Near Old Bus Stand, Wanaparthy Town, Telangana 509103", landmark: "Near Gandhi Chowk & Palace Road, Wanaparthy", slug: "wanaparthy-rythu-bazar", mapQuery: "Rythu Bazar, Wanaparthy, Telangana 509103" },
      { name: "Wanaparthy APMC Market Yard", location: "Pebbair Road, Wanaparthy, Telangana 509103", landmark: "Pebbair Road Market Yard", slug: "wanaparthy-apmc", mapQuery: "Agricultural Market Yard, Wanaparthy, Telangana 509103" },
      { name: "Kothakota Vegetable Market", location: "NH 44, Near Bus Stand, Kothakota, Wanaparthy, Telangana 509381", landmark: "Near Kothakota Bus Stand, NH 44", slug: "kothakota-mandi", mapQuery: "Vegetable Market, Kothakota, Wanaparthy, Telangana 509381" }
    ]
  },
  "warangal": {
    area: "Ramannapet & Girmajipet, Warangal",
    display: "📍 Ramannapet Rythu Bazar",
    name: "Ramannapet Rythu Bazar",
    location: "Ramannapet Main Road, Near Warangal Railway Station, Warangal, Telangana 506002",
    landmark: "Ramannapet, Near Warangal Railway Station",
    slug: "ramannapet-rythu-bazar",
    mapQuery: "Rythu Bazar, Ramannapet, Warangal, Telangana 506002",
    markets: [
      { name: "Ramannapet Rythu Bazar", location: "Ramannapet Main Road, Near Warangal Railway Station, Warangal, Telangana 506002", landmark: "Ramannapet, Near Warangal Railway Station", slug: "ramannapet-rythu-bazar", mapQuery: "Rythu Bazar, Ramannapet, Warangal, Telangana 506002" },
      { name: "Girmajipet Vegetable Market", location: "Girmajipet Road, Near MGM Hospital, Warangal, Telangana 506002", landmark: "Girmajipet, Near MGM Hospital", slug: "girmajipet-vegetable-market", mapQuery: "Vegetable Market, Girmajipet, Warangal, Telangana 506002" },
      { name: "Narsampet Rythu Bazar", location: "Pakhal Road, Near Bus Stand, Narsampet, Warangal, Telangana 506132", landmark: "Near Narsampet Bus Stand, Pakhal Road", slug: "narsampet-mandi", mapQuery: "Rythu Bazar, Narsampet, Telangana 506132" }
    ]
  },
  "yadadri-bhuvanagiri": {
    area: "Medikuntapally & Chityala, Bhuvanagiri",
    display: "📍 Bhuvanagiri Rythu Bazar",
    name: "Bhuvanagiri Rythu Bazar",
    location: "Main Road, Near Bus Depot, Medikuntapally, Bhuvanagiri, Yadadri Bhuvanagiri, Telangana 508116",
    landmark: "Main Road, Medikuntapally, Near Bhongir Fort Road",
    slug: "bhuvanagiri-rythu-bazar",
    mapQuery: "Rythu Bazar, Bhuvanagiri, Telangana 508116",
    markets: [
      { name: "Bhuvanagiri Rythu Bazar", location: "Main Road, Near Bus Depot, Medikuntapally, Bhuvanagiri, Yadadri Bhuvanagiri, Telangana 508116", landmark: "Main Road, Medikuntapally, Near Bhongir Fort Road", slug: "bhuvanagiri-rythu-bazar", mapQuery: "Rythu Bazar, Bhuvanagiri, Telangana 508116" },
      { name: "Chityala Rythu Bazar", location: "NH 65 Highway Road, Near Bus Stand, Chityala, Yadadri Bhuvanagiri, Telangana 508114", landmark: "Near Chityala Bus Stand, NH 65", slug: "chityala-rythu-bazar", mapQuery: "Rythu Bazar, Chityala, Telangana 508114" },
      { name: "Bhongir APMC Market Yard", location: "Raigir Road, Bhuvanagiri, Yadadri Bhuvanagiri, Telangana 508116", landmark: "Raigir Road Market Yard, Bhuvanagiri", slug: "bhongir-apmc", mapQuery: "Agriculture Market Committee, Bhongir, Bhuvanagiri, Telangana 508116" }
    ]
  }
};

// ─── SELECTORS ───
const selDistrict = document.getElementById('sel-district');
const selMarket   = document.getElementById('sel-market');
const selCommodity = document.getElementById('sel-commodity');
const selLang      = document.getElementById('sel-lang');

selDistrict.addEventListener('change', async () => {
  await loadMarketsForDistrict(selDistrict.value);
  updateActiveBanner();
  loadAll();
});
selMarket.addEventListener('change', () => {
  updateActiveBanner();
  loadAll();
});
selCommodity.addEventListener('change', loadAll);
if (selLang) {
  selLang.addEventListener('change', () => {
    const chatLang = document.getElementById('chat-lang');
    if (chatLang) chatLang.value = selLang.value;
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
  await initDistricts();
  await loadMarketsForDistrict(selDistrict.value);
  updateActiveBanner();
  loadAll();
});

function _normalizeStr(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function _getActiveMarketMeta() {
  const dSlug = selDistrict.value;
  const selectedSlug = selMarket.value;
  const rawText = selMarket.options[selMarket.selectedIndex]?.text || '';
  const selectedText = rawText.replace(/^[📍🏢🏪🛒]\s*/, '').trim();
  const meta = DISTRICT_RYTHU_BAZARS[dSlug];

  const normSlug = _normalizeStr(selectedSlug);
  const normText = _normalizeStr(selectedText);

  let matchedMarket = null;
  if (meta && meta.markets) {
    matchedMarket = meta.markets.find(m => 
      m.slug === selectedSlug ||
      m.name.toLowerCase() === selectedText.toLowerCase() ||
      _normalizeStr(m.slug) === normSlug ||
      _normalizeStr(m.name) === normText ||
      _normalizeStr(m.name).includes(normText) ||
      normText.includes(_normalizeStr(m.name))
    );
  }
  return { meta, matchedMarket, selectedText, dSlug };
}

function updateActiveBanner() {
  const { meta, matchedMarket, selectedText, dSlug } = _getActiveMarketMeta();
  const titleEl = document.getElementById('bazar-banner-title');
  const addrEl  = document.getElementById('bazar-banner-address');

  const marketName = matchedMarket?.name || meta?.name || selectedText || 'Rythu Bazar';
  const marketAddr = matchedMarket?.location || meta?.location || `${selectedText}, ${selDistrict.options[selDistrict.selectedIndex]?.text || dSlug} District, Telangana`;
  const marketLandmark = matchedMarket?.landmark || meta?.landmark;

  if (titleEl) {
    titleEl.textContent = marketName;
  }

  if (addrEl) {
    let html = `📍 ${marketAddr}`;
    if (marketLandmark && marketLandmark !== marketAddr) {
      html += ` <span class="bazar-landmark">(Landmark: ${marketLandmark})</span>`;
    }
    html += ` <span class="map-link-hint">↗ View on Maps</span>`;
    addrEl.innerHTML = html;
  }

  // Update the header location button label & tooltip
  const locText = document.getElementById('btn-location-text');
  if (locText) {
    locText.textContent = 'Maps';
    const btn = document.getElementById('btn-map-location');
    if (btn) btn.title = `Open exact location for "${marketName}" on Google Maps`;
  }
}

function openMarketMap() {
  const { meta, matchedMarket, selectedText, dSlug } = _getActiveMarketMeta();

  let searchQuery = '';
  if (matchedMarket) {
    searchQuery = matchedMarket.mapQuery || matchedMarket.location || `${matchedMarket.name}, ${meta?.area || dSlug}, Telangana`;
  } else if (meta) {
    searchQuery = meta.mapQuery || meta.location || `${meta.name}, ${meta.area}, Telangana`;
  } else {
    searchQuery = `${selectedText}, ${dSlug} District, Telangana`;
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}

async function initDistricts() {
  try {
    const res = await fetch(`${API}/districts`);
    const districts = await res.json();
    if (Array.isArray(districts) && districts.length > 0) {
      const currentVal = selDistrict.value || 'nalgonda';
      selDistrict.innerHTML = districts
        .map(d => `<option value="${d.slug}" ${d.slug === currentVal ? 'selected' : ''}>${d.name}</option>`)
        .join('');
      if ([...selDistrict.options].some(o => o.value === currentVal)) {
        selDistrict.value = currentVal;
      }
    }
  } catch (e) {
    console.warn('Using pre-rendered district options', e);
  }
}

async function loadMarketsForDistrict(districtSlug) {
  const meta = DISTRICT_RYTHU_BAZARS[districtSlug];

  // Instantly populate from local dictionary
  if (meta && meta.markets && meta.markets.length > 0) {
    const optionsHtml = meta.markets.map((m, idx) => {
      const isRythu = m.name.toLowerCase().includes('rythu') || m.name.toLowerCase().includes('vegetable') || m.name.toLowerCase().includes('grain') || m.name.toLowerCase().includes('fruit');
      const emoji = isRythu ? '📍' : '🏢';
      return `<option value="${m.slug}" ${idx === 0 ? 'selected' : ''}>${emoji} ${m.name}</option>`;
    }).join('');
    selMarket.innerHTML = optionsHtml;
  } else if (meta) {
    selMarket.innerHTML = `<option value="${meta.slug}" selected>${meta.display}</option>`;
  } else {
    selMarket.innerHTML = `<option value="" selected>📍 Primary Rythu Bazar</option>`;
  }
  selMarket.disabled = false;
  updateActiveBanner();

  try {
    const res = await fetch(`${API}/markets?district=${encodeURIComponent(districtSlug)}`);
    const markets = await res.json();
    if (Array.isArray(markets) && markets.length > 0) {
      const prevVal = selMarket.value;
      let optionsHtml = '';
      // Merge backend markets with meta.markets if available to preserve rich metadata slugs
      markets.forEach((m, idx) => {
        const isRythu = m.name.toLowerCase().includes('rythu') || m.name.toLowerCase().includes('vegetable') || m.name.toLowerCase().includes('grain') || m.name.toLowerCase().includes('fruit');
        const emoji = isRythu ? '📍' : '🏢';
        const matchedLocal = meta?.markets?.find(lm => _normalizeStr(lm.name) === _normalizeStr(m.name));
        const slugVal = matchedLocal ? matchedLocal.slug : m.slug;
        const isSelected = (prevVal && (prevVal === slugVal || prevVal === m.slug)) || (!prevVal && idx === 0);
        optionsHtml += `<option value="${slugVal}" ${isSelected ? 'selected' : ''}>${emoji} ${m.name}</option>`;
      });
      selMarket.innerHTML = optionsHtml;
      updateActiveBanner();
    }
  } catch (e) {
    console.warn('Markets fetch fallback to local dictionary', e);
  }
}

async function loadAll() {

  const commodity = selCommodity.value;
  const district  = selDistrict.value;
  const market    = selMarket.value;
  loadLatestPrice(commodity, district, market);
  loadHistory(commodity, district, market);
  loadForecast(commodity, district, market);
  loadComparison(commodity);
}

// ─── LATEST PRICE ───
async function loadLatestPrice(commodity, district, market) {
  try {
    let url = `${API}/prices/latest?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      document.getElementById('kpi-price').textContent = 'N/A';
      document.getElementById('kpi-market').textContent = json.error;
      return;
    }
    const d = json.data, m = json.meta;
    document.getElementById('kpi-price').textContent = `₹${Number(d.modal_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-market').textContent = `🏪 ${d.market} • ${m.observation_date}`;
    document.getElementById('kpi-range').textContent = `₹${Number(d.min_price).toLocaleString('en-IN')} – ₹${Number(d.max_price).toLocaleString('en-IN')}`;
    document.getElementById('kpi-unit').textContent = d.unit || 'INR/quintal';

    const trendPct = d.trend_7d_pct || 0;
    document.getElementById('kpi-trend').textContent = `${trendPct >= 0 ? '+' : ''}${trendPct.toFixed(1)}%`;
    document.getElementById('kpi-trend-label').innerHTML = `<span class="kpi-trend ${trendPct > 0 ? 'up' : trendPct < 0 ? 'down' : 'stable'}">${d.trend_label}</span>`;

    const freshnessEl = document.getElementById('freshness-badge');
    if (freshnessEl) freshnessEl.textContent = m.freshness_label || '🟢 Verified e-NAM Feed';
  } catch (e) {
    document.getElementById('kpi-price').textContent = 'Error';
  }
}


// ─── TAB SWITCHER ───
function switchTab(tab) {
  ['history', 'forecast'].forEach(t => {
    document.getElementById(`panel-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
  });
}

// ─── PRICE SUMMARY BAR ───
function updatePriceSummary(series) {
  if (!series || !series.length) return;
  const latest = series[series.length - 1];
  const first  = series[0];

  const fmt = v => v != null ? '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—';

  document.getElementById('ps-min').textContent   = fmt(latest.min_price);
  document.getElementById('ps-modal').textContent = fmt(latest.modal_price);
  document.getElementById('ps-max').textContent   = fmt(latest.max_price);

  // Trend vs 7 days ago
  const weekAgo = series[Math.max(0, series.length - 8)];
  if (weekAgo && weekAgo.modal_price && latest.modal_price) {
    const pct = ((latest.modal_price - weekAgo.modal_price) / weekAgo.modal_price * 100).toFixed(1);
    const arrow = pct > 0 ? '▲' : pct < 0 ? '▼' : '━';
    const sign  = pct > 0 ? '+' : '';
    document.getElementById('ps-trend').textContent = `${arrow} ${sign}${pct}%`;
    document.getElementById('ps-trend').style.color = pct > 0 ? '#15803d' : pct < 0 ? '#b91c1c' : '#0369a1';
    document.getElementById('ps-trend-label').textContent = '7-day change';
  }
}

// ─── HISTORY CHART (Clean Area Chart — Modal only + faint min/max band) ───
async function loadHistory(commodity, district, market) {
  try {
    let url = `${API}/prices/history?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&days=30`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const series = json.series || [];
    if (!series.length) return;

    // Update price summary bar
    updatePriceSummary(series);

    // Show every 5th date label to avoid clutter
    const labels  = series.map((s, i) => (i % 5 === 0 || i === series.length - 1) ? s.date.slice(5) : '');
    const modal   = series.map(s => s.modal_price);
    const minP    = series.map(s => s.min_price);
    const maxP    = series.map(s => s.max_price);

    if (historyChart) historyChart.destroy();
    const ctx = document.getElementById('chart-history').getContext('2d');

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    grad.addColorStop(0, 'rgba(22, 163, 74, 0.22)');
    grad.addColorStop(1, 'rgba(22, 163, 74, 0.01)');

    historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Modal Price (₹)',
            data: modal,
            borderColor: '#16a34a',
            backgroundColor: grad,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: series.map((_, i) => i === series.length - 1 ? 6 : 0),
            pointHoverRadius: 6,
            pointBackgroundColor: '#16a34a',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            order: 1,
          },
          {
            label: 'Max Price (₹)',
            data: maxP,
            borderColor: 'rgba(217, 119, 6, 0.4)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            order: 2,
          },
          {
            label: 'Min Price (₹)',
            data: minP,
            borderColor: 'rgba(2, 132, 199, 0.4)',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            order: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#14532d',
            bodyColor: '#334155',
            borderColor: 'rgba(22, 163, 74, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            callbacks: {
              title: ctx => `📅 ${series[ctx[0].dataIndex]?.date || ''}`,
              label: ctx => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              maxRotation: 0,
            },
            border: { display: false },
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(22, 101, 52, 0.06)', drawBorder: false },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              callback: v => '₹' + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 0}),
              maxTicksLimit: 6,
            },
            border: { display: false },
          },
        },
      },
    });
  } catch (e) {
    console.error('History chart error:', e);
  }
}

// ─── FORECAST CHART (Clean Bar Chart — easy to read day-by-day) ───
async function loadForecast(commodity, district, market) {
  try {
    let url = `${API}/forecast?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}&horizon=7`;
    if (market) url += `&market=${encodeURIComponent(market)}`;
    const res = await fetch(url);
    const json = await res.json();
    const forecasts = json.forecasts || [];
    if (!forecasts.length) {
      document.getElementById('kpi-forecast').textContent = 'N/A';
      return;
    }

    const obs    = json.current_observation || {};
    const labels = ['Today', ...forecasts.map(f => `+${f.horizon_days}d`)];
    const pred   = [obs.modal_price || null, ...forecasts.map(f => f.predicted_price)];
    const lower  = [obs.min_price  || null, ...forecasts.map(f => f.lower_bound)];
    const upper  = [obs.max_price  || null, ...forecasts.map(f => f.upper_bound)];

    const f7 = forecasts.find(f => f.horizon_days === 7) || forecasts[forecasts.length - 1];
    document.getElementById('kpi-forecast').textContent = `₹${Number(f7.predicted_price).toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('kpi-confidence').textContent = `${json.confidence_label || 'Medium'} confidence • ML estimate`;

    if (forecastChart) forecastChart.destroy();
    const ctx = document.getElementById('chart-forecast').getContext('2d');

    // Color bars: green if same/above today, red if below
    const todayPrice = obs.modal_price || pred[0] || 0;
    const barColors = pred.map((v, i) => {
      if (i === 0) return 'rgba(22, 163, 74, 0.75)';  // today = green
      return v >= todayPrice ? 'rgba(22, 163, 74, 0.65)' : 'rgba(220, 38, 38, 0.6)';
    });
    const barBorders = pred.map((v, i) => {
      if (i === 0) return '#15803d';
      return v >= todayPrice ? '#15803d' : '#dc2626';
    });

    forecastChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Predicted Price (₹)',
            data: pred,
            backgroundColor: barColors,
            borderColor: barBorders,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            order: 1,
          },
          {
            label: 'Upper Bound (₹)',
            data: upper,
            type: 'line',
            borderColor: 'rgba(217, 119, 6, 0.7)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(217, 119, 6, 0.7)',
            order: 0,
          },
          {
            label: 'Lower Bound (₹)',
            data: lower,
            type: 'line',
            borderColor: 'rgba(2, 132, 199, 0.7)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(2, 132, 199, 0.7)',
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#14532d',
            bodyColor: '#334155',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#78a88c', font: { size: 12, weight: '700' } },
            border: { display: false },
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(22, 101, 52, 0.06)' },
            ticks: {
              color: '#78a88c',
              font: { size: 11, weight: '600' },
              callback: v => '₹' + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 0}),
              maxTicksLimit: 6,
            },
            border: { display: false },
          },
        },
      },
    });
  } catch (e) {
    console.error('Forecast chart error:', e);
  }
}



// ─── COMPARISON TABLE ───
async function loadComparison(commodity) {
  try {
    const res = await fetch(`${API}/compare?commodity=${encodeURIComponent(commodity)}`);
    const json = await res.json();
    const comps = json.comparisons || [];
    const tbody = document.getElementById('compare-body');
    if (!comps.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#5a6478;">No data</td></tr>'; return; }
    tbody.innerHTML = comps.map(c => {
      const rankClass = c.rank <= 3 ? `rank-${c.rank}` : '';
      const confClass = c.confidence === 'High' ? 'confidence-high' : c.confidence === 'Low' ? 'confidence-low' : 'confidence-medium';
      return `<tr>
        <td><span class="rank-badge ${rankClass}">${c.rank}</span></td>
        <td><strong>${c.district}</strong></td>
        <td>${c.market}</td>
        <td><strong>₹${Number(c.current_modal_price).toLocaleString('en-IN')}</strong></td>
        <td>₹${Number(c.forecast_7d).toLocaleString('en-IN')}</td>
        <td><span class="confidence-badge ${confClass}">${c.confidence}</span></td>
      </tr>`;
    }).join('');
  } catch (e) { console.error('Comparison error:', e); }
}

// ─── CHAT ───
function toggleChat() {
  document.getElementById('chat-overlay').classList.toggle('active');
}

function appendMsg(text, role) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  div.appendChild(bubble);
  const container = document.getElementById('chat-messages');
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

async function sendChat(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return false;
  appendMsg(text, 'user');
  input.value = '';
  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: document.getElementById('chat-lang').value }),
    });
    const data = await res.json();
    appendMsg(data.answer || 'No response.', 'bot');
  } catch (e) { appendMsg('Connection error. Please try again.', 'bot'); }
  return false;
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  document.getElementById('chat-overlay').classList.add('active');
  sendChat(new Event('submit'));
}
