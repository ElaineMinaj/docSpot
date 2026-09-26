// Real Atlanta-area clinicians from the NPI Registry (cleaned by Elaine).
// The app keeps entries with a fax number and a specialty it uses.
const REAL_PHYSICIANS = [
 {
  "provider_full_name": "TERESA ADES",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "250 WILLIAMS ST NW, 6TH FLOOR, ATLANTA, GA 303031032",
  "primary_practice_phone": "404-329-7785",
  "primary_practice_fax": "404-327-6404",
  "npi_number": "1467754788"
 },
 {
  "provider_full_name": "JENNIFER AKINS",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "260 PEACHTREE ST NW STE 2200, ATLANTA, GA 303031292",
  "primary_practice_phone": "855-832-6727",
  "primary_practice_fax": "772-675-9100",
  "npi_number": "1487278743"
 },
 {
  "provider_full_name": "SABRINA ALEXANDER",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "260 PEACHTREE ST NW STE 2200, ATLANTA, GA 303031292",
  "primary_practice_phone": "877-418-2978",
  "primary_practice_fax": "866-500-2186",
  "npi_number": "1164005138"
 },
 {
  "provider_full_name": "ABIMBULA AKOMOLAFE",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "75 PIEDMONT AVE, STE 700, ATLANTA, GA 303032544",
  "primary_practice_phone": "404-756-5271",
  "primary_practice_fax": "404-756-1402",
  "npi_number": "1134129026"
 },
 {
  "provider_full_name": "EVELYN ADESANYA",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "80 JESSE HILL JR DR SE, ATLANTA, GA 303033031",
  "primary_practice_phone": "404-616-8261",
  "primary_practice_fax": "404-616-8202",
  "npi_number": "1821513607"
 },
 {
  "provider_full_name": "BHAVIN ADHYARU",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "69 JESSE HILL JR DR SE, ATLANTA, GA 303033033",
  "primary_practice_phone": "404-616-7028",
  "primary_practice_fax": "404-525-2957",
  "npi_number": "1366600926"
 },
 {
  "provider_full_name": "IBTIHAL ALATTAS",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "49 JESSE HILL JR DR SE, ATLANTA, GA 303033049",
  "primary_practice_phone": "404-251-8865",
  "primary_practice_fax": "404-688-6355",
  "npi_number": "1730476441"
 },
 {
  "provider_full_name": "BRITTANY ALBRITTON",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "3169 MAPLE DRIVE NE, ATLANTA, GA 30305",
  "primary_practice_phone": "610-506-8447",
  "primary_practice_fax": "404-264-6327",
  "npi_number": "1164879532"
 },
 {
  "provider_full_name": "AHMED ALI",
  "primary_taxonomy_description": "",
  "full_practice_address": "3495 PIEDMONT ROAD, NE, NINE PIEDMONT CENTER, ATLANTA, GA 30305",
  "primary_practice_phone": "404-364-7070",
  "primary_practice_fax": "770-916-4434",
  "npi_number": "1396808010"
 },
 {
  "provider_full_name": "UCHENNA AGUWA",
  "primary_taxonomy_description": "Emergency Medicine",
  "full_practice_address": "3495 PIEDMONT ROAD, NE, NINE PIEDMONT CENTER, ATLANTA, GA 30305",
  "primary_practice_phone": "404-364-7070",
  "primary_practice_fax": "740-374-5887",
  "npi_number": "1164625950"
 },
 {
  "provider_full_name": "JACOB ABRAHAM",
  "primary_taxonomy_description": "Radiology, Diagnostic Radiology",
  "full_practice_address": "3520 PIEDMONT RD NE, SUITE 250, ATLANTA, GA 303051516",
  "primary_practice_phone": "404-870-2802",
  "primary_practice_fax": "404-419-6623",
  "npi_number": "1144271800"
 },
 {
  "provider_full_name": "NNENNA AKARONU",
  "primary_taxonomy_description": "Psychiatry & Neurology, Psychiatry",
  "full_practice_address": "550 PHARR RD NE, ATLANTA, GA 303053428",
  "primary_practice_phone": "404-235-5982",
  "primary_practice_fax": "678-705-2756",
  "npi_number": "1518455666"
 },
 {
  "provider_full_name": "ANA ADELSTEIN",
  "primary_taxonomy_description": "Psychologist, Clinical",
  "full_practice_address": "675 SEMINOLE AVENUE, SUITE 307, ATLANTA, GA 303073416",
  "primary_practice_phone": "678-701-9559",
  "primary_practice_fax": "877-455-0324",
  "npi_number": "1881778967"
 },
 {
  "provider_full_name": "EDWARD AIKENS",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "341 PONCE DE LEON AVE NE, ATLANTA, GA 303082012",
  "primary_practice_phone": "404-616-9782",
  "primary_practice_fax": "404-616-9732",
  "npi_number": "1780780593"
 },
 {
  "provider_full_name": "BRUCE ALDRED",
  "primary_taxonomy_description": "Internal Medicine, Infectious Disease",
  "full_practice_address": "341 PONCE DE LEON AVE NE, ATLANTA, GA 303082012",
  "primary_practice_phone": "404-616-2440",
  "primary_practice_fax": "404-616-9732",
  "npi_number": "1194187484"
 },
 {
  "provider_full_name": "MARYLYN ADAMSKI",
  "primary_taxonomy_description": "Physician Assistant, Medical",
  "full_practice_address": "341 PONCE DE LEON AVE NE, ATLANTA, GA 303082012",
  "primary_practice_phone": "404-616-9748",
  "primary_practice_fax": "404-616-9700",
  "npi_number": "1366570269"
 },
 {
  "provider_full_name": "ABIMBOLA ABIODUN",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "550 PEACHTREE ST NE, ATLANTA, GA 303082212",
  "primary_practice_phone": "404-995-1560",
  "primary_practice_fax": "404-995-1563",
  "npi_number": "1487749867"
 },
 {
  "provider_full_name": "VALERY AKOPOV",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "550 PEACHTREE ST NE, HOSPITAL MEDICINE DEPARTMENT, ATLANTA, GA 303082247",
  "primary_practice_phone": "404-686-7869",
  "primary_practice_fax": "404-778-5495",
  "npi_number": "1417975871"
 },
 {
  "provider_full_name": "ABISOLA AJAYI",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "36 LINDEN AVE NE, ATLANTA, GA 303082951",
  "primary_practice_phone": "404-686-2391",
  "primary_practice_fax": "404-686-4835",
  "npi_number": "1033580568"
 },
 {
  "provider_full_name": "SYMPHONY ADAMS",
  "primary_taxonomy_description": "Counselor, Mental Health",
  "full_practice_address": "2221 PEACHTREE RD NE STE D601, ATLANTA, GA 303091148",
  "primary_practice_phone": "404-946-8542",
  "primary_practice_fax": "888-809-1916",
  "npi_number": "1972763423"
 },
 {
  "provider_full_name": "SUSAN ADAMS",
  "primary_taxonomy_description": "Anesthesiologist Assistant",
  "full_practice_address": "1968 PEACHTREE ROAD NW, ATLANTA, GA 303091281",
  "primary_practice_phone": "404-351-1754",
  "primary_practice_fax": "404-351-7121",
  "npi_number": "1417975632"
 },
 {
  "provider_full_name": "ALENE ALBRITTON",
  "primary_taxonomy_description": "Dietitian, Registered",
  "full_practice_address": "2140 PEACHTREE RD NW STE 232, ATLANTA, GA 303091316",
  "primary_practice_phone": "404-231-4431",
  "primary_practice_fax": "404-231-5677",
  "npi_number": "1669556403"
 },
 {
  "provider_full_name": "NAUREEN ADAM",
  "primary_taxonomy_description": "Pain Medicine, Interventional Pain Medicine",
  "full_practice_address": "2061 PEACHTREE RD NE, STE 225, ATLANTA, GA 303091427",
  "primary_practice_phone": "404-554-0633",
  "primary_practice_fax": "770-929-9092",
  "npi_number": "1518174457"
 },
 {
  "provider_full_name": "RANDALL ALEXANDER",
  "primary_taxonomy_description": "Orthopaedic Surgery, Hand Surgery",
  "full_practice_address": "2061 PEACHTREE RD NE STE 500, ATLANTA, GA 303091446",
  "primary_practice_phone": "404-352-3522",
  "primary_practice_fax": "404-352-9251",
  "npi_number": "1780600262"
 },
 {
  "provider_full_name": "HODAN AHMED",
  "primary_taxonomy_description": "Hospitalist",
  "full_practice_address": "35 COLLIER RD NW, SUITE 635, ATLANTA, GA 303091613",
  "primary_practice_phone": "404-367-3014",
  "primary_practice_fax": "404-367-3558",
  "npi_number": "1407112618"
 },
 {
  "provider_full_name": "MOHAMMED ABDU",
  "primary_taxonomy_description": "Hospitalist",
  "full_practice_address": "35 COLLIER RD NW, SUITE 635, ATLANTA, GA 303091613",
  "primary_practice_phone": "404-367-3014",
  "primary_practice_fax": "404-367-3558",
  "npi_number": "1760696520"
 },
 {
  "provider_full_name": "ZUHAIR AHMED",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "35 COLLIER RD NW, SUITE 635, ATLANTA, GA 303091613",
  "primary_practice_phone": "404-367-3014",
  "primary_practice_fax": "404-367-3558",
  "npi_number": "1881913309"
 },
 {
  "provider_full_name": "COURTNEY ADANK",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "275 COLLIER RD NW STE 100B, ATLANTA, GA 303091700",
  "primary_practice_phone": "404-352-3656",
  "primary_practice_fax": "404-350-5820",
  "npi_number": "1083932370"
 },
 {
  "provider_full_name": "KRISTAN ADAMS",
  "primary_taxonomy_description": "Obstetrics & Gynecology",
  "full_practice_address": "275 COLLIER RD NW, SUITE 100-B, ATLANTA, GA 303091709",
  "primary_practice_phone": "404-350-5815",
  "primary_practice_fax": "404-350-5820",
  "npi_number": "1730188541"
 },
 {
  "provider_full_name": "OLUWASEMILORE ABORISADE",
  "primary_taxonomy_description": "Pharmacist",
  "full_practice_address": "35 COLLIER RD NW STE 100, ATLANTA, GA 303091780",
  "primary_practice_phone": "404-350-9772",
  "primary_practice_fax": "404-350-9865",
  "npi_number": "1922917830"
 },
 {
  "provider_full_name": "STEPHANIE AARON",
  "primary_taxonomy_description": "Nurse Practitioner, Adult Health",
  "full_practice_address": "95 COLLIER RD NW, SUITE 5015, ATLANTA, GA 303091796",
  "primary_practice_phone": "404-605-2800",
  "primary_practice_fax": "404-351-5983",
  "npi_number": "1740371848"
 },
 {
  "provider_full_name": "DANIEL ACKER",
  "primary_taxonomy_description": "Occupational Therapist, Hand",
  "full_practice_address": "1819 PEACHTREE RD NE, SUITE 425, ATLANTA, GA 303091848",
  "primary_practice_phone": "404-352-3522",
  "primary_practice_fax": "404-601-1235",
  "npi_number": "1447277017"
 },
 {
  "provider_full_name": "CHAD ACHILLES",
  "primary_taxonomy_description": "Pain Medicine, Interventional Pain Medicine",
  "full_practice_address": "1800 PEACHTREE ST NW STE 750, ATLANTA, GA 303092530",
  "primary_practice_phone": "404-351-7654",
  "primary_practice_fax": "404-609-7605",
  "npi_number": "1558310110"
 },
 {
  "provider_full_name": "OMOTAYO ABDUL",
  "primary_taxonomy_description": "Nurse Practitioner, Psych/Mental Health",
  "full_practice_address": "1401 PEACHTREE ST NE STE 110, ATLANTA, GA 303093005",
  "primary_practice_phone": "470-749-3520",
  "primary_practice_fax": "470-378-1997",
  "npi_number": "1417623984"
 },
 {
  "provider_full_name": "GENE ABEL",
  "primary_taxonomy_description": "Specialist",
  "full_practice_address": "1401 PEACHTREE ST NE, SUITE 140, ATLANTA, GA 303093023",
  "primary_practice_phone": "404-872-7929",
  "primary_practice_fax": "404-872-2588",
  "npi_number": "1427178169"
 },
 {
  "provider_full_name": "ANGELA ADELEKE",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "1110 W PEACHTREE ST NW STE 1100, ATLANTA, GA 303093609",
  "primary_practice_phone": "404-892-2131",
  "primary_practice_fax": "404-215-9222",
  "npi_number": "1790383776"
 },
 {
  "provider_full_name": "CHRISTOPHER ALBERTS",
  "primary_taxonomy_description": "Chiropractor",
  "full_practice_address": "1014 PIEDMONT AVE NE, ATLANTA, GA 303093702",
  "primary_practice_phone": "404-876-0550",
  "primary_practice_fax": "404-585-4879",
  "npi_number": "1215103361"
 },
 {
  "provider_full_name": "ABISOLA AJAYI",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "720 WESTVIEW DR, SW, ATLANTA, ATLANTA, GA 30310",
  "primary_practice_phone": "404-756-1383",
  "primary_practice_fax": "404-756-1313",
  "npi_number": "1346097896"
 },
 {
  "provider_full_name": "BRIGHT ADIRI",
  "primary_taxonomy_description": "Case Manager/Care Coordinator",
  "full_practice_address": "2001 MARTIN LUTHER KING JR DR SW, SUITE 409, ATLANTA, GA 303101101",
  "primary_practice_phone": "404-564-6486",
  "primary_practice_fax": "404-564-6487",
  "npi_number": "1346644507"
 },
 {
  "provider_full_name": "NANCY ADIRI",
  "primary_taxonomy_description": "Registered Nurse",
  "full_practice_address": "2001 MARTIN LUTHER KING JR DR SW, SUITE 409, ATLANTA, GA 303101101",
  "primary_practice_phone": "404-564-6486",
  "primary_practice_fax": "404-564-6487",
  "npi_number": "1871967208"
 },
 {
  "provider_full_name": "AUTUMN ACKLIN",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "720 WESTVIEW DR SW, ATLANTA, GA 303101458",
  "primary_practice_phone": "404-616-1692",
  "primary_practice_fax": "404-616-4131",
  "npi_number": "1356045256"
 },
 {
  "provider_full_name": "UFUOMA AGBEDIA-EJUGHEMRE",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "720 WESTVIEW DR SW, ATLANTA, GA 303101458",
  "primary_practice_phone": "404-756-1383",
  "primary_practice_fax": "404-756-1313",
  "npi_number": "1811624182"
 },
 {
  "provider_full_name": "OLUWADAMINI ADELAJA-STEVENS",
  "primary_taxonomy_description": "Speech-Language Pathologist,  ",
  "full_practice_address": "1827 S GORDON ST SW, ATLANTA, GA 303102361",
  "primary_practice_phone": "404-500-8264",
  "primary_practice_fax": "470-408-2473",
  "npi_number": "1104777846"
 },
 {
  "provider_full_name": "REBECCA ADAMS",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "868 YORK AVE SW, ATLANTA, GA 303102750",
  "primary_practice_phone": "404-756-6883",
  "primary_practice_fax": "404-755-7400",
  "npi_number": "1700403599"
 },
 {
  "provider_full_name": "CYNTHIA ABAM",
  "primary_taxonomy_description": "Obstetrics & Gynecology",
  "full_practice_address": "868 YORK AVE SW, ATLANTA, GA 303102750",
  "primary_practice_phone": "404-756-6883",
  "primary_practice_fax": "404-755-7400",
  "npi_number": "1629606884"
 },
 {
  "provider_full_name": "EDITH ABAKARE",
  "primary_taxonomy_description": "Specialist, Prosthetics Case Management",
  "full_practice_address": "2558 MARTIN LUTHER KING JR DR SW, ATLANTA, GA 303111779",
  "primary_practice_phone": "404-505-0300",
  "primary_practice_fax": "404-792-7209",
  "npi_number": "1629496096"
 },
 {
  "provider_full_name": "SHUMET ADNEW",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "303 PARKWAY DR NE, ATLANTA, GA 303121212",
  "primary_practice_phone": "404-265-4919",
  "primary_practice_fax": "404-265-4989",
  "npi_number": "1659805059"
 },
 {
  "provider_full_name": "BAMIDELE ADEYEMO",
  "primary_taxonomy_description": "Physical Medicine & Rehabilitation",
  "full_practice_address": "303 PARKWAY DR NE, ATLANTA, GA 303121212",
  "primary_practice_phone": "404-265-4958",
  "primary_practice_fax": "404-265-4954",
  "npi_number": "1427210194"
 },
 {
  "provider_full_name": "ZAHID AFRIDI",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "424 DECATUR ST SE, ATLANTA, GA 303121848",
  "primary_practice_phone": "678-843-8500",
  "primary_practice_fax": "678-843-8501",
  "npi_number": "1649347683"
 },
 {
  "provider_full_name": "VANESSA ABRAMS",
  "primary_taxonomy_description": "Specialist/Technologist, Athletic Trainer",
  "full_practice_address": "350 SPELMAN LN SW, BOX 1057, ATLANTA, GA 303144395",
  "primary_practice_phone": "404-392-4916",
  "primary_practice_fax": "404-270-5714",
  "npi_number": "1083999718"
 },
 {
  "provider_full_name": "WILLIE ADAMS",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "1046 RIDGE AVE SW, ATLANTA, GA 303151640",
  "primary_practice_phone": "404-688-1350",
  "primary_practice_fax": "404-688-2962",
  "npi_number": "1194971242"
 },
 {
  "provider_full_name": "MARY ACKLIN",
  "primary_taxonomy_description": "Nurse Practitioner, Pediatrics",
  "full_practice_address": "30 WARREN ST SE, DEKALB GRADY CLINIC, ATLANTA, GA 303172267",
  "primary_practice_phone": "404-616-9304",
  "primary_practice_fax": "404-377-9324",
  "npi_number": "1629082524"
 },
 {
  "provider_full_name": "ZIA ABDI",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "2386 BOLTON RD, ATLANTA, GA 30318",
  "primary_practice_phone": "404-352-2810",
  "primary_practice_fax": "404-352-4457",
  "npi_number": "1881701936"
 },
 {
  "provider_full_name": "CHRISTOPHER ALEXANDER",
  "primary_taxonomy_description": "Physical Medicine & Rehabilitation",
  "full_practice_address": "1800 HOWELL MILL RD NW STE 200, ATLANTA, GA 303180917",
  "primary_practice_phone": "404-352-1015",
  "primary_practice_fax": "404-477-1176",
  "npi_number": "1700264140"
 },
 {
  "provider_full_name": "ASHLEY ADER",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "1800 HOWELL MILL RD NW STE 800, ATLANTA, GA 303180922",
  "primary_practice_phone": "678-298-3239",
  "primary_practice_fax": "404-477-1162",
  "npi_number": "1821666264"
 },
 {
  "provider_full_name": "LISA ALEXANDER",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "898 DEAN DR NW, ATLANTA, GA 303181616",
  "primary_practice_phone": "404-808-1328",
  "primary_practice_fax": "404-846-0886",
  "npi_number": "1457787574"
 },
 {
  "provider_full_name": "MONICA ALEXANDER-LEWIS",
  "primary_taxonomy_description": "Specialist",
  "full_practice_address": "1445 WOODMONT LN NW # 1962, ATLANTA, GA 303182866",
  "primary_practice_phone": "916-340-2240",
  "primary_practice_fax": "916-249-1430",
  "npi_number": "1912712993"
 },
 {
  "provider_full_name": "MAUNDA ALEXANDER",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "1700 COMMERCE DR NW STE 100, ATLANTA, GA 303183124",
  "primary_practice_phone": "718-215-5311",
  "primary_practice_fax": "718-865-5165",
  "npi_number": "1336857325"
 },
 {
  "provider_full_name": "TAHA AHMED",
  "primary_taxonomy_description": "Internal Medicine, Cardiovascular Disease",
  "full_practice_address": "101 WOODRUFF CIRCLE, WMB 1105, ATLANTA, GA 303185612",
  "primary_practice_phone": "404-712-1504",
  "primary_practice_fax": "404-544-1569",
  "npi_number": "1790206845"
 },
 {
  "provider_full_name": "TIFFANY AIKEN",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "555 10TH ST NW, ATLANTA, GA 303185713",
  "primary_practice_phone": "404-477-8888",
  "primary_practice_fax": "404-477-8889",
  "npi_number": "1538442405"
 },
 {
  "provider_full_name": "ANDREW ADAMS",
  "primary_taxonomy_description": "Transplant Surgery",
  "full_practice_address": "EMORY UNIVERSITY SCHOOL OF MEDICINE, 101 WOODRUFF CIRCLE, 5105 WMRB, ATLANTA, GA 303220001",
  "primary_practice_phone": "404-712-1820",
  "primary_practice_fax": "404-727-3660",
  "npi_number": "1902932684"
 },
 {
  "provider_full_name": "JEREMY ACKERMAN",
  "primary_taxonomy_description": "Emergency Medicine",
  "full_practice_address": "531 ASBURY CIR STE N340, ATLANTA, GA 303221006",
  "primary_practice_phone": "404-778-5975",
  "primary_practice_fax": "404-778-2630",
  "npi_number": "1942406483"
 },
 {
  "provider_full_name": "TED AKHIWU",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "1365 CLIFTON RD NE, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-712-1722",
  "primary_practice_fax": "404-251-1899",
  "npi_number": "1770226367"
 },
 {
  "provider_full_name": "SHELLY ABRAMOWICZ",
  "primary_taxonomy_description": "Dentist, Oral and Maxillofacial Surgery",
  "full_practice_address": "1365 CLIFTON RD NE, ORAL AND MAXILLOFACIAL SURGERY BLDG B, SUITE 2300, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-778-4500",
  "primary_practice_fax": "404-778-5879",
  "npi_number": "1619130259"
 },
 {
  "provider_full_name": "MARIA AARON",
  "primary_taxonomy_description": "Ophthalmology",
  "full_practice_address": "1365 CLIFTON RD NE # B, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-778-2020",
  "primary_practice_fax": "404-778-2244",
  "npi_number": "1588775548"
 },
 {
  "provider_full_name": "THOMAS AABERG",
  "primary_taxonomy_description": "Ophthalmology",
  "full_practice_address": "1365 CLIFTON RD NE # B, ROOM 4405, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-778-4456",
  "primary_practice_fax": "404-778-5128",
  "npi_number": "1750491783"
 },
 {
  "provider_full_name": "MAHMOUD ABDOU",
  "primary_taxonomy_description": "Internal Medicine, Advanced Heart Failure and Transplant Cardiology",
  "full_practice_address": "1365 CLIFTON RD NE BLDG A2ND, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-778-5299",
  "primary_practice_fax": "404-778-4557",
  "npi_number": "1518283282"
 },
 {
  "provider_full_name": "RANA AL-JABERI",
  "primary_taxonomy_description": "Medical Genetics, Medical Biochemical Genetics",
  "full_practice_address": "1365 CLIFTON RD NE BLDG B, ATLANTA, GA 303221013",
  "primary_practice_phone": "404-778-8570",
  "primary_practice_fax": "404-778-8562",
  "npi_number": "1780174078"
 },
 {
  "provider_full_name": "HENDRICK ADAMS",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "100 WOODRUFF CIR NE STE P375, ATLANTA, GA 303221020",
  "primary_practice_phone": "404-727-5655",
  "primary_practice_fax": "404-727-0045",
  "npi_number": "1336627025"
 },
 {
  "provider_full_name": "WASSIM ABDALLAH",
  "primary_taxonomy_description": "Internal Medicine, Infectious Disease",
  "full_practice_address": "1364 CLIFTON RD NE, ATLANTA, GA 303221059",
  "primary_practice_phone": "404-712-2000",
  "primary_practice_fax": "404-880-9305",
  "npi_number": "1780178889"
 },
 {
  "provider_full_name": "MATTHEW AGAM",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "1365B CLIFTON RD NE RM B6169C, ATLANTA, GA 303221059",
  "primary_practice_phone": "404-778-2190",
  "primary_practice_fax": "404-778-4472",
  "npi_number": "1720540990"
 },
 {
  "provider_full_name": "BOLANLE AKINSOLA",
  "primary_taxonomy_description": "Emergency Medicine, Pediatric Emergency Medicine",
  "full_practice_address": "1405 CLIFTON RD NE, ATLANTA, GA 303221060",
  "primary_practice_phone": "404-785-7141",
  "primary_practice_fax": "404-785-7989",
  "npi_number": "1447415096"
 },
 {
  "provider_full_name": "ADINA ALAZRAKI",
  "primary_taxonomy_description": "Pediatrics",
  "full_practice_address": "1405 CLIFTON RD NE, ATLANTA, GA 303221060",
  "primary_practice_phone": "404-785-6541",
  "primary_practice_fax": "404-785-1248",
  "npi_number": "1992762975"
 },
 {
  "provider_full_name": "IJEOMA AKAELU",
  "primary_taxonomy_description": "Pediatrics",
  "full_practice_address": "1405 CLIFTON RD NE, ATLANTA, GA 303221060",
  "primary_practice_phone": "404-785-7141",
  "primary_practice_fax": "404-785-7989",
  "npi_number": "1518267251"
 },
 {
  "provider_full_name": "MANEESHA AGARWAL",
  "primary_taxonomy_description": "Pediatrics",
  "full_practice_address": "1405 CLIFTON RD NE, ATLANTA, GA 303221060",
  "primary_practice_phone": "404-785-7141",
  "primary_practice_fax": "404-785-7989",
  "npi_number": "1083872444"
 },
 {
  "provider_full_name": "ADEJIMI ADENIJI",
  "primary_taxonomy_description": "Specialist",
  "full_practice_address": "1405 CLIFTON RD NE, ATLANTA, GA 303221060",
  "primary_practice_phone": "404-785-6532",
  "primary_practice_fax": "404-785-1216",
  "npi_number": "1750349676"
 },
 {
  "provider_full_name": "EVA ALANIS",
  "primary_taxonomy_description": "Licensed Practical Nurse",
  "full_practice_address": "1525 CLIFTON RD NE, ATLANTA, GA 303224200",
  "primary_practice_phone": "404-727-7551",
  "primary_practice_fax": "404-727-5349",
  "npi_number": "1235642190"
 },
 {
  "provider_full_name": "MARTA ADAMOVIC",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "570 BISMARK RD NE, ATLANTA, GA 303244271",
  "primary_practice_phone": "404-547-5823",
  "primary_practice_fax": "470-745-0654",
  "npi_number": "1376897561"
 },
 {
  "provider_full_name": "FRANKLIN ABBOTT",
  "primary_taxonomy_description": "Social Worker, Clinical",
  "full_practice_address": "1904 MONROE DR NE, SUITE 120, ATLANTA, GA 303244858",
  "primary_practice_phone": "404-874-8294",
  "primary_practice_fax": "404-874-2020",
  "npi_number": "1588753537"
 },
 {
  "provider_full_name": "JOEL ADLER",
  "primary_taxonomy_description": "Dentist, Oral and Maxillofacial Pathology",
  "full_practice_address": "JOEL M. ADLER, DDS, 2677 RIDGE VALLEY RD NW, ATLANTA, GA 30327",
  "primary_practice_phone": "404-351-7159",
  "primary_practice_fax": "404-351-7248",
  "npi_number": "1245267749"
 },
 {
  "provider_full_name": "ROOHI ABUBAKER",
  "primary_taxonomy_description": "Psychiatry & Neurology, Psychiatry",
  "full_practice_address": "3597 REMBRANDT RD NW, ATLANTA, GA 303272657",
  "primary_practice_phone": "770-678-7034",
  "primary_practice_fax": "770-678-7035",
  "npi_number": "1306013974"
 },
 {
  "provider_full_name": "LEAH ALDRIDGE",
  "primary_taxonomy_description": "Lactation Consultant, Non-RN",
  "full_practice_address": "951 W CONWAY DR NW, ATLANTA, GA 303273637",
  "primary_practice_phone": "404-590-6455",
  "primary_practice_fax": "404-816-0800",
  "npi_number": "1912293101"
 },
 {
  "provider_full_name": "ANDREW AIKEN",
  "primary_taxonomy_description": "Dentist, Oral and Maxillofacial Surgery",
  "full_practice_address": "3280 HOWELL MILL RD NW, SUITE 240, ATLANTA, GA 303274111",
  "primary_practice_phone": "404-351-5335",
  "primary_practice_fax": "404-351-1339",
  "npi_number": "1144469164"
 },
 {
  "provider_full_name": "KATHERINE ALEXANDER",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "6160 PEACHTREE DUNWOODY RD NE, SUITE B90, ATLANTA, GA 30328",
  "primary_practice_phone": "770-673-0093",
  "primary_practice_fax": "770-673-8368",
  "npi_number": "1740478882"
 },
 {
  "provider_full_name": "ESHIKA ALAGALA",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "6645 PEACHTREE DUNWOODY RD, ATLANTA, GA 303281606",
  "primary_practice_phone": "770-455-7111",
  "primary_practice_fax": "770-455-7118",
  "npi_number": "1902682065"
 },
 {
  "provider_full_name": "NIMOTA ADEBOYE",
  "primary_taxonomy_description": "Nurse Practitioner, Women's Health",
  "full_practice_address": "20 GLENLAKE PKWY, ATLANTA, GA 303283473",
  "primary_practice_phone": "770-677-6075",
  "primary_practice_fax": "770-677-7331",
  "npi_number": "1235108176"
 },
 {
  "provider_full_name": "KENNETH ADEN",
  "primary_taxonomy_description": "Otolaryngology",
  "full_practice_address": "20 GLENLAKE PKWY, DEPARTMENT OF ENT OTOLARYNGOLOGY, ATLANTA, GA 303283473",
  "primary_practice_phone": "770-677-6137",
  "primary_practice_fax": "770-677-7332",
  "npi_number": "1447353818"
 },
 {
  "provider_full_name": "SHELLY AHMANN",
  "primary_taxonomy_description": "Surgery",
  "full_practice_address": "20 GLENLAKE PKWY, DEPARTMENT OF GENERAL SURGERY, ATLANTA, GA 303283473",
  "primary_practice_phone": "770-677-6227",
  "primary_practice_fax": "770-677-7340",
  "npi_number": "1104935048"
 },
 {
  "provider_full_name": "ROGER ABBOTT",
  "primary_taxonomy_description": "Dentist, General Practice",
  "full_practice_address": "290 HILDERBRAND DR NE, SUITE A-9, ATLANTA, GA 303283906",
  "primary_practice_phone": "404-255-2273",
  "primary_practice_fax": "404-467-4805",
  "npi_number": "1174530869"
 },
 {
  "provider_full_name": "MICHAEL ACKER",
  "primary_taxonomy_description": "Technician/Technologist, Optician",
  "full_practice_address": "6065 ROSWELL RD STE 424, ATLANTA, GA 303284014",
  "primary_practice_phone": "678-349-7553",
  "primary_practice_fax": "404-393-0860",
  "npi_number": "1306528641"
 },
 {
  "provider_full_name": "SARAH ADAMS-LONG",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "2100 RIVEREDGE PKWY, ATLANTA, GA 303284693",
  "primary_practice_phone": "404-640-1537",
  "primary_practice_fax": "844-637-5693",
  "npi_number": "1134573686"
 },
 {
  "provider_full_name": "RICHARD ABEL",
  "primary_taxonomy_description": "Pediatrics",
  "full_practice_address": "5901 PEACHTREE DUNWOODY RD NE, SUITE B-420, ATLANTA, GA 303285382",
  "primary_practice_phone": "404-252-9751",
  "primary_practice_fax": "678-990-5763",
  "npi_number": "1437157492"
 },
 {
  "provider_full_name": "CAROLINE ABRUZESE",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "6115 PEACHTREE DUNWOODY RD STE 200, ATLANTA, GA 303285684",
  "primary_practice_phone": "404-843-3636",
  "primary_practice_fax": "404-891-7164",
  "npi_number": "1255328720"
 },
 {
  "provider_full_name": "HAYDEN AARON",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "6115 PEACHTREE DUNWOODY RD STE 350, ATLANTA, GA 303285699",
  "primary_practice_phone": "678-320-3610",
  "primary_practice_fax": "678-320-3619",
  "npi_number": "1699139246"
 },
 {
  "provider_full_name": "ORRIN AHOLA",
  "primary_taxonomy_description": "Emergency Medicine",
  "full_practice_address": "5665 NEW NORTHSIDE DR NW, SUITE 320, ATLANTA, GA 303285831",
  "primary_practice_phone": "770-874-5400",
  "primary_practice_fax": "770-874-5469",
  "npi_number": "1831202357"
 },
 {
  "provider_full_name": "SUZANNE ALFORS",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "1400 TULLIE CIRCLE SE, ATLANTA, GA 30329",
  "primary_practice_phone": "404-785-1161",
  "primary_practice_fax": "404-553-9789",
  "npi_number": "1366774119"
 },
 {
  "provider_full_name": "BHUSHAN AGHARKAR",
  "primary_taxonomy_description": "Psychiatry & Neurology, Psychiatry",
  "full_practice_address": "57 EXECUTIVE PARK SOUTH NE, SUITE 360, ATLANTA, GA 303292288",
  "primary_practice_phone": "404-636-0054",
  "primary_practice_fax": "866-824-5215",
  "npi_number": "1619180304"
 },
 {
  "provider_full_name": "LAUREN ALBOR",
  "primary_taxonomy_description": "Psychiatry & Neurology, Neurology with Special Qualifications in Child Neurology",
  "full_practice_address": "1400 TULLIE RD NE FL 4, ATLANTA, GA 303292309",
  "primary_practice_phone": "404-785-5437",
  "primary_practice_fax": "404-785-4750",
  "npi_number": "1386175024"
 },
 {
  "provider_full_name": "NNEKA ALEXANDER",
  "primary_taxonomy_description": "Psychologist",
  "full_practice_address": "1400 TULLIE RD NE FL 4, ATLANTA, GA 303292309",
  "primary_practice_phone": "404-785-2849",
  "primary_practice_fax": "404-785-0978",
  "npi_number": "1508201484"
 },
 {
  "provider_full_name": "MEYANNA AL-AMIN",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "2250 N DRUID HILLS RD NE STE 280, ATLANTA, GA 303293141",
  "primary_practice_phone": "404-282-8846",
  "primary_practice_fax": "470-604-9792",
  "npi_number": "1770413072"
 },
 {
  "provider_full_name": "KERITH ADLER",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "1384 CHRISTMAS LN NE, ATLANTA, GA 303293549",
  "primary_practice_phone": "732-718-4761",
  "primary_practice_fax": "800-655-3780",
  "npi_number": "1649408022"
 },
 {
  "provider_full_name": "ANNA ACOSTA",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "1600 CLIFTON RD NE, MS C-25, ATLANTA, GA 303294018",
  "primary_practice_phone": "404-639-1951",
  "primary_practice_fax": "404-679-5072",
  "npi_number": "1063670446"
 },
 {
  "provider_full_name": "OLISA AJINAKU",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "920 DANNON VIEW SUITE 3202, ATLANTA, GA 30331",
  "primary_practice_phone": "404-346-3471",
  "primary_practice_fax": "404-346-3473",
  "npi_number": "1437392081"
 },
 {
  "provider_full_name": "LACEY ALFORD",
  "primary_taxonomy_description": "Counselor, School",
  "full_practice_address": "3595 REVERE RD SW, ATLANTA, GA 303312340",
  "primary_practice_phone": "404-344-5946",
  "primary_practice_fax": "404-344-9920",
  "npi_number": "1548361751"
 },
 {
  "provider_full_name": "DAWN ABDUS-SAMAD",
  "primary_taxonomy_description": "Chiropractor",
  "full_practice_address": "2740 GREENBRIAR PKWY SW STE A3, ATLANTA, GA 303312614",
  "primary_practice_phone": "404-629-9999",
  "primary_practice_fax": "404-629-9440",
  "npi_number": "1033417365"
 },
 {
  "provider_full_name": "JOSHUA AJIERO",
  "primary_taxonomy_description": "Physical Medicine & Rehabilitation",
  "full_practice_address": "3890 REDWINE RD SW STE 114, ATLANTA, GA 303315583",
  "primary_practice_phone": "404-344-7880",
  "primary_practice_fax": "404-344-7881",
  "npi_number": "1841090438"
 },
 {
  "provider_full_name": "ARMANDO ALAM-GONZALEZ",
  "primary_taxonomy_description": "Anesthesiology",
  "full_practice_address": "1870D INDEPENDENCE SQ STE D, ATLANTA, GA 303385150",
  "primary_practice_phone": "770-396-6190",
  "primary_practice_fax": "770-396-5541",
  "npi_number": "1982722864"
 },
 {
  "provider_full_name": "GEZ AGOLLI",
  "primary_taxonomy_description": "Naturopath",
  "full_practice_address": "4646 N SHALLOWFORD RD, ATLANTA, GA 303386308",
  "primary_practice_phone": "770-676-6000",
  "primary_practice_fax": "770-392-9805",
  "npi_number": "1497170492"
 },
 {
  "provider_full_name": "SUSANA ALFONSO",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "4500 N SHALLOWFORD RD, ATLANTA, GA 303386476",
  "primary_practice_phone": "404-778-6920",
  "primary_practice_fax": "404-778-6901",
  "npi_number": "1487759312"
 },
 {
  "provider_full_name": "OLUJIMI ADEFISAN",
  "primary_taxonomy_description": "Psychiatry & Neurology, Child & Adolescent Psychiatry",
  "full_practice_address": "2150 PEACHFORD RD STE A, ATLANTA, GA 303386521",
  "primary_practice_phone": "770-674-0553",
  "primary_practice_fax": "770-674-0554",
  "npi_number": "1790947216"
 },
 {
  "provider_full_name": "FREDERICK ABELES",
  "primary_taxonomy_description": "Dentist",
  "full_practice_address": "2300 WINDY RIDGE PRKWY, SUITE 220 SOUTH, ATLANTA, GA 30339",
  "primary_practice_phone": "770-952-1212",
  "primary_practice_fax": "770-953-8877",
  "npi_number": "1811150105"
 },
 {
  "provider_full_name": "ANGELA ABRAHAM",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "1995 N PARK PL SE STE 410, ATLANTA, GA 303392072",
  "primary_practice_phone": "770-850-0390",
  "primary_practice_fax": "770-818-9726",
  "npi_number": "1952120289"
 },
 {
  "provider_full_name": "NAILAH ABDULBAAQEE",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "950 BATTERY AVE SE STE 1216, ATLANTA, GA 303393094",
  "primary_practice_phone": "888-663-6331",
  "primary_practice_fax": "415-252-7176",
  "npi_number": "1396929873"
 },
 {
  "provider_full_name": "MOFOLASADE ADEYI",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "3333 RIVERWOOD PKWY SE STE 250, ATLANTA, GA 303393304",
  "primary_practice_phone": "770-914-0116",
  "primary_practice_fax": "770-955-4278",
  "npi_number": "1669730552"
 },
 {
  "provider_full_name": "YARED ALEMU",
  "primary_taxonomy_description": "Psychologist, Clinical",
  "full_practice_address": "2700 CUMBERLAND PKWY SE, SUITE 120, ATLANTA, GA 303393321",
  "primary_practice_phone": "770-319-7468",
  "primary_practice_fax": "866-416-1767",
  "npi_number": "1811003080"
 },
 {
  "provider_full_name": "JACK ABERNATHY",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "900 CIRCLE 75 PKWY SE, SUITE 1435, ATLANTA, GA 303393905",
  "primary_practice_phone": "404-895-0990",
  "primary_practice_fax": "770-485-5906",
  "npi_number": "1235566126"
 },
 {
  "provider_full_name": "VALERIE ABNEY-SMITH",
  "primary_taxonomy_description": "Counselor, Mental Health",
  "full_practice_address": "1827 POWERS FERRY RD SE, ATLANTA, GA 303395621",
  "primary_practice_phone": "770-953-4744",
  "primary_practice_fax": "770-953-4640",
  "npi_number": "1023138658"
 },
 {
  "provider_full_name": "SHAKIRA ABRAM",
  "primary_taxonomy_description": "Pharmacist, Pharmacist Clinician (PhC)/ Clinical Pharmacy Specialist",
  "full_practice_address": "2451 CUMBERLAND PKWY SE, ATLANTA, GA 303396136",
  "primary_practice_phone": "770-437-7007",
  "primary_practice_fax": "770-437-0766",
  "npi_number": "1336864016"
 },
 {
  "provider_full_name": "ROY ABRAHAMIAN",
  "primary_taxonomy_description": "Internal Medicine, Cardiovascular Disease",
  "full_practice_address": "2727 PACES FERRY RD SE STE 1-1100, ATLANTA, GA 303396151",
  "primary_practice_phone": "706-636-6501",
  "primary_practice_fax": "814-201-2389",
  "npi_number": "1083891196"
 },
 {
  "provider_full_name": "TERESA ADAMS",
  "primary_taxonomy_description": "Pharmacist, Pharmacist Clinician (PhC)/ Clinical Pharmacy Specialist",
  "full_practice_address": "2455 PACES FERRY AVE # C, ATLANTA, GA 303396444",
  "primary_practice_phone": "770-433-2722",
  "primary_practice_fax": "770-433-2723",
  "npi_number": "1801490669"
 },
 {
  "provider_full_name": "DANIELA AGUIAR SANTOS",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "3190 NORTHEAST EXPY NE STE 110, ATLANTA, GA 303415323",
  "primary_practice_phone": "404-487-6005",
  "primary_practice_fax": "678-831-3005",
  "npi_number": "1518786151"
 },
 {
  "provider_full_name": "ABSAR AHMED",
  "primary_taxonomy_description": "Radiology, Diagnostic Radiology",
  "full_practice_address": "1000 JOHNSON FERRY RD, ATLANTA, GA 30342",
  "primary_practice_phone": "404-851-6323",
  "primary_practice_fax": "404-303-3747",
  "npi_number": "1144435124"
 },
 {
  "provider_full_name": "OMORONKE ADEGBUJI",
  "primary_taxonomy_description": "Nurse Practitioner, Primary Care",
  "full_practice_address": "1000 JOHNSON FERRY ROAD, ATLANTA, GA 30342",
  "primary_practice_phone": "770-645-9181",
  "primary_practice_fax": "770-645-8455",
  "npi_number": "1649493537"
 },
 {
  "provider_full_name": "ANNA ADAMS",
  "primary_taxonomy_description": "Physician Assistant, Medical",
  "full_practice_address": "980 JOHNSON FERRY ROAD, STE 220, ATLANTA, GA 30342",
  "primary_practice_phone": "404-255-5956",
  "primary_practice_fax": "404-255-3908",
  "npi_number": "1407949209"
 },
 {
  "provider_full_name": "SUSAN ABBOTT",
  "primary_taxonomy_description": "Nurse Practitioner, Women's Health",
  "full_practice_address": "5780 PEACHTREE DUNWOODY RD NE, SUITE 200, ATLANTA, GA 303421554",
  "primary_practice_phone": "404-255-8022",
  "primary_practice_fax": "404-255-7248",
  "npi_number": "1972807972"
 },
 {
  "provider_full_name": "RAMON ALARCON",
  "primary_taxonomy_description": "Anesthesiologist Assistant",
  "full_practice_address": "1001 JOHNSON FY RD NE, ATLANTA, GA 303421605",
  "primary_practice_phone": "404-785-2008",
  "primary_practice_fax": "404-785-4496",
  "npi_number": "1699179291"
 },
 {
  "provider_full_name": "ANASTACIA ABDALLA",
  "primary_taxonomy_description": "Pediatrics",
  "full_practice_address": "1001 JOHNSON FY RD NE, ATLANTA, GA 303421605",
  "primary_practice_phone": "404-785-4826",
  "primary_practice_fax": "404-785-4820",
  "npi_number": "1114287190"
 },
 {
  "provider_full_name": "ANNA AGOSTON",
  "primary_taxonomy_description": "Psychologist, Clinical Child & Adolescent",
  "full_practice_address": "1001 JOHNSON FY RD NE, ATLANTA, GA 303421605",
  "primary_practice_phone": "404-785-5437",
  "primary_practice_fax": "404-785-4496",
  "npi_number": "1477009462"
 },
 {
  "provider_full_name": "OZIOMA AKARANTA",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "1000 JOHNSON FERRY RD, ATLANTA, GA 303421606",
  "primary_practice_phone": "404-851-8000",
  "primary_practice_fax": "404-303-3759",
  "npi_number": "1295132595"
 },
 {
  "provider_full_name": "IMAD ABOSSALLUE",
  "primary_taxonomy_description": "Nuclear Medicine",
  "full_practice_address": "1000 JOHNSON FERRY RD, ATLANTA, GA 303421606",
  "primary_practice_phone": "404-851-6323",
  "primary_practice_fax": "404-303-3747",
  "npi_number": "1134359599"
 },
 {
  "provider_full_name": "TITILOLA ADEBOYE",
  "primary_taxonomy_description": "Nurse Practitioner, Psych/Mental Health",
  "full_practice_address": "1000 JOHNSON FERRY RD, ATLANTA, GA 303421606",
  "primary_practice_phone": "404-851-8000",
  "primary_practice_fax": "404-303-3759",
  "npi_number": "1811536386"
 },
 {
  "provider_full_name": "CHRISTINE ADAMS",
  "primary_taxonomy_description": "Nurse Anesthetist, Certified Registered",
  "full_practice_address": "1000 JOHNSON FERRY RD NE, ATLANTA, GA 303421606",
  "primary_practice_phone": "770-645-9181",
  "primary_practice_fax": "770-645-8455",
  "npi_number": "1154317881"
 },
 {
  "provider_full_name": "ALEXANDRA ALEXIS",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "980 JOHNSON FY RD NE STE 880, ATLANTA, GA 303421609",
  "primary_practice_phone": "404-255-8304",
  "primary_practice_fax": "404-256-4578",
  "npi_number": "1457122533"
 },
 {
  "provider_full_name": "HAROLD ALEXANDER",
  "primary_taxonomy_description": "Orthopaedic Surgery",
  "full_practice_address": "993 JOHNSON FERRY RD NE # C, STE. 100, ATLANTA, GA 303421620",
  "primary_practice_phone": "404-256-4731",
  "primary_practice_fax": "404-256-3244",
  "npi_number": "1518048784"
 },
 {
  "provider_full_name": "EDDIE ABDALLA",
  "primary_taxonomy_description": "Surgery, Surgical Oncology",
  "full_practice_address": "980 JOHNSON FERRY RD, SUITE 170, ATLANTA, GA 303421626",
  "primary_practice_phone": "404-300-2140",
  "primary_practice_fax": "404-300-2240",
  "npi_number": "1235225889"
 },
 {
  "provider_full_name": "JAIME ACKERMAN",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "980 JOHNSON FERRY RD NE, SUITE 820, ATLANTA, GA 303421626",
  "primary_practice_phone": "404-252-9307",
  "primary_practice_fax": "404-252-5839",
  "npi_number": "1013992544"
 },
 {
  "provider_full_name": "SAMUEL ADAMS",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "5670 PEACHTREE DUNWOODY RD NE, SUITE 1200, ATLANTA, GA 303421699",
  "primary_practice_phone": "404-255-9100",
  "primary_practice_fax": "404-257-7171",
  "npi_number": "1972512069"
 },
 {
  "provider_full_name": "ROBERT ALBIN",
  "primary_taxonomy_description": "Internal Medicine, Pulmonary Disease",
  "full_practice_address": "993C JOHNSON FERRY RD, STE 300, ATLANTA, GA 303421725",
  "primary_practice_phone": "404-303-1700",
  "primary_practice_fax": "404-252-8026",
  "npi_number": "1619057668"
 },
 {
  "provider_full_name": "PETER ABRAMSON",
  "primary_taxonomy_description": "Otolaryngology",
  "full_practice_address": "5673 PEACHTREE DUNWOODY RD, STE 150, ATLANTA, GA 303421771",
  "primary_practice_phone": "404-297-1780",
  "primary_practice_fax": "404-252-7255",
  "npi_number": "1003813379"
 },
 {
  "provider_full_name": "HOWARD ABRAHAMS",
  "primary_taxonomy_description": "Dentist, General Practice",
  "full_practice_address": "5685 LAKE PLACID DR NE, ATLANTA, GA 303421803",
  "primary_practice_phone": "404-843-1999",
  "primary_practice_fax": "404-252-3880",
  "npi_number": "1598786907"
 },
 {
  "provider_full_name": "TARIQ ADAMS",
  "primary_taxonomy_description": "Chiropractor",
  "full_practice_address": "5064 ROSWELL RD, SUITE C-201, ATLANTA, GA 303422281",
  "primary_practice_phone": "404-233-2440",
  "primary_practice_fax": "404-233-2441",
  "npi_number": "1679709240"
 },
 {
  "provider_full_name": "DIANE ALEXANDER",
  "primary_taxonomy_description": "Specialist",
  "full_practice_address": "5445 MERIDIAN MARKS RD NE, SUITE 390, ATLANTA, GA 303424763",
  "primary_practice_phone": "404-851-1998",
  "primary_practice_fax": "404-531-4039",
  "npi_number": "1245354299"
 },
 {
  "provider_full_name": "TATIANA ABEBE",
  "primary_taxonomy_description": "Anesthesiologist Assistant",
  "full_practice_address": "5671 PEACHTREE DUNWOODY RD STE 530, ATLANTA, GA 303425005",
  "primary_practice_phone": "404-257-1415",
  "primary_practice_fax": "404-851-1649",
  "npi_number": "1982441291"
 },
 {
  "provider_full_name": "MUSTAPHA AHMED",
  "primary_taxonomy_description": "Case Manager/Care Coordinator",
  "full_practice_address": "4186 BUFORD HWY NE STE J, ATLANTA, GA 303451067",
  "primary_practice_phone": "404-709-2168",
  "primary_practice_fax": "404-581-5953",
  "npi_number": "1598217812"
 },
 {
  "provider_full_name": "LAUREN ALEXANDER",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "1774 CENTURY BLVD NE STE B, ATLANTA, GA 303453312",
  "primary_practice_phone": "678-744-3003",
  "primary_practice_fax": "404-931-2107",
  "npi_number": "1538439203"
 },
 {
  "provider_full_name": "RUAA AL-BALDAWI",
  "primary_taxonomy_description": "Pharmacist",
  "full_practice_address": "100 PERIMETER CENTER PL NE, TARGET 2036, ATLANTA, GA 303461204",
  "primary_practice_phone": "678-259-0889",
  "primary_practice_fax": "678-259-0889",
  "npi_number": "1740569565"
 },
 {
  "provider_full_name": "CHAD ALEMAN",
  "primary_taxonomy_description": "Phlebology",
  "full_practice_address": "1455 LINCOLN PKWY E, STE 315, ATLANTA, GA 303462209",
  "primary_practice_phone": "404-777-1728",
  "primary_practice_fax": "833-471-4352",
  "npi_number": "1942204557"
 },
 {
  "provider_full_name": "NAOMI ALAZRAKI",
  "primary_taxonomy_description": "Nuclear Medicine",
  "full_practice_address": "1220 TYNECASTLE WAY, ATLANTA, GA 303503516",
  "primary_practice_phone": "404-728-7629",
  "primary_practice_fax": "404-327-4980",
  "npi_number": "1194742965"
 },
 {
  "provider_full_name": "TRESSELYN ADAMS",
  "primary_taxonomy_description": "Nurse Practitioner, Psych/Mental Health",
  "full_practice_address": "PO BOX 538622, ATLANTA, GA 303538622",
  "primary_practice_phone": "910-742-9243",
  "primary_practice_fax": "888-746-1787",
  "npi_number": "1104051168"
 },
 {
  "provider_full_name": "CYNTHIA ABBOTT",
  "primary_taxonomy_description": "Specialist",
  "full_practice_address": "PO BOX 52226, ATLANTA, GA 303550226",
  "primary_practice_phone": "404-816-7900",
  "primary_practice_fax": "404-816-7929",
  "npi_number": "1902898315"
 },
 {
  "provider_full_name": "MOHAMMED AL RABBAT",
  "primary_taxonomy_description": "Pediatrics, Neonatal-Perinatal Medicine",
  "full_practice_address": "PO BOX 88564, ATLANTA, GA 303568564",
  "primary_practice_phone": "678-575-9093",
  "primary_practice_fax": "770-379-9203",
  "npi_number": "1891896478"
 },
 {
  "provider_full_name": "SCOTT ACKERMAN",
  "primary_taxonomy_description": "Chiropractor",
  "full_practice_address": "5025-H WINTERS CHAPEL ROAD, ATLANTA, GA 30360",
  "primary_practice_phone": "770-399-1800",
  "primary_practice_fax": "770-399-5380",
  "npi_number": "1609937986"
 },
 {
  "provider_full_name": "LEANNA ALBERTSON PAPA",
  "primary_taxonomy_description": "Nurse Practitioner, Gerontology",
  "full_practice_address": "PO BOX 102222, ATLANTA, GA 303682222",
  "primary_practice_phone": "239-274-8200",
  "primary_practice_fax": "239-278-3350",
  "npi_number": "1952825457"
 },
 {
  "provider_full_name": "AHMED AL-HAZZOURI",
  "primary_taxonomy_description": "Internal Medicine, Medical Oncology",
  "full_practice_address": "PO BOX 102222, ATTENTION: CREDENTIAL DEPARTMENT, ATLANTA, GA 303682222",
  "primary_practice_phone": "239-274-8200",
  "primary_practice_fax": "239-278-3350",
  "npi_number": "1841482270"
 },
 {
  "provider_full_name": "CHRISTOPHER ALEXANDER",
  "primary_taxonomy_description": "Internal Medicine, Medical Oncology",
  "full_practice_address": "PO BOX 102222, ATTN: CREDENTIALING, ATLANTA, GA 303682222",
  "primary_practice_phone": "239-274-8200",
  "primary_practice_fax": "239-278-3350",
  "npi_number": "1306850508"
 },
 {
  "provider_full_name": "GEETHANJALI AKULA",
  "primary_taxonomy_description": "Internal Medicine, Medical Oncology",
  "full_practice_address": "PO BOX 102222, ATTN: CREDENTIALING, ATLANTA, GA 303682222",
  "primary_practice_phone": "239-274-8200",
  "primary_practice_fax": "239-278-3350",
  "npi_number": "1366435927"
 },
 {
  "provider_full_name": "MICHAEL AHO",
  "primary_taxonomy_description": "Radiology, Diagnostic Radiology",
  "full_practice_address": "PO BOX 116075, ATLANTA, GA 303686075",
  "primary_practice_phone": "855-709-1801",
  "primary_practice_fax": "610-373-2308",
  "npi_number": "1477729051"
 },
 {
  "provider_full_name": "KISHA ADDERLEY",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 116202, ATLANTA, GA 303686202",
  "primary_practice_phone": "678-609-6282",
  "primary_practice_fax": "678-609-6283",
  "npi_number": "1174921175"
 },
 {
  "provider_full_name": "LIBBY ABERLE",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 117598, ATLANTA, GA 303687598",
  "primary_practice_phone": "770-442-1911",
  "primary_practice_fax": "770-442-0306",
  "npi_number": "1609534809"
 },
 {
  "provider_full_name": "CLAUDIA ALFARO-ANDRICK",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 740018, ATLANTA, GA 303740018",
  "primary_practice_phone": "312-773-9730",
  "primary_practice_fax": "773-866-8014",
  "npi_number": "1932315975"
 },
 {
  "provider_full_name": "AIESHA AHMED",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1215888391"
 },
 {
  "provider_full_name": "AIJIALON ALEXANDER",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1821938812"
 },
 {
  "provider_full_name": "ALEXANDRIA ADAMS",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1588516538"
 },
 {
  "provider_full_name": "ALYA AL-TAWEEL",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1114698347"
 },
 {
  "provider_full_name": "ANASTASIA AFE DUQUE",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "855-223-7123",
  "npi_number": "1841143666"
 },
 {
  "provider_full_name": "ANGELICA AGUIRRE",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1083560957"
 },
 {
  "provider_full_name": "BRIANNA ACEVEDO",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1649120114"
 },
 {
  "provider_full_name": "CHAKERA ADAMS-FORT",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1598584922"
 },
 {
  "provider_full_name": "ERIKA ALCANTAR",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1831040435"
 },
 {
  "provider_full_name": "GABRIELA AGUILAR ZAMUDIO",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1467175364"
 },
 {
  "provider_full_name": "HIBAH AL ASSI",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1356294979"
 },
 {
  "provider_full_name": "JESUS AGUILAR",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1063372787"
 },
 {
  "provider_full_name": "LESLIE ALANIZ",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1164388625"
 },
 {
  "provider_full_name": "LESLIE ALBARRAN SOLORIO",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1801749320"
 },
 {
  "provider_full_name": "LILIANA AGUILAR",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1023964350"
 },
 {
  "provider_full_name": "MARIBEL AGUILAR",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1962286211"
 },
 {
  "provider_full_name": "MARK ABDELMLEK",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1700738762"
 },
 {
  "provider_full_name": "MARLENE ALEGRIA",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1558094342"
 },
 {
  "provider_full_name": "MARYAM ABDURAHIMOVA",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1164373791"
 },
 {
  "provider_full_name": "MELISSA ALARCON",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1790542843"
 },
 {
  "provider_full_name": "NIRIAN ALARCON",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1538873708"
 },
 {
  "provider_full_name": "PRINCESS-INDIA ALEXANDER",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1730804048"
 },
 {
  "provider_full_name": "SAMAH ALGHAZALI",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1386450435"
 },
 {
  "provider_full_name": "SARA ALEXANDER",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1275494288"
 },
 {
  "provider_full_name": "SERGIO AGUIRRE",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "323-866-1881",
  "npi_number": "1619740792"
 },
 {
  "provider_full_name": "SHIOUN ALBAN",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1467029843"
 },
 {
  "provider_full_name": "SONIA ALDANA",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1861218232"
 },
 {
  "provider_full_name": "VANESSA ALFARO",
  "primary_taxonomy_description": "Behavior Technician",
  "full_practice_address": "PO BOX 740780, ATLANTA, GA 303740780",
  "primary_practice_phone": "855-223-7123",
  "primary_practice_fax": "619-374-7134",
  "npi_number": "1013695253"
 },
 {
  "provider_full_name": "DEBORAH ALDRIDGE",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 741331, ATLANTA, GA 303741331",
  "primary_practice_phone": "913-469-0503",
  "primary_practice_fax": "913-469-5267",
  "npi_number": "1104830652"
 },
 {
  "provider_full_name": "HEATHER ALBERICO",
  "primary_taxonomy_description": "Physical Therapist",
  "full_practice_address": "PO BOX 741708, ATLANTA, GA 303741708",
  "primary_practice_phone": "352-382-7214",
  "primary_practice_fax": "352-382-7781",
  "npi_number": "1891368296"
 },
 {
  "provider_full_name": "KATIA ADAMS",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 742616, ATLANTA, GA 303742616",
  "primary_practice_phone": "770-219-8420",
  "primary_practice_fax": "941-847-7919",
  "npi_number": "1649224114"
 },
 {
  "provider_full_name": "JOHN ADAMSKI",
  "primary_taxonomy_description": "Surgery, Surgical Critical Care",
  "full_practice_address": "PO BOX 742616, ATLANTA, GA 303742616",
  "primary_practice_phone": "770-219-8420",
  "primary_practice_fax": "770-219-8440",
  "npi_number": "1407819535"
 },
 {
  "provider_full_name": "ELIZABETH ABELL",
  "primary_taxonomy_description": "Internal Medicine, Infectious Disease",
  "full_practice_address": "PO BOX 743070, ATLANTA, GA 303743070",
  "primary_practice_phone": "864-560-4304",
  "primary_practice_fax": "864-560-4413",
  "npi_number": "1083623805"
 },
 {
  "provider_full_name": "OMAR AHMED",
  "primary_taxonomy_description": "Internal Medicine, Critical Care Medicine",
  "full_practice_address": "PO BOX 744786, ATLANTA, GA 303744786",
  "primary_practice_phone": "704-834-2450",
  "primary_practice_fax": "704-671-5331",
  "npi_number": "1457702318"
 },
 {
  "provider_full_name": "GEORGE ADCOCK",
  "primary_taxonomy_description": "Obstetrics & Gynecology",
  "full_practice_address": "PO BOX 744786, ATLANTA, GA 303744786",
  "primary_practice_phone": "704-834-2450",
  "primary_practice_fax": "704-671-5331",
  "npi_number": "1447246228"
 },
 {
  "provider_full_name": "SHAMSHER AHLUWALIA",
  "primary_taxonomy_description": "Psychiatry & Neurology, Psychiatry",
  "full_practice_address": "PO BOX 744786, ATLANTA, GA 303744786",
  "primary_practice_phone": "704-834-2450",
  "primary_practice_fax": "704-671-5331",
  "npi_number": "1497943286"
 },
 {
  "provider_full_name": "ANGELA ADAMS-HARRISON",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746071, ATLANTA, GA 303746071",
  "primary_practice_phone": "312-733-9730",
  "primary_practice_fax": "773-866-8014",
  "npi_number": "1093071144"
 },
 {
  "provider_full_name": "DYLAN ALBIANI",
  "primary_taxonomy_description": "Behavior Analyst",
  "full_practice_address": "PO BOX 746075, ATLANTA, GA 303746075",
  "primary_practice_phone": "818-241-6780",
  "primary_practice_fax": "800-819-7806",
  "npi_number": "1790288173"
 },
 {
  "provider_full_name": "GONZALO AILLON",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "PO BOX 746079, ATLANTA, GA 303746079",
  "primary_practice_phone": "773-352-1515",
  "primary_practice_fax": "312-929-0373",
  "npi_number": "1598790644"
 },
 {
  "provider_full_name": "RACHEL ADKINS",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 746079, ATLANTA, GA 303746079",
  "primary_practice_phone": "833-804-1695",
  "primary_practice_fax": "312-929-0673",
  "npi_number": "1225548589"
 },
 {
  "provider_full_name": "MIRIAM AHMED",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746087, ATLANTA, GA 303746087",
  "primary_practice_phone": "833-804-1695",
  "primary_practice_fax": "312-929-0373",
  "npi_number": "1699417337"
 },
 {
  "provider_full_name": "FRANCINE AKINS ARBUCKLE",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "PO BOX 746093, ATLANTA, GA 303746093",
  "primary_practice_phone": "773-352-1517",
  "primary_practice_fax": "312-929-0373",
  "npi_number": "1942333018"
 },
 {
  "provider_full_name": "MASON ADAMS",
  "primary_taxonomy_description": "Internal Medicine, Gastroenterology",
  "full_practice_address": "PO BOX 746450, ATLANTA, GA 303746450",
  "primary_practice_phone": "866-401-3057",
  "primary_practice_fax": "313-868-6430",
  "npi_number": "1770979882"
 },
 {
  "provider_full_name": "AHMED ABDALLA",
  "primary_taxonomy_description": "Internal Medicine, Hematology & Oncology",
  "full_practice_address": "PO BOX 746450, ATLANTA, GA 303746450",
  "primary_practice_phone": "251-434-3626",
  "primary_practice_fax": "251-445-2464",
  "npi_number": "1568848901"
 },
 {
  "provider_full_name": "HAMDY AHMED",
  "primary_taxonomy_description": "Internal Medicine, Rheumatology",
  "full_practice_address": "PO BOX 746450, ATLANTA, GA 303746450",
  "primary_practice_phone": "251-434-3626",
  "primary_practice_fax": "251-445-2464",
  "npi_number": "1093198632"
 },
 {
  "provider_full_name": "ZAN AHMED",
  "primary_taxonomy_description": "Pathology, Anatomic Pathology & Clinical Pathology",
  "full_practice_address": "PO BOX 746450, ATLANTA, GA 303746450",
  "primary_practice_phone": "866-401-3057",
  "primary_practice_fax": "318-868-6430",
  "npi_number": "1932760113"
 },
 {
  "provider_full_name": "JOEL AHLGRIM",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746638, ATLANTA, GA 303746638",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1306821236"
 },
 {
  "provider_full_name": "OUSAMA ABOUSHAAR",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746638, ATLANTA, GA 303746638",
  "primary_practice_phone": "904-202-1032",
  "primary_practice_fax": "904-376-4107",
  "npi_number": "1629574843"
 },
 {
  "provider_full_name": "SAFIA AHMED",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746638, ATLANTA, GA 303746638",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1083399612"
 },
 {
  "provider_full_name": "ANTHONY ABRIGO",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "PO BOX 746647, ATLANTA, GA 303746647",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1578144523"
 },
 {
  "provider_full_name": "AMIN AGHAEBRAHIM",
  "primary_taxonomy_description": "Psychiatry & Neurology, Vascular Neurology",
  "full_practice_address": "PO BOX 746647, ATLANTA, GA 303746647",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1558504423"
 },
 {
  "provider_full_name": "MOHAMED ABDUL QADER",
  "primary_taxonomy_description": "Internal Medicine, Cardiovascular Disease",
  "full_practice_address": "PO BOX 746652, ATLANTA, GA 303746652",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1487114633"
 },
 {
  "provider_full_name": "NAYAN AGARWAL",
  "primary_taxonomy_description": "Internal Medicine, Interventional Cardiology",
  "full_practice_address": "PO BOX 746652, ATLANTA, GA 303746652",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1063724326"
 },
 {
  "provider_full_name": "FAISAL AHMAD",
  "primary_taxonomy_description": "Otolaryngology",
  "full_practice_address": "PO BOX 746654, ATLANTA, GA 303746654",
  "primary_practice_phone": "904-202-2092",
  "primary_practice_fax": "904-376-4075",
  "npi_number": "1770859944"
 },
 {
  "provider_full_name": "CARLOS AGUERO-MEDINA",
  "primary_taxonomy_description": "Family Medicine",
  "full_practice_address": "PO BOX 746715, ATLANTA, GA 303746715",
  "primary_practice_phone": "773-352-1515",
  "primary_practice_fax": "312-929-0374",
  "npi_number": "1053364349"
 },
 {
  "provider_full_name": "RAMESH AGGARWAL",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "PO BOX 746715, ATLANTA, GA 303746715",
  "primary_practice_phone": "773-467-7254",
  "primary_practice_fax": "815-642-5697",
  "npi_number": "1649458712"
 },
 {
  "provider_full_name": "BRIDGET ADAMJEE",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 746715, ATLANTA, GA 303746715",
  "primary_practice_phone": "708-298-0766",
  "primary_practice_fax": "708-810-4231",
  "npi_number": "1023909892"
 },
 {
  "provider_full_name": "OLUFUNKE AJIFOLOKUN",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 746715, ATLANTA, GA 303746715",
  "primary_practice_phone": "773-352-1515",
  "primary_practice_fax": "312-929-0373",
  "npi_number": "1922600873"
 },
 {
  "provider_full_name": "VERONICA AGUILAR",
  "primary_taxonomy_description": "Social Worker, Clinical",
  "full_practice_address": "PO BOX 746715, ATLANTA, GA 303746715",
  "primary_practice_phone": "847-306-7093",
  "primary_practice_fax": "847-739-0972",
  "npi_number": "1558249144"
 },
 {
  "provider_full_name": "DAPHNE ALEXIS",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 746722, ATLANTA, GA 303746722",
  "primary_practice_phone": "773-352-1515",
  "primary_practice_fax": "312-929-0373",
  "npi_number": "1275955015"
 },
 {
  "provider_full_name": "ALESIA ALBURY",
  "primary_taxonomy_description": "Counselor, Mental Health",
  "full_practice_address": "PO BOX 748465, ATLANTA, GA 303748465",
  "primary_practice_phone": "855-284-7483",
  "primary_practice_fax": "617-807-0958",
  "npi_number": "1497445993"
 },
 {
  "provider_full_name": "ADEOLA AKINWALE",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "PO BOX 748465, ATLANTA, GA 303748465",
  "primary_practice_phone": "855-284-7483",
  "primary_practice_fax": "617-807-0958",
  "npi_number": "1215885868"
 },
 {
  "provider_full_name": "TIFFANY AFFLALO-WILLIAMS",
  "primary_taxonomy_description": "Counselor, Professional",
  "full_practice_address": "PO BOX 748465, ATLANTA, GA 303748465",
  "primary_practice_phone": "855-284-7483",
  "primary_practice_fax": "617-807-0958",
  "npi_number": "1922399484"
 },
 {
  "provider_full_name": "AMAOGECHUKWU ACHOLONU",
  "primary_taxonomy_description": "Counselor, Mental Health",
  "full_practice_address": "PO BOX 748519, ATLANTA, GA 303748519",
  "primary_practice_phone": "904-376-3800",
  "primary_practice_fax": "904-376-3998",
  "npi_number": "1962956284"
 },
 {
  "provider_full_name": "YEVGENIYA ALEMANY",
  "primary_taxonomy_description": "Nurse Practitioner, Psych/Mental Health",
  "full_practice_address": "PO BOX 748519, ATLANTA, GA 303748519",
  "primary_practice_phone": "904-376-3800",
  "primary_practice_fax": "904-376-3998",
  "npi_number": "1467294512"
 },
 {
  "provider_full_name": "JASMINE ABENCHUCHAN",
  "primary_taxonomy_description": "Student in an Organized Health Care Education/Training Program",
  "full_practice_address": "PO BOX 748519, ATLANTA, GA 303748519",
  "primary_practice_phone": "904-376-3800",
  "primary_practice_fax": "904-376-3998",
  "npi_number": "1902724974"
 },
 {
  "provider_full_name": "MELISSA ADAMS",
  "primary_taxonomy_description": "Nurse Practitioner, Obstetrics & Gynecology",
  "full_practice_address": "PO BOX 748667, ATLANTA, GA 303748667",
  "primary_practice_phone": "904-202-1032",
  "primary_practice_fax": "904-376-4107",
  "npi_number": "1922502293"
 },
 {
  "provider_full_name": "REDA ALAMI",
  "primary_taxonomy_description": "Obstetrics & Gynecology",
  "full_practice_address": "PO BOX 748817, ATLANTA, GA 303748817",
  "primary_practice_phone": "813-286-0033",
  "primary_practice_fax": "813-282-1806",
  "npi_number": "1265632814"
 },
 {
  "provider_full_name": "TANNICE ALAM",
  "primary_taxonomy_description": "Obstetrics & Gynecology",
  "full_practice_address": "PO BOX 748817, ATLANTA, GA 303748817",
  "primary_practice_phone": "813-286-0033",
  "primary_practice_fax": "813-282-1806",
  "npi_number": "1114669074"
 },
 {
  "provider_full_name": "DEBORAH ADAMS",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 749112, ATLANTA, GA 303749112",
  "primary_practice_phone": "434-295-1000",
  "primary_practice_fax": "434-972-4266",
  "npi_number": "1497909097"
 },
 {
  "provider_full_name": "TAMARAH ALDAWOODI",
  "primary_taxonomy_description": "Internal Medicine, Hematology & Oncology",
  "full_practice_address": "PO BOX 749495, ATLANTA, GA 303749495",
  "primary_practice_phone": "855-963-2100",
  "primary_practice_fax": "813-321-1296",
  "npi_number": "1255864120"
 },
 {
  "provider_full_name": "KATHERINE ALEXANDER",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "PO BOX 749495, ATLANTA, GA 303749495",
  "primary_practice_phone": "238-432-8331",
  "primary_practice_fax": "813-321-1296",
  "npi_number": "1568879435"
 },
 {
  "provider_full_name": "KAITLYNN AGEE",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 749495, ATLANTA, GA 303749495",
  "primary_practice_phone": "855-963-2100",
  "primary_practice_fax": "813-321-1296",
  "npi_number": "1881471555"
 },
 {
  "provider_full_name": "KAYLA ALDRIDGE",
  "primary_taxonomy_description": "Nurse Practitioner, Family",
  "full_practice_address": "PO BOX 749495, ATLANTA, GA 303749495",
  "primary_practice_phone": "855-963-2100",
  "primary_practice_fax": "813-321-1296",
  "npi_number": "1063352052"
 },
 {
  "provider_full_name": "MARVIN ALDABUTE",
  "primary_taxonomy_description": "Nurse Anesthetist, Certified Registered",
  "full_practice_address": "PO BOX 100024, ATLANTA, GA 303840024",
  "primary_practice_phone": "352-243-9114",
  "primary_practice_fax": "352-243-7822",
  "npi_number": "1144338666"
 },
 {
  "provider_full_name": "MAHEEN AHMED-KHOKHAR",
  "primary_taxonomy_description": "Audiologist",
  "full_practice_address": "PO BOX 406153, ATLANTA, GA 303841876",
  "primary_practice_phone": "973-538-1609",
  "primary_practice_fax": "973-538-0432",
  "npi_number": "1396762944"
 },
 {
  "provider_full_name": "JUDITH ADAMS",
  "primary_taxonomy_description": "Audiologist-Hearing Aid Fitter",
  "full_practice_address": "PO BOX 406153, ATLANTA, GA 303841876",
  "primary_practice_phone": "561-478-8770",
  "primary_practice_fax": "561-598-7231",
  "npi_number": "1700092970"
 },
 {
  "provider_full_name": "ALAA ALI",
  "primary_taxonomy_description": "Internal Medicine, Hematology & Oncology",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1841546876"
 },
 {
  "provider_full_name": "AMAL ABUKHDEIR",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1609423946"
 },
 {
  "provider_full_name": "LAUREN ADAMS",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1013790922"
 },
 {
  "provider_full_name": "SAMANTHA AGUINAGA",
  "primary_taxonomy_description": "Nurse Practitioner",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1649638123"
 },
 {
  "provider_full_name": "FAHAD ALDHAHRI",
  "primary_taxonomy_description": "Otolaryngology",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-4673",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1518795798"
 },
 {
  "provider_full_name": "SARA ABU MEHSEN",
  "primary_taxonomy_description": "Pathology, Hematology",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-4673",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1184241481"
 },
 {
  "provider_full_name": "ALEJANDRA AGUIRRE",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1356003115"
 },
 {
  "provider_full_name": "LINDSEY ABNEY",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-7365",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1235929019"
 },
 {
  "provider_full_name": "MELISSA ADAMS",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-4673",
  "primary_practice_fax": "813-449-6749",
  "npi_number": "1871687855"
 },
 {
  "provider_full_name": "ALTAN AHMED",
  "primary_taxonomy_description": "Radiology, Vascular & Interventional Radiology",
  "full_practice_address": "PO BOX 198441, ATLANTA, GA 303848441",
  "primary_practice_phone": "813-745-4673",
  "primary_practice_fax": "813-449-8618",
  "npi_number": "1184069411"
 },
 {
  "provider_full_name": "SARA ABERCROMBIE",
  "primary_taxonomy_description": "Advanced Practice Midwife",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-7884",
  "npi_number": "1215398128"
 },
 {
  "provider_full_name": "CRISTINA ACOSTA DIAZ",
  "primary_taxonomy_description": "Internal Medicine",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-2600",
  "npi_number": "1114435351"
 },
 {
  "provider_full_name": "DUSTIN ALBERT",
  "primary_taxonomy_description": "Internal Medicine, Gastroenterology",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-7884",
  "npi_number": "1689968463"
 },
 {
  "provider_full_name": "MARCIANNA ALEXANDER",
  "primary_taxonomy_description": "Nurse Anesthetist, Certified Registered",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-7884",
  "npi_number": "1558597856"
 },
 {
  "provider_full_name": "ZACHARY ADAMS",
  "primary_taxonomy_description": "Nurse Anesthetist, Certified Registered",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-7884",
  "npi_number": "1972155315"
 },
 {
  "provider_full_name": "EVONNA ACKOUREY",
  "primary_taxonomy_description": "Physician Assistant",
  "full_practice_address": "PO BOX 947407, ATLANTA, GA 303947407",
  "primary_practice_phone": "941-917-2600",
  "primary_practice_fax": "941-917-7884",
  "npi_number": "1285276139"
 }
];
