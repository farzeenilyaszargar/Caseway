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
