/* ─── Farmer Market AI — Dashboard JavaScript ─── */

const API = '/api/v1';
let historyChart = null;
let forecastChart = null;

// ─── OFFICIAL TELANGANA RYTHU BAZARS METADATA & AREAS ───
// Updated with exact market names, addresses & landmarks (district-wise, deduplicated)
const DISTRICT_RYTHU_BAZARS = {
  "adilabad": {
    area: "Gandhi Chowk, Mahalaxmiwada",
    display: "📍 Gandhi Chowk — Adilabad Rythu Bazar / Vegetable Market",
    name: "Adilabad Rythu Bazar / Vegetable Market",
    location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001",
    landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road, Opp. Rythu Bazar, Ponnar, Ravindra Nagar Colony, Adilabad 504001",
    slug: "adilabad-rythu-bazar-vegetable-market",
    markets: [
      { name: "Adilabad Rythu Bazar / Vegetable Market", location: "Vegetable Market, Gandhi Chowk, Mahalaxmiwada, Adilabad, Telangana 504001", landmark: "Opp. Sagar Supermarket, Vinayak Chowk Road, Opp. Rythu Bazar, Ponnar, Ravindra Nagar Colony, Adilabad 504001", slug: "adilabad-rythu-bazar-vegetable-market" }
    ]
  },
  "bhadradri-kothagudem": {
    area: "Coolie Lane, Kothagudem",
    display: "📍 Coolie Lane — Kothagudem Rythu Bazar",
    name: "Kothagudem Rythu Bazar",
    location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Telangana 507101",
    landmark: "HJ38+PFQ, Coolie Lane, Bhadradri Kothagudem, Telangana 507101",
    slug: "kothagudem-rythu-bazar",
    markets: [
      { name: "Kothagudem Rythu Bazar", location: "Rythu Bazar Road, Coolie Lane, Kothagudem, Telangana 507101", landmark: "HJ38+PFQ, Coolie Lane, Bhadradri Kothagudem, Telangana 507101", slug: "kothagudem-rythu-bazar" },
      { name: "Yellandu Rythu Bazar", location: "Yellandu Road, Basthi Number 2, Yellandu, Telangana 507123", landmark: "Basthi Number 2, Yellandu", slug: "yellandu-rythu-bazar" }
    ]
  },
  "hanamkonda": {
    area: "Ramnagar, Hanamkonda",
    display: "📍 Ramnagar — Hanamkonda Rythu Bazar",
    name: "Hanamkonda Rythu Bazar",
    location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Hanamkonda, Ramnagar, Warangal, Telangana 506001",
    landmark: "Near Old Bus Depot, Ramnagar",
    slug: "hanamkonda-rythu-bazar",
    markets: [
      { name: "Enumamula Rythu Bazar / Grain Market", location: "Sundaraiah Nagar, Grain Market, Enumamula, Warangal, Telangana 506006", landmark: "Enumamula Grain Market", slug: "enumamula-rythu-bazar-grain-market" },
      { name: "Balasamudram Rythu Bazar", location: "2H45+6J6, Balasamudram, Hanamkonda, Telangana 506001", landmark: "Balasamudram", slug: "balasamudram-rythu-bazar" },
      { name: "Hanamkonda Rythu Bazar", location: "NGO Colony Road, Depo Road, Near Old Bus Depot, Hanamkonda, Ramnagar, Warangal, Telangana 506001", landmark: "Near Old Bus Depot, Ramnagar", slug: "hanamkonda-rythu-bazar" }
    ]
  },
  "hyderabad": {
    area: "Malakpet Gunj, Hyderabad",
    display: "📍 Malakpet Gunj — Malakpet Rythu Bazar",
    name: "Malakpet Rythu Bazar",
    location: "9GF3+MVH, Malakpet Gunj Road, Akbarbagh, Malakpet, Hyderabad, Telangana 500036",
    landmark: "Malakpet Gunj",
    slug: "malakpet-rythu-bazar",
    markets: [
      { name: "Malakpet Rythu Bazar", location: "9GF3+MVH, Malakpet Gunj Road, Akbarbagh, Malakpet, Hyderabad, Telangana 500036", landmark: "Malakpet Gunj", slug: "malakpet-rythu-bazar" },
      { name: "Gudimalkapur Rythu Bazar", location: "9CMP+H5X, Alluri Sitarama Raju Nagar, Kanaka Durga Colony, Gudimalkapur, Hyderabad, Telangana 500006", landmark: "Kanaka Durga Colony, Gudimalkapur", slug: "gudimalkapur-rythu-bazar" },
      { name: "Gudimalkapur Vegetable Market", location: "Vegetable Market, Alluri Sitarama Raju Nagar, Kanaka Durga Colony, Gudimalkapur, Hyderabad, Telangana 500006", landmark: "Gudimalkapur Vegetable Market", slug: "gudimalkapur-vegetable-market" }
    ]
  },
  "jagtial": {
    area: "Brahma Wada, Jagtial",
    display: "📍 Brahma Wada — Jagtial Rythu Bazar",
    name: "Jagtial Rythu Bazar",
    location: "QWW8+6V8, Brahma Wada, Jagtial, Telangana 505327",
    landmark: "Brahma Wada",
    slug: "jagtial-rythu-bazar",
    markets: [
      { name: "Jagtial Rythu Bazar", location: "QWW8+6V8, Brahma Wada, Jagtial, Telangana 505327", landmark: "Brahma Wada", slug: "jagtial-rythu-bazar" },
      { name: "Jagtial Vegetable Market", location: "Tower Circle, Jagtial, Telangana 505327", landmark: "Tower Circle", slug: "jagtial-vegetable-market" },
      { name: "Korutla Rythu Bazar", location: "RPH8+6Q2, Korutla, Telangana 505326", landmark: "Korutla", slug: "korutla-rythu-bazar" }
    ]
  },
  "jangaon": {
    area: "Vegetable Market Street, Jangaon",
    display: "📍 Vegetable Market Street — Jangaon Vegetable Market",
    name: "Jangaon Vegetable Market",
    location: "P5F4+V42, Vegetable Market Street, Jangaon, Telangana 506167",
    landmark: "Jangaon Vegetable Market",
    slug: "jangaon-vegetable-market",
    markets: [
      { name: "Jangaon Vegetable Market", location: "P5F4+V42, Vegetable Market Street, Jangaon, Telangana 506167", landmark: "Jangaon Vegetable Market", slug: "jangaon-vegetable-market" },
      { name: "Jangaon Grain Market", location: "P5J5+P6, Jangaon-Chitakodur Road, Near Railway Station, Jangaon, Telangana 506167", landmark: "Near Jangaon Railway Station", slug: "jangaon-grain-market" }
    ]
  },
  "jayashankar-bhupalpally": {
    area: "Subash Colony, Bhupalpally",
    display: "📍 Subash Colony — Bhupalpally Rythu Bazar",
    name: "Bhupalpally Rythu Bazar",
    location: "CVQ7+C6Q, Subash Colony, Bhupalpally, Telangana 506169",
    landmark: "Subash Colony",
    slug: "bhupalpally-rythu-bazar",
    markets: [
      { name: "Bhupalpally Rythu Bazar", location: "CVQ7+C6Q, Subash Colony, Bhupalpally, Telangana 506169", landmark: "Subash Colony", slug: "bhupalpally-rythu-bazar" }
    ]
  },
  "jogulamba-gadwal": {
    area: "Momin Mohalla, Gadwal",
    display: "📍 Momin Mohalla — Gadwal Rythu Bazar",
    name: "Gadwal Rythu Bazar",
    location: "6QMX+X92, Momin Mohalla, Gadwal, Telangana 509125",
    landmark: "Momin Mohalla",
    slug: "gadwal-rythu-bazar",
    markets: [
      { name: "Gadwal Rythu Bazar", location: "6QMX+X92, Momin Mohalla, Gadwal, Telangana 509125", landmark: "Momin Mohalla", slug: "gadwal-rythu-bazar" },
      { name: "Gadwal Vegetable Market", location: "6RP7+F86, Housing Board Colony, Gadwal, Telangana 509125", landmark: "Housing Board Colony", slug: "gadwal-vegetable-market" }
    ]
  },
  "kamareddy": {
    area: "Lachapet, Kamareddy",
    display: "📍 Lachapet — Kamareddy Rythu Bazar",
    name: "Kamareddy Rythu Bazar",
    location: "88FR+WJX, Lachapet, Kamareddy, Telangana 503111",
    landmark: "Lachapet",
    slug: "kamareddy-rythu-bazar",
    markets: [
      { name: "Kamareddy Rythu Bazar", location: "88FR+WJX, Lachapet, Kamareddy, Telangana 503111", landmark: "Lachapet", slug: "kamareddy-rythu-bazar" },
      { name: "Kamareddy Vegetable Market", location: "88GJ+X9V, Sri Ram Nagar Colony, Ashok Nagar, Kamareddy, Telangana 503111", landmark: "Sri Ram Nagar Colony, Ashok Nagar", slug: "kamareddy-vegetable-market" },
      { name: "Padmajiwadi Vegetable Market", location: "Padmajiwadi X Road, Kamareddy, Telangana 503111", landmark: "Padmajiwadi X Road", slug: "padmajiwadi-vegetable-market" }
    ]
  },
  "karimnagar": {
    area: "Saraswathi Nagar, Karimnagar",
    display: "📍 Saraswathi Nagar — Karimnagar Rythu Bazar",
    name: "Karimnagar Rythu Bazar",
    location: "C4WP+7Q5, Saraswathi Nagar, Karimnagar, Telangana 505001",
    landmark: "Saraswathi Nagar",
    slug: "karimnagar-rythu-bazar",
    markets: [
      { name: "Karimnagar Rythu Bazar", location: "C4WP+7Q5, Saraswathi Nagar, Karimnagar, Telangana 505001", landmark: "Saraswathi Nagar", slug: "karimnagar-rythu-bazar" },
      { name: "Karimnagar Vegetable Market", location: "Islampura, Ashoknagar, Karimnagar, Telangana 505001", landmark: "Islampura, Ashoknagar", slug: "karimnagar-vegetable-market" },
      { name: "Sipada Rao Fruit Market", location: "Sipada Rao Fruit Market, Kisan Nagar, Karimnagar, Telangana 505001", landmark: "Kisan Nagar", slug: "sipada-rao-fruit-market" }
    ]
  },
  "khammam": {
    area: "Rajendra Nagar, Khammam",
    display: "📍 Rajendra Nagar — Khammam Rythu Bazar",
    name: "Khammam Rythu Bazar",
    location: "Kodad–Khammam Road, Rajendra Nagar, Prakash Nagar, Khammam, Telangana 507003",
    landmark: "Kodad–Khammam Road, Prakash Nagar",
    slug: "khammam-rythu-bazar",
    markets: [
      { name: "Khammam Rythu Bazar", location: "Kodad–Khammam Road, Rajendra Nagar, Prakash Nagar, Khammam, Telangana 507003", landmark: "Kodad–Khammam Road, Prakash Nagar", slug: "khammam-rythu-bazar" },
      { name: "Madhira Rythu Bazar", location: "Vijayawada–Warangal Line, Madhira, Telangana 507203", landmark: "Vijayawada–Warangal Line, Madhira", slug: "madhira-rythu-bazar" },
      { name: "Wyra Rythu Bazar", location: "59M4+QX4, Madhira–Wyra Road, Sundaraiah Nagar, Wyra, Khammam, Telangana 507165", landmark: "Madhira–Wyra Road, Sundaraiah Nagar, Wyra", slug: "wyra-rythu-bazar" }
    ]
  },
  "komaram-bheem-asifabad": {
    area: "Jubilee Market Road, Asifabad",
    display: "📍 Jubilee Market Road — Asifabad Rythu Bazar",
    name: "Asifabad Rythu Bazar",
    location: "977V+FX8, Jubilee Market Road, Asifabad, Telangana 504293",
    landmark: "Jubilee Market Road, Asifabad",
    slug: "asifabad-rythu-bazar",
    markets: [
      { name: "Asifabad Rythu Bazar", location: "977V+FX8, Jubilee Market Road, Asifabad, Telangana 504293", landmark: "Jubilee Market Road, Asifabad", slug: "asifabad-rythu-bazar" }
    ]
  },
  "mahabubabad": {
    area: "Mahabubabad",
    display: "📍 Mahabubabad — Mahabubabad Rythu Bazar",
    name: "Mahabubabad Rythu Bazar",
    location: "H2V6+443, Mahabubabad, Telangana 506101",
    landmark: "Mahabubabad",
    slug: "mahabubabad-rythu-bazar",
    markets: [
      { name: "Mahabubabad Rythu Bazar", location: "H2V6+443, Mahabubabad, Telangana 506101", landmark: "Mahabubabad", slug: "mahabubabad-rythu-bazar" },
      { name: "Kesamudram Rythu Bazar", location: "MVQR+M94, Kesamudram, Telangana 506112", landmark: "Kesamudram", slug: "kesamudram-rythu-bazar" },
      { name: "Mahabubabad Vegetable Market", location: "Near Railway Station, Mahabubabad, Telangana 506101", landmark: "Near Mahabubabad Railway Station", slug: "mahabubabad-vegetable-market" }
    ]
  },
  "mahabubnagar": {
    area: "Ramaiah Bowli, Mahbubnagar",
    display: "📍 Ramaiah Bowli — Mahabubnagar Rythu Bazar",
    name: "Mahabubnagar Rythu Bazar",
    location: "PXRR+Q5Q, Ramaiah Bowli, Mahbubnagar, Telangana 509001",
    landmark: "Ramaiah Bowli",
    slug: "mahabubnagar-rythu-bazar",
    markets: [
      { name: "Mahabubnagar Rythu Bazar", location: "PXRR+Q5Q, Ramaiah Bowli, Mahbubnagar, Telangana 509001", landmark: "Ramaiah Bowli", slug: "mahabubnagar-rythu-bazar" },
      { name: "Jadcherla Vegetable Market", location: "Shop No. 26, Vegetable Market, Jadcherla, Badepalle, Telangana 509301", landmark: "Jadcherla Vegetable Market", slug: "jadcherla-vegetable-market" },
      { name: "Badepalle Rythu Bazar", location: "Q43W+89M, Badepalle, Jadcherla, Telangana 509301", landmark: "Badepalle, Jadcherla", slug: "badepalle-rythu-bazar" }
    ]
  },
  "mancherial": {
    area: "Iqbal Ahmed Nagar, Mancherial",
    display: "📍 Iqbal Ahmed Nagar — Mancherial Rythu Bazar",
    name: "Mancherial Rythu Bazar",
    location: "Market Road, Iqbal Ahmed Nagar, Mancherial, Telangana 504208",
    landmark: "Market Road, Iqbal Ahmed Nagar",
    slug: "mancherial-rythu-bazar",
    markets: [
      { name: "Mancherial Rythu Bazar", location: "Market Road, Iqbal Ahmed Nagar, Mancherial, Telangana 504208", landmark: "Market Road, Iqbal Ahmed Nagar", slug: "mancherial-rythu-bazar" },
      { name: "Mancherial Vegetable Market", location: "VF67+R8P, Thollavagu, Mancherial, Telangana 504208", landmark: "Thollavagu, Mancherial", slug: "mancherial-vegetable-market" },
      { name: "Bellampalle Rythu Bazar", location: "3F7M+2J, Mancherial Road, Bellampalle, Telangana 504251", landmark: "Mancherial Road, Bellampalle", slug: "bellampalle-rythu-bazar" }
    ]
  },
  "medak": {
    area: "Yeddumailaram, Medak",
    display: "📍 Yeddumailaram — Yeddumailaram Rythu Bazar",
    name: "Yeddumailaram Rythu Bazar",
    location: "G42W+335, Yeddumailaram, Telangana 502205",
    landmark: "Yeddumailaram",
    slug: "yeddumailaram-rythu-bazar",
    markets: [
      { name: "Yeddumailaram Rythu Bazar", location: "G42W+335, Yeddumailaram, Telangana 502205", landmark: "Yeddumailaram", slug: "yeddumailaram-rythu-bazar" },
      { name: "Tupran Rythu Bazar", location: "RFVG+GF5, Tupran, Telangana 502334", landmark: "Tupran", slug: "tupran-rythu-bazar" },
      { name: "Tupran Vegetable Market", location: "RFPF+RHX, Tupran, Telangana 502334", landmark: "Tupran", slug: "tupran-vegetable-market" }
    ]
  },
  "medchal-malkajgiri": {
    area: "Mallikarjuna Nagar, Malkajgiri",
    display: "📍 Malkajgiri — Malkajgiri Rythu Bazar",
    name: "Malkajgiri Rythu Bazar",
    location: "CGXG+XPR, Indira Nehru Nagar, Mallikarjuna Nagar, Malkajgiri, Secunderabad, Telangana 500047",
    landmark: "Indira Nehru Nagar, Malkajgiri",
    slug: "malkajgiri-rythu-bazar",
    markets: [
      { name: "Malkajgiri Rythu Bazar", location: "CGXG+XPR, Indira Nehru Nagar, Mallikarjuna Nagar, Malkajgiri, Secunderabad, Telangana 500047", landmark: "Indira Nehru Nagar, Malkajgiri", slug: "malkajgiri-rythu-bazar" },
      { name: "Bowenpally Rythu Bazar", location: "Bowenpally / Secunderabad Area, Medchal–Malkajgiri, Telangana 500011", landmark: "Bowenpally Market Area", slug: "bowenpally-rythu-bazar" }
    ]
  },
  "mulugu": {
    area: "Borenarsapur, Mulugu",
    display: "📍 Borenarsapur — Mulugu Rythu Bazar",
    name: "Mulugu Rythu Bazar",
    location: "7G42+6JH, Burgampadu–Eturnagaram Road, Borenarsapur, Telangana 506172",
    landmark: "Burgampadu–Eturnagaram Road, Borenarsapur",
    slug: "mulugu-rythu-bazar",
    markets: [
      { name: "Mulugu Rythu Bazar", location: "7G42+6JH, Burgampadu–Eturnagaram Road, Borenarsapur, Telangana 506172", landmark: "Burgampadu–Eturnagaram Road, Borenarsapur", slug: "mulugu-rythu-bazar" }
    ]
  },
  "nagarkurnool": {
    area: "Nagarkurnool town",
    display: "📍 Nagarkurnool Town — Rythu Bazar",
    name: "Rythu Bazar, Nagarkurnool town",
    location: "Nagarkurnool town, Nagarkurnool District",
    landmark: "Nagarkurnool town",
    slug: "rythu-bazar-nagarkurnool-town",
    markets: [
      { name: "Rythu Bazar, Nagarkurnool town", location: "Nagarkurnool town, Nagarkurnool District", landmark: "Nagarkurnool town", slug: "rythu-bazar-nagarkurnool-town" }
    ]
  },
  "nalgonda": {
    area: "New Prakasham Bazar, Nalgonda",
    display: "📍 Prakasham Bazar — Nalgonda Rythu Bazar",
    name: "Nalgonda Rythu Bazar",
    location: "Shop 01, Prakasham Bazar Road, New Prakasham Bazar, Bottu Guda, Nalgonda, Telangana 508001",
    landmark: "New Prakasham Bazar, Bottu Guda, Nalgonda",
    slug: "nalgonda-rythu-bazar",
    markets: [
      { name: "Nalgonda Rythu Bazar", location: "Shop 01, Prakasham Bazar Road, New Prakasham Bazar, Bottu Guda, Nalgonda, Telangana 508001", landmark: "New Prakasham Bazar, Bottu Guda", slug: "nalgonda-rythu-bazar" },
      { name: "Nalgonda Beet Market", location: "Beet Market, Hyderabad Road, Nalgonda, Telangana 508001", landmark: "Beet Market, Hyderabad Road, Nalgonda", slug: "nalgonda-beet-market" },
      { name: "Miryalaguda Vegetable Market", location: "Vegetable Market, Market Road, Doctors Colony, Miryalaguda, Telangana 508207", landmark: "Market Road, Doctors Colony, Miryalaguda", slug: "miryalaguda-vegetable-market" }
    ]
  },
  "narayanpet": {
    area: "Narayanpet–Jajapur Road, Narayanpet",
    display: "📍 Narayanpet — Narayanpet Rythu Bazar",
    name: "Narayanpet Rythu Bazar",
    location: "PGP4+5P8, Narayanpet–Jajapur Road, Narayanpet, Telangana 509210",
    landmark: "Narayanpet–Jajapur Road",
    slug: "narayanpet-rythu-bazar",
    markets: [
      { name: "Narayanpet Rythu Bazar", location: "PGP4+5P8, Narayanpet–Jajapur Road, Narayanpet, Telangana 509210", landmark: "Narayanpet–Jajapur Road", slug: "narayanpet-rythu-bazar" },
      { name: "Kosgi Rythu Bazar", location: "XPQ4+JP3, Kosgi, Telangana 509339", landmark: "Kosgi", slug: "kosgi-rythu-bazar" },
      { name: "Kosgi Vegetable Market", location: "XPQ8+293, Kosgi, Telangana 509339", landmark: "Kosgi", slug: "kosgi-vegetable-market" }
    ]
  },
  "nirmal": {
    area: "Balajiwada, Nirmal",
    display: "📍 Balajiwada — Nirmal Rythu Bazar",
    name: "Nirmal Rythu Bazar",
    location: "482X+53X, Balajiwada, Bagulwada, Nirmal, Telangana 504106",
    landmark: "Balajiwada, Bagulwada, Nirmal",
    slug: "nirmal-rythu-bazar",
    markets: [
      { name: "Nirmal Rythu Bazar", location: "482X+53X, Balajiwada, Bagulwada, Nirmal, Telangana 504106", landmark: "Balajiwada, Bagulwada, Nirmal", slug: "nirmal-rythu-bazar" },
      { name: "Nirmal Vegetable Market", location: "486R+2XR, Naidiwada, Nirmal, Telangana 504106", landmark: "Naidiwada, Nirmal", slug: "nirmal-vegetable-market" },
      { name: "Bhainsa Rythu Bazar", location: "4X56+39P, Gandhi Gunj Road, Bhainsa, Telangana 504103", landmark: "Gandhi Gunj Road, Bhainsa", slug: "bhainsa-rythu-bazar" }
    ]
  },
  "nizamabad": {
    area: "Dubba Road, Nizamabad",
    display: "📍 Dubba Road — Nizamabad Rythu Bazar",
    name: "Nizamabad Rythu Bazar",
    location: "M3JR+MPP, Dubba Road, Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503003",
    landmark: "Dubba Road, Shradhanand Gunj, Ambedkar Colony",
    slug: "nizamabad-rythu-bazar",
    markets: [
      { name: "Nizamabad Rythu Bazar", location: "M3JR+MPP, Dubba Road, Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503003", landmark: "Dubba Road, Shradhanand Gunj", slug: "nizamabad-rythu-bazar" },
      { name: "Nizamabad Gandhi Gunj Market", location: "M3GW+79, 7-8-24, Gandhi Gunj Road, Kumar Gali, Nizamabad, Telangana 503001", landmark: "Gandhi Gunj Road, Kumar Gali", slug: "nizamabad-gandhi-gunj-market" },
      { name: "Shradhanand Gunj Vegetable Market", location: "M3HR+C93, Shradhanand Gunj, Ambedkar Colony, Nizamabad, Telangana 503001", landmark: "Shradhanand Gunj, Ambedkar Colony", slug: "shradhanand-gunj-vegetable-market" },
      { name: "Ahmedhi Bazar", location: "Ahmedhi Bazar, Quilla Road, Barkatpura, Nizamabad, Telangana 503001", landmark: "Quilla Road, Barkatpura", slug: "ahmedhi-bazar-nizamabad" },
      { name: "Nizamabad NGO Colony Market", location: "Old NGOs Colony, NGO Colony, Nizamabad, Telangana 503002", landmark: "NGO Colony, Nizamabad", slug: "nizamabad-ngo-colony-market" }
    ]
  },
  "peddapalli": {
    area: "Sagar Road, Peddapalli",
    display: "📍 Sagar Road — Peddapalli Rythu Bazar",
    name: "Peddapalli Rythu Bazar",
    location: "Sagar Road, Peddapalli, Telangana 505172",
    landmark: "Sagar Road, Peddapalli",
    slug: "peddapalli-rythu-bazar",
    markets: [
      { name: "Peddapalli Rythu Bazar", location: "Sagar Road, Peddapalli, Telangana 505172", landmark: "Sagar Road, Peddapalli", slug: "peddapalli-rythu-bazar" },
      { name: "Godavarikhani Rythu Bazar", location: "Ram Nagar, Jawahar Nagar, Godavarikhani, Ramagundam, Telangana 505209", landmark: "Ram Nagar, Jawahar Nagar, Godavarikhani", slug: "godavarikhani-rythu-bazar" }
    ]
  },
  "rajanna-sircilla": {
    area: "Gandhi Nagar, Sircilla",
    display: "📍 Gandhi Nagar — Sircilla Rythu Bazar",
    name: "Sircilla Rythu Bazar",
    location: "Shop No. 72, Market Area, Municipal Complex, Market Road, Gandhi Nagar, Rajanna Sircilla, Sircilla, Telangana 505301",
    landmark: "Municipal Complex, Market Road, Gandhi Nagar, Sircilla",
    slug: "sircilla-rythu-bazar",
    markets: [
      { name: "Sircilla Rythu Bazar", location: "Shop No. 72, Market Area, Municipal Complex, Market Road, Gandhi Nagar, Rajanna Sircilla, Sircilla, Telangana 505301", landmark: "Municipal Complex, Market Road, Gandhi Nagar", slug: "sircilla-rythu-bazar" }
    ]
  },
  "rangareddy": {
    area: "Shamshabad, Hyderabad",
    display: "📍 Shamshabad — Shamshabad Rythu Bazar",
    name: "Shamshabad Rythu Bazar",
    location: "797V+X7H, National Highway 7, Shamshabad, Hyderabad, Telangana 501218",
    landmark: "National Highway 7, Shamshabad",
    slug: "shamshabad-rythu-bazar",
    markets: [
      { name: "Shamshabad Rythu Bazar", location: "797V+X7H, National Highway 7, Shamshabad, Hyderabad, Telangana 501218", landmark: "National Highway 7, Shamshabad", slug: "shamshabad-rythu-bazar" },
      { name: "Chevella Rythu Bazar", location: "846Q+7X6, Chevella, Telangana 501503", landmark: "Chevella", slug: "chevella-rythu-bazar" },
      { name: "Vanasthalipuram Rythu Bazar", location: "Vanasthalipuram, Hyderabad – 500070, Rangareddy", landmark: "Vanasthalipuram Main Road", slug: "vanasthalipuram-rythu-bazar" }
    ]
  },
  "sangareddy": {
    area: "Habeeb Nagar, Sangareddy",
    display: "📍 Habeeb Nagar — Sangareddy Rythu Bazar",
    name: "Sangareddy Rythu Bazar",
    location: "J39H+2X, Habeeb Nagar, Sangareddy, Telangana 502001",
    landmark: "Habeeb Nagar, Sangareddy",
    slug: "sangareddy-rythu-bazar",
    markets: [
      { name: "Sadashivpet Rythu Bazar", location: "JX96+73, Sadashivpet, Telangana 502291", landmark: "Sadashivpet", slug: "sadashivpet-rythu-bazar" },
      { name: "Sangareddy Rythu Bazar", location: "J39H+2X, Habeeb Nagar, Sangareddy, Telangana 502001", landmark: "Habeeb Nagar, Sangareddy", slug: "sangareddy-rythu-bazar" },
      { name: "Sangareddy Vegetable Market", location: "J3CH+87X, Rajampet Road, Habeeb Nagar, Sangareddy, Telangana 502001", landmark: "Rajampet Road, Habeeb Nagar", slug: "sangareddy-vegetable-market" }
    ]
  },
  "siddipet": {
    area: "Parupalliveedhi, Siddipet",
    display: "📍 Parupalliveedhi — Siddipet Rythu Bazar",
    name: "Siddipet Rythu Bazar",
    location: "4V45+4H3, Parupalliveedhi, Siddipet, Telangana 502103",
    landmark: "Parupalliveedhi, Siddipet",
    slug: "siddipet-rythu-bazar",
    markets: [
      { name: "Siddipet Rythu Bazar", location: "4V45+4H3, Parupalliveedhi, Siddipet, Telangana 502103", landmark: "Parupalliveedhi, Siddipet", slug: "siddipet-rythu-bazar" },
      { name: "Siddipet Vegetable Market", location: "4V6H+QW, Siddipet, Telangana 502267", landmark: "Siddipet", slug: "siddipet-vegetable-market" }
    ]
  },
  "suryapet": {
    area: "Barlapenta Bazaar, Suryapet",
    display: "📍 Barlapenta Bazaar — Suryapet Rythu Bazar",
    name: "Suryapet Rythu Bazar",
    location: "4JR9+CFR, Barlapenta Bazaar, Suryapet, Telangana 508213",
    landmark: "Barlapenta Bazaar, Suryapet",
    slug: "suryapet-rythu-bazar",
    markets: [
      { name: "Suryapet Rythu Bazar", location: "4JR9+CFR, Barlapenta Bazaar, Suryapet, Telangana 508213", landmark: "Barlapenta Bazaar, Suryapet", slug: "suryapet-rythu-bazar" },
      { name: "Suryapet Vegetable Market", location: "4JPR+JHX, Vijayawada Highway, Ambedkar Nagar, Suryapet, Telangana 508213", landmark: "Vijayawada Highway, Ambedkar Nagar", slug: "suryapet-vegetable-market" }
    ]
  },
  "vikarabad": {
    area: "Nehrugunj, Tandur",
    display: "📍 Nehrugunj — Tandur Rythu Bazar",
    name: "Tandur Rythu Bazar",
    location: "7H5P+2XP, Nehrugunj, Tandur, Rangareddy, Telangana 501141",
    landmark: "Nehrugunj, Tandur",
    slug: "tandur-rythu-bazar",
    markets: [
      { name: "Tandur Rythu Bazar", location: "7H5P+2XP, Nehrugunj, Tandur, Rangareddy, Telangana 501141", landmark: "Nehrugunj, Tandur", slug: "tandur-rythu-bazar" },
      { name: "Tandur Vegetable Market", location: "74 6.7, Dargah Road, Brindavan Colony, Tandur, Telangana 501141", landmark: "Dargah Road, Brindavan Colony, Tandur", slug: "tandur-vegetable-market" },
      { name: "Vikarabad Rythu Bazar", location: "8WR4+7HJ, New Gunj, Vikarabad, Telangana 501101", landmark: "New Gunj, Vikarabad", slug: "vikarabad-rythu-bazar" }
    ]
  },
  "wanaparthy": {
    area: "Wanaparthy town",
    display: "📍 Wanaparthy Town — Rythu Bazar",
    name: "Rythu Bazar, Wanaparthy town",
    location: "Wanaparthy town, Wanaparthy District",
    landmark: "Wanaparthy town",
    slug: "rythu-bazar-wanaparthy-town",
    markets: [
      { name: "Rythu Bazar, Wanaparthy town", location: "Wanaparthy town, Wanaparthy District", landmark: "Wanaparthy town", slug: "rythu-bazar-wanaparthy-town" }
    ]
  },
  "warangal": {
    area: "Ramannapet, Warangal",
    display: "📍 Ramannapet — Ramannapet Rythu Bazar",
    name: "Ramannapet Rythu Bazar",
    location: "XHHV+5Q3, Ramannapet, Warangal, Telangana 506002",
    landmark: "Ramannapet, Warangal",
    slug: "ramannapet-rythu-bazar",
    markets: [
      { name: "Ramannapet Rythu Bazar", location: "XHHV+5Q3, Ramannapet, Warangal, Telangana 506002", landmark: "Ramannapet, Warangal", slug: "ramannapet-rythu-bazar" },
      { name: "Girmajipet Vegetable Market", location: "XJH4+367, Girmajipet, Warangal, Telangana 506002", landmark: "Girmajipet, Warangal", slug: "girmajipet-vegetable-market" }
    ]
  },
  "yadadri-bhuvanagiri": {
    area: "Chityala, Yadadri",
    display: "📍 Chityala — Chityala Rythu Bazar",
    name: "Chityala Rythu Bazar",
    location: "C33M+GCG, Chityala, Telangana 509206",
    landmark: "Chityala",
    slug: "chityala-rythu-bazar",
    markets: [
      { name: "Chityala Rythu Bazar", location: "C33M+GCG, Chityala, Telangana 509206", landmark: "Chityala", slug: "chityala-rythu-bazar" },
      { name: "Bhuvanagiri Rythu Bazar", location: "GV8P+746, Main Road, Medikuntapally, Bhuvanagiri, Telangana 508116", landmark: "Main Road, Medikuntapally, Bhuvanagiri", slug: "bhuvanagiri-rythu-bazar" }
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

function updateActiveBanner() {
  const dSlug = selDistrict.value;
  const selectedSlug = selMarket.value;
  const selectedText = selMarket.options[selMarket.selectedIndex]?.text?.replace(/^[📍🏢]\s*/, '') || '';
  const meta = DISTRICT_RYTHU_BAZARS[dSlug];
  const matchedMarket = meta?.markets?.find(m => m.slug === selectedSlug || m.name === selectedText);

  const titleEl = document.getElementById('bazar-banner-title');
  const addrEl  = document.getElementById('bazar-banner-address');

  if (titleEl) {
    if (matchedMarket) {
      titleEl.textContent = matchedMarket.name;
    } else if (meta) {
      titleEl.textContent = `${meta.name} (${meta.area})`;
    } else {
      titleEl.textContent = selectedText || 'Rythu Bazar';
    }
  }
  if (addrEl) {
    if (matchedMarket && matchedMarket.location) {
      addrEl.textContent = `📍 ${matchedMarket.location}`;
    } else if (meta && meta.location) {
      addrEl.textContent = `📍 ${meta.location}`;
    } else {
      const dName = selDistrict.options[selDistrict.selectedIndex]?.text || dSlug;
      addrEl.textContent = `📍 ${selectedText}, ${dName} District, Telangana`;
    }
  }
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

  // Instantly populate from local markets array (zero loading delay)
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
      let optionsHtml = '';
      markets.forEach((m, idx) => {
        const isRythu = m.name.toLowerCase().includes('rythu') || m.name.toLowerCase().includes('vegetable') || m.name.toLowerCase().includes('grain') || m.name.toLowerCase().includes('fruit');
        const emoji = isRythu ? '📍' : '🏢';
        optionsHtml += `<option value="${m.slug}" ${idx === 0 ? 'selected' : ''}>${emoji} ${m.name}</option>`;
      });
      selMarket.innerHTML = optionsHtml;
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
