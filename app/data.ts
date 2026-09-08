export type Lawyer = {
  id: number;
  name: string;
  city: string;
  court: string;
  specialty: string;
  price: number;
  rating: number;
  experience: number;
  languages: string[];
  response: string;
  availability: "Today" | "Tomorrow" | "This week";
  matters: number;
  profileImage: string;
};

export const lawyers: Lawyer[] = [
  {
    id: 1,
    name: "Adv. Aditi Menon",
    city: "Bengaluru",
    court: "Karnataka High Court",
    specialty: "Property",
    price: 1499,
    rating: 4.9,
    experience: 12,
    languages: ["English", "Hindi", "Kannada"],
    response: "12 min",
    availability: "Today",
    matters: 438,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Aditi%20Menon&backgroundColor=f0fdf4",
  },
  {
    id: 2,
    name: "Adv. Rohan Batra",
    city: "Delhi",
    court: "Patiala House Courts",
    specialty: "Criminal",
    price: 999,
    rating: 4.8,
    experience: 9,
    languages: ["English", "Hindi", "Punjabi"],
    response: "18 min",
    availability: "Today",
    matters: 512,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Rohan%20Batra&backgroundColor=eff6ff",
  },
  {
    id: 3,
    name: "Adv. Meera Iyer",
    city: "Mumbai",
    court: "Bombay High Court",
    specialty: "Family",
    price: 1299,
    rating: 4.7,
    experience: 14,
    languages: ["English", "Hindi", "Marathi", "Tamil"],
    response: "25 min",
    availability: "Tomorrow",
    matters: 366,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Meera%20Iyer&backgroundColor=fdf2f8",
  },
  {
    id: 4,
    name: "Adv. Kabir Sethi",
    city: "Gurugram",
    court: "District Court Gurugram",
    specialty: "Tax",
    price: 1899,
    rating: 4.9,
    experience: 11,
    languages: ["English", "Hindi"],
    response: "10 min",
    availability: "Today",
    matters: 291,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Kabir%20Sethi&backgroundColor=fff7ed",
  },
  {
    id: 5,
    name: "Adv. Nandini Rao",
    city: "Hyderabad",
    court: "City Civil Court",
    specialty: "Consumer",
    price: 799,
    rating: 4.6,
    experience: 7,
    languages: ["English", "Hindi", "Telugu"],
    response: "35 min",
    availability: "This week",
    matters: 224,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Nandini%20Rao&backgroundColor=f0f9ff",
  },
  {
    id: 6,
    name: "Adv. Arjun Chatterjee",
    city: "Kolkata",
    court: "Calcutta High Court",
    specialty: "Labour",
    price: 1199,
    rating: 4.8,
    experience: 10,
    languages: ["English", "Hindi", "Bengali"],
    response: "22 min",
    availability: "Tomorrow",
    matters: 317,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Arjun%20Chatterjee&backgroundColor=f7fee7",
  },
  {
    id: 7,
    name: "Adv. Sana Qureshi",
    city: "Chennai",
    court: "Madras High Court",
    specialty: "Documentation",
    price: 899,
    rating: 4.7,
    experience: 8,
    languages: ["English", "Hindi", "Tamil", "Urdu"],
    response: "20 min",
    availability: "Today",
    matters: 256,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Sana%20Qureshi&backgroundColor=fefce8",
  },
  {
    id: 8,
    name: "Adv. Devika Nair",
    city: "Pune",
    court: "Pune District Court",
    specialty: "Consumer",
    price: 1099,
    rating: 4.8,
    experience: 6,
    languages: ["English", "Hindi", "Marathi", "Malayalam"],
    response: "16 min",
    availability: "Today",
    matters: 203,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Devika%20Nair&backgroundColor=ecfeff",
  },
  {
    id: 9,
    name: "Adv. Vikram Desai",
    city: "Ahmedabad",
    court: "Gujarat High Court",
    specialty: "Tax",
    price: 2199,
    rating: 4.9,
    experience: 16,
    languages: ["English", "Hindi", "Gujarati"],
    response: "28 min",
    availability: "This week",
    matters: 584,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Vikram%20Desai&backgroundColor=f5f3ff",
  },
  {
    id: 10,
    name: "Adv. Ishita Sharma",
    city: "Jaipur",
    court: "Rajasthan High Court",
    specialty: "Family",
    price: 1399,
    rating: 4.6,
    experience: 9,
    languages: ["English", "Hindi", "Rajasthani"],
    response: "30 min",
    availability: "Tomorrow",
    matters: 341,
    profileImage: "https://api.dicebear.com/9.x/notionists/svg?seed=Ishita%20Sharma&backgroundColor=fef2f2",
  },
];

export const prompts = [
  "I received a legal notice from my landlord. What should I check first?",
  "Guide me through filing a consumer complaint in India.",
  "What documents are needed for an income tax notice response?",
  "Can you summarize a property agreement after OCR scan?",
];

export const services = [
  {
    name: "Document Scan",
    hindi: "दस्तावेज़ स्कैन",
    detail: "OCR intake and issue spotting",
    workflow: ["Upload PDF or image", "Extract text blocks", "Flag legal clauses", "Prepare lawyer brief"],
  },
  {
    name: "Legal Notice",
    hindi: "नोटिस ड्राफ्ट",
    detail: "Draft reply and timeline",
    workflow: ["Identify sender and deadline", "Map facts to claims", "Draft reply outline", "Route to advocate"],
  },
  {
    name: "Tax Filing",
    hindi: "आयकर सहायता",
    detail: "ITR and notice checklist",
    workflow: ["Read notice section", "Collect AIS/Form 26AS", "Check mismatch reason", "Prepare response checklist"],
  },
  {
    name: "Court Steps",
    hindi: "प्रक्रिया गाइड",
    detail: "Procedure map by matter",
    workflow: ["Choose matter type", "List forum and limitation", "Collect documents", "Track filing steps"],
  },
];

export const categories = ["All", "Property", "Criminal", "Family", "Tax", "Consumer", "Labour", "Documentation"];
export const cities = [
  "All cities",
  "Bengaluru",
  "Delhi",
  "Mumbai",
  "Gurugram",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Pune",
  "Ahmedabad",
  "Jaipur",
];

export const intakeQuestions = [
  {
    id: "matterType",
    label: "Matter type",
    options: ["Property", "Family", "Consumer", "Tax", "Criminal", "Labour", "Documentation"],
  },
  {
    id: "urgency",
    label: "Urgency",
    options: ["Today", "This week", "This month", "Planning ahead"],
  },
  {
    id: "city",
    label: "City",
    options: cities.filter((city) => city !== "All cities"),
  },
  {
    id: "budget",
    label: "Consultation budget",
    options: ["Under ₹1,000", "₹1,000 - ₹1,500", "₹1,500 - ₹2,000", "Flexible"],
  },
];

export const caseFiles = [
  {
    id: "case_kar_1021",
    title: "Rental notice response",
    court: "Bengaluru Civil Court",
    matterType: "Property",
    status: "Advocate review",
    nextHearing: "18 Sep 2026",
    progress: 68,
    owner: "Priya S.",
    timeline: [
      "Notice uploaded and OCR summary created",
      "legal intake classified the matter as Property",
      "Advocate reply draft under review",
      "Consultation follow-up pending",
    ],
    documents: ["Rental agreement", "Legal notice", "Payment receipts"],
  },
  {
    id: "case_del_4470",
    title: "Consumer refund complaint",
    court: "Delhi District Consumer Commission",
    matterType: "Consumer",
    status: "Filing checklist",
    nextHearing: "Not filed",
    progress: 42,
    owner: "Ankit M.",
    timeline: [
      "Invoice and email trail collected",
      "Demand notice checklist generated",
      "Forum and claim value identified",
    ],
    documents: ["Invoice", "Warranty card", "Email thread"],
  },
  {
    id: "case_mum_8832",
    title: "Income tax notice response",
    court: "Income Tax e-Filing Portal",
    matterType: "Tax",
    status: "Document collection",
    nextHearing: "Response due 12 Sep 2026",
    progress: 55,
    owner: "Neha R.",
    timeline: [
      "Notice section and AY captured",
      "AIS and Form 26AS requested",
      "Mismatch summary prepared",
    ],
    documents: ["Tax notice", "AIS", "Bank statement"],
  },
];

export function makeReply(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes("ipc") || lower.includes("indian penal code") || lower.includes("bns") || lower.includes("bharatiya nyaya sanhita")) {
    return "IPC means the Indian Penal Code, 1860, which was India’s main criminal offence law for many years. For new offences and procedure after the criminal-law transition, users often need to check the Bharatiya Nyaya Sanhita, 2023 as well. Tell me the section or incident, and I can explain the offence, likely documents, police/court route, and when an advocate should review it.";
  }
  if (lower.includes("fir") || lower.includes("police complaint")) {
    return "An FIR is the police record that starts investigation for a cognizable offence. Keep the incident timeline, place, names, witnesses, screenshots, medical records if any, and ID proof ready. If police refuse registration, you can usually escalate to senior police officers or approach the magistrate, but an advocate should review urgent criminal matters.";
  }
  if (lower.includes("bail")) {
    return "Bail is a request to be released from custody while the case continues. The exact route depends on the offence, arrest stage, court, and whether anticipatory or regular bail is needed. Useful details include FIR number, sections, arrest status, court location, prior orders, and the facts showing cooperation or low flight risk.";
  }
  if (lower.includes("court") || lower.includes("district court") || lower.includes("high court") || lower.includes("supreme court")) {
    return "Indian court route depends on subject, territory, claim value, and relief. District courts usually handle local civil/criminal matters, High Courts handle appeals, writs, and supervisory jurisdiction, and the Supreme Court handles constitutional and final appellate issues. Share the dispute type and city, and I can map the likely forum and documents.";
  }
  if (lower.includes("consumer")) {
    return "For a consumer complaint in India, start with invoices, warranty records, messages, and a written demand to the seller. If unresolved, the route usually moves to the District Consumer Commission based on claim value and location. I can prepare a filing checklist and then suggest consumer-law advocates nearby.";
  }
  if (lower.includes("tax") || lower.includes("income")) {
    return "For an income tax notice, first identify the section, assessment year, response deadline, and mismatch reason. Keep Form 26AS, AIS/TIS, bank statements, salary/business records, and prior ITR ready. This platform can map the checklist, but a CA or tax advocate should review before filing.";
  }
  if (lower.includes("property") || lower.includes("agreement")) {
    return "For property documents, scan the title chain, sale deed, encumbrance certificate, khata or municipal records, tax receipts, and possession clauses. I would flag missing signatures, dispute clauses, stamp duty details, and registration references before lawyer review.";
  }
  if (lower.includes("landlord") || lower.includes("notice") || lower.includes("rent")) {
    return "For a landlord or tenancy notice, check the notice date, lease clause relied on, cure period, rent dues, security deposit terms, and jurisdiction. Do not ignore the deadline. A short reply preserving your rights is often the first step before negotiation or filing.";
  }
  return "I can help structure the issue under Indian law, identify documents, draft a checklist, and suggest whether this looks like property, family, consumer, tax, criminal, or labour counsel. This is general information only; an advocate should review facts before you act.";
}
