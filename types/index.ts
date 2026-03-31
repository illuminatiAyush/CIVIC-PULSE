export interface Issue {
  id?: string;
  image_url: string;
  issue_type: string;
  description: string;
  confidence?: number;
  latitude: number;
  longitude: number;
  status: "submitted" | "acknowledged" | "in_progress" | "resolved" | "rejected" | "invalid" | "overdue";
  created_at?: string;
  updated_at?: string;
  reporter_name?: string | null;
  reporter_contact?: string | null;
  anonymous?: boolean;
  issue_title?: string | null;
  ward?: string | null;
  locality?: string | null;
  priority?: "low" | "medium" | "high" | "critical";
  assigned_department?: string | null;
  assigned_officer?: string | null;
  internal_notes?: string | null;
  duplicate_of?: string | null;
  duplicate_count?: number;
  trust_delta?: number;
  voice_note_url?: string | null;
}

export const ISSUE_CATEGORIES = [
  "Road Damage / Pothole",
  "Garbage Dump",
  "Drainage Issue / Water Logging",
  "Streetlight Issue",
  "Water Leakage",
  "Sewage Issue",
  "Road Debris / Construction Waste",
  "Other",
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const STATUS_FLOW: Issue["status"][] = [
  "submitted",
  "acknowledged",
  "in_progress",
  "resolved",
  "rejected",
  "invalid",
  "overdue",
];

export const STATUS_LABELS: Record<Issue["status"], string> = {
  submitted: "Submitted",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  invalid: "Invalid",
  overdue: "Overdue",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};
