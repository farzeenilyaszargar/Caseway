export type ConnectorCapability = "read" | "verify" | "submit" | "handoff";

export type ConnectorAdapter = {
  id: string;
  name: string;
  capabilities: ConnectorCapability[];
  productionReady: boolean;
  requiresPartnership: boolean;
  irreversibleActions: string[];
  safeFallback: "draft_packet" | "portal_handoff" | "manual_review";
};

const connectorAdapters: ConnectorAdapter[] = [
  {
    id: "digilocker_apisetu",
    name: "DigiLocker / API Setu",
    capabilities: ["read", "verify"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: [],
    safeFallback: "manual_review",
  },
  {
    id: "income_tax_eri",
    name: "Income Tax ERI APIs",
    capabilities: ["read", "verify", "submit"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: ["submit_income_tax_return", "trigger_e_verification"],
    safeFallback: "draft_packet",
  },
  {
    id: "gstn_gsp",
    name: "GSTN through GSP/ASP",
    capabilities: ["read", "verify", "submit"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: ["submit_gst_application", "file_gst_return"],
    safeFallback: "draft_packet",
  },
  {
    id: "mca_v3",
    name: "MCA V3",
    capabilities: ["read", "handoff"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: ["submit_mca_form", "apply_dsc_signature"],
    safeFallback: "portal_handoff",
  },
  {
    id: "parivahan_sarathi",
    name: "Parivahan / Sarathi",
    capabilities: ["read", "handoff"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: ["book_rto_slot", "pay_transport_fee"],
    safeFallback: "portal_handoff",
  },
  {
    id: "ecourts_services",
    name: "eCourts Services",
    capabilities: ["read"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: [],
    safeFallback: "manual_review",
  },
  {
    id: "ecourts_efiling",
    name: "eCourts eFiling",
    capabilities: ["handoff"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: ["submit_court_filing", "pay_court_fee"],
    safeFallback: "portal_handoff",
  },
  {
    id: "ecourts_epay",
    name: "eCourts ePay",
    capabilities: ["handoff"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: ["pay_court_fee"],
    safeFallback: "portal_handoff",
  },
  {
    id: "edaakhil_ejagriti",
    name: "e-Daakhil / e-Jagriti consumer filing",
    capabilities: ["handoff"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: ["submit_consumer_complaint", "pay_consumer_fee"],
    safeFallback: "portal_handoff",
  },
  {
    id: "pan_services",
    name: "PAN services",
    capabilities: ["read", "handoff"],
    productionReady: false,
    requiresPartnership: true,
    irreversibleActions: ["submit_pan_correction"],
    safeFallback: "portal_handoff",
  },
  {
    id: "passport_seva",
    name: "Passport Seva",
    capabilities: ["read", "handoff"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: ["book_passport_appointment", "pay_passport_fee"],
    safeFallback: "portal_handoff",
  },
  {
    id: "udyam_registration",
    name: "Udyam Registration",
    capabilities: ["read", "handoff"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: ["submit_udyam_registration"],
    safeFallback: "portal_handoff",
  },
  {
    id: "aadhaar_offline",
    name: "Aadhaar offline verification",
    capabilities: ["verify"],
    productionReady: false,
    requiresPartnership: false,
    irreversibleActions: [],
    safeFallback: "manual_review",
  },
];

export function buildConnectorCatalog() {
  return connectorAdapters.map((adapter) => ({
    ...adapter,
    liveSubmissionEnabled: adapter.productionReady && adapter.capabilities.includes("submit"),
  }));
}

export function resolveConnectorAdapter(id: string | undefined) {
  return connectorAdapters.find((adapter) => adapter.id === id) || connectorAdapters[0];
}
