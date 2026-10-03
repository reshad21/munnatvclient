/**
 * ONE permission vocabulary for the frontend (mirrors the backend
 * `permissions.ts`). Canonical feature keys stored in the DB.
 */

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "status",
  "export",
  "assign",
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  status: "Status",
  export: "Export",
  assign: "Assign",
};

export interface FeatureDefinition {
  key: string;
  label: string;
  actions: PermissionAction[];
}

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  { key: "auth", label: "Auth", actions: ["view"] },
  {
    key: "roles_permissions",
    label: "Roles & Permissions",
    actions: ["view", "create", "edit", "delete", "status", "export", "assign"],
  },
  {
    key: "blogs",
    label: "Blogs",
    actions: ["view", "create", "edit", "delete", "status", "export"],
  },
  { key: "faqs", label: "FAQs", actions: ["view", "create", "edit", "delete"] },
  {
    key: "fivePillarsOfIslam",
    label: "Five Pillar",
    actions: ["view", "create", "edit", "delete", "status"],
  },
  { key: "contacts", label: "Contacts", actions: ["view", "delete", "export"] },
  {
    key: "services",
    label: "Services",
    actions: ["view", "create", "edit", "delete", "status"],
  },
  { key: "update-profile", label: "Update Profile", actions: ["view", "edit"] },
  {
    key: "page-setting",
    label: "Page Settings",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "page-setting/hero-area",
    label: "Hero Area",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "page-setting/about-us",
    label: "About Us",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "page-setting/contact-us",
    label: "Contact Us",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    key: "packages",
    label: "Packages",
    actions: ["view", "create", "edit", "delete", "status", "export"],
  },
  {
    key: "gallery",
    label: "Gallery",
    actions: ["view", "create", "edit", "delete", "status"],
  },
  {
    key: "reviews",
    label: "Reviews",
    actions: ["view", "create", "edit", "delete", "status", "export"],
  },
  {
    key: "video-gallery",
    label: "Video Gallery",
    actions: ["view", "create", "edit", "delete", "status"],
  },
];

export const FEATURE_KEYS = FEATURE_DEFINITIONS.map((f) => f.key);

export const SUPPORTED_ACTIONS: Record<string, PermissionAction[]> =
  Object.fromEntries(FEATURE_DEFINITIONS.map((f) => [f.key, f.actions])) as Record<
    string,
    PermissionAction[]
  >;

export type PermissionsMap = Record<string, PermissionAction[]>;

export const isSuperAdminRole = (roleName?: string | null): boolean =>
  (roleName ?? "").toLowerCase() === "super admin";

export function hasPermission(
  map: PermissionsMap | undefined | null,
  feature: string,
  action: PermissionAction
): boolean {
  if (!map) return false;
  return !!map[feature]?.includes(action);
}

export function countSelectedPermissions(map: PermissionsMap): number {
  return Object.values(map).reduce((sum, actions) => sum + actions.length, 0);
}

/** Legacy dashboard-style paths mapped to canonical keys (one-time fallback). */
const LEGACY_PATH_MAP: Record<string, string> = {
  roles: "roles_permissions",
  settings: "page-setting",
  fivepillars: "fivePillarsOfIslam",
  fivepillar: "fivePillarsOfIslam",
};

export function canonicalFeatureKey(raw: string): string {
  const normalized = (raw ?? "").replace(/^\/+|\/+$/g, "");
  const lower = normalized.toLowerCase();
  if (LEGACY_PATH_MAP[lower]) return LEGACY_PATH_MAP[lower];
  const exact = FEATURE_KEYS.find((k) => k.toLowerCase() === lower);
  return exact ?? normalized;
}

/** Sidebar href (without /dashboard prefix) -> canonical feature key. */
export function sidebarHrefToFeature(href: string): string | null {
  const clean = href.replace(/^\/dashboard\/|^\//, "").replace(/\/$/, "");
  if (clean === "" || clean === "dashboard") return null; // always visible
  if (clean === "role" || clean === "roles_permissions")
    return "roles_permissions";
  return canonicalFeatureKey(clean);
}
