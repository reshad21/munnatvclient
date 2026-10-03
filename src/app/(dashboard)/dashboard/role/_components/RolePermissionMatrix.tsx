"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ACTION_LABELS,
  FEATURE_DEFINITIONS,
  PERMISSION_ACTIONS,
  countSelectedPermissions,
  type PermissionAction,
  type PermissionsMap,
} from "@/constant/permissions";
import { cn } from "@/lib/utils";

interface RolePermissionMatrixProps {
  value: PermissionsMap;
  onChange: (next: PermissionsMap) => void;
  readOnly?: boolean;
}

const cloneMap = (map: PermissionsMap): PermissionsMap =>
  Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, [...v]])
  ) as PermissionsMap;

// Visibility system (layout/logic untouched):
// - Unchecked: 20px box, white bg, 2px slate-500 border (#64748B ≈ 4.8:1 on
//   white, meets WCAG AA 3:1 for UI components).
// - Checked: dark-green (#0B3738) fill, white check, matching border + ring.
// - Delete column: red family (unchecked outline, #DC2626 fill when checked).
// - Hover: green border + light-green tint. Focus: 2px green ring.
const CHECKBOX_BASE =
  "size-5 rounded-[4px] border-2 bg-white shadow-none cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3738] focus-visible:ring-offset-1 disabled:cursor-not-allowed";

const CHECKBOX_STANDARD = cn(
  CHECKBOX_BASE,
  "border-slate-500 hover:border-[#0B3738] hover:bg-emerald-50",
  "data-[state=checked]:border-[#0B3738] data-[state=checked]:bg-[#0B3738] data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_0_3px_rgba(11,55,56,0.25)]",
  "data-[state=indeterminate]:border-[#0B3738] data-[state=indeterminate]:bg-[#0B3738] data-[state=indeterminate]:text-white"
);

const CHECKBOX_DELETE = cn(
  CHECKBOX_BASE,
  "border-red-500 bg-red-50/60 hover:border-[#DC2626] hover:bg-red-100",
  "data-[state=checked]:border-[#DC2626] data-[state=checked]:bg-[#DC2626] data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_0_3px_rgba(220,38,38,0.2)]"
);

const RolePermissionMatrix = ({
  value,
  onChange,
  readOnly = false,
}: RolePermissionMatrixProps) => {
  const selectedCount = countSelectedPermissions(value);
  const totalSupported = FEATURE_DEFINITIONS.reduce(
    (sum, f) => sum + f.actions.length,
    0
  );

  const setFeatureActions = (feature: string, actions: PermissionAction[]) => {
    const next = cloneMap(value);
    if (actions.length === 0) delete next[feature];
    else next[feature] = actions;
    onChange(next);
  };

  const toggleCell = (feature: string, action: PermissionAction) => {
    if (readOnly) return;
    const current = value[feature] ?? [];
    let next: PermissionAction[];
    if (current.includes(action)) {
      // Unchecking View clears the whole row.
      if (action === "view") next = [];
      else next = current.filter((a) => a !== action);
    } else {
      // Selecting any action auto-selects View.
      next = [...current, action];
      if (action !== "view" && !next.includes("view")) next.push("view");
    }
    setFeatureActions(feature, next);
  };

  const toggleRow = (feature: string, supported: PermissionAction[]) => {
    if (readOnly) return;
    const current = value[feature] ?? [];
    const allSelected = supported.every((a) => current.includes(a));
    setFeatureActions(feature, allSelected ? [] : [...supported]);
  };

  const toggleColumn = (action: PermissionAction) => {
    if (readOnly) return;
    const next = cloneMap(value);
    const columns = FEATURE_DEFINITIONS.filter((f) =>
      f.actions.includes(action)
    );
    const allSelected = columns.every((f) =>
      (next[f.key] ?? []).includes(action)
    );
    for (const f of columns) {
      const current = next[f.key] ?? [];
      if (allSelected) {
        const remaining = current.filter((a) => a !== action);
        // Unchecking View clears the whole row.
        if (action === "view") delete next[f.key];
        else if (remaining.length === 0) delete next[f.key];
        else next[f.key] = remaining;
      } else if (!current.includes(action)) {
        const updated = [...current, action];
        if (action !== "view" && !updated.includes("view"))
          updated.push("view");
        next[f.key] = updated;
      }
    }
    onChange(next);
  };

  const selectAll = () => {
    if (readOnly) return;
    onChange(
      Object.fromEntries(
        FEATURE_DEFINITIONS.map((f) => [f.key, [...f.actions]])
      ) as PermissionsMap
    );
  };

  const clearAll = () => {
    if (readOnly) return;
    onChange({});
  };

  const isColumnChecked = (action: PermissionAction) => {
    const columns = FEATURE_DEFINITIONS.filter((f) =>
      f.actions.includes(action)
    );
    return (
      columns.length > 0 &&
      columns.every((f) => (value[f.key] ?? []).includes(action))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Feature Permissions</h2>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "inline-flex min-h-8 items-center px-3 py-1 transition-colors duration-150",
              selectedCount > 0
                ? "border-[#0B3738] bg-[#0B3738] text-white"
                : "bg-white text-gray-700"
            )}
          >
            {selectedCount} of {totalSupported} actions selected
          </Badge>
          {!readOnly && (
            <>
              <button
                type="button"
                onClick={selectAll}
                className="text-sm font-medium text-[#0B3738] hover:underline cursor-pointer"
              >
                Select all
              </button>
              <span className="text-gray-400">/</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium text-gray-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 overflow-x-auto">
        <table className="w-full min-w-180 text-sm">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100">
              <th className="text-left font-semibold text-gray-900 px-4 py-3 sticky left-0 bg-slate-100 min-w-44">
                Feature
              </th>
              {PERMISSION_ACTIONS.map((action) => (
                <th key={action} className="px-3 py-3 text-center font-semibold text-gray-900">
                  <label className="inline-flex flex-col items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={isColumnChecked(action)}
                      onCheckedChange={() => toggleColumn(action)}
                      disabled={readOnly}
                      aria-label={`Select ${ACTION_LABELS[action]} for all features`}
                      className={action === "delete" ? CHECKBOX_DELETE : CHECKBOX_STANDARD}
                    />
                    <span>{ACTION_LABELS[action]}</span>
                  </label>
                </th>
              ))}
              <th className="px-3 py-3 text-center font-semibold text-gray-900">All</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_DEFINITIONS.map((feature, rowIndex) => {
              const current = value[feature.key] ?? [];
              const rowSelected = current.length > 0;
              const rowAll = feature.actions.every((a) => current.includes(a));
              const rowSome =
                !rowAll && feature.actions.some((a) => current.includes(a));
              return (
                <tr
                  key={feature.key}
                  className={cn(
                    "border-b border-slate-200 last:border-0 transition-colors duration-150",
                    rowSelected
                      ? "bg-emerald-50 hover:bg-emerald-100/70"
                      : rowIndex % 2 === 1
                        ? "bg-slate-50 hover:bg-slate-100"
                        : "bg-white hover:bg-slate-50"
                  )}
                >
                  <td
                    className={cn(
                      "px-4 py-3 font-medium text-gray-900 sticky left-0 bg-inherit border-l-[3px]",
                      rowSelected ? "border-l-[#0B3738]" : "border-l-transparent"
                    )}
                  >
                    {feature.label}
                  </td>
                  {PERMISSION_ACTIONS.map((action) => {
                    const supported = feature.actions.includes(action);
                    if (!supported) {
                      return (
                        <td key={action} className="px-3 py-3 text-center text-slate-400">
                          —
                        </td>
                      );
                    }
                    return (
                      <td key={action} className="px-3 py-3 text-center">
                        <Checkbox
                          checked={current.includes(action)}
                          onCheckedChange={() => toggleCell(feature.key, action)}
                          disabled={readOnly}
                          aria-label={`${feature.label} ${ACTION_LABELS[action]}`}
                          className={action === "delete" ? CHECKBOX_DELETE : CHECKBOX_STANDARD}
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center">
                    <Checkbox
                      checked={rowAll ? true : rowSome ? "indeterminate" : false}
                      onCheckedChange={() => toggleRow(feature.key, feature.actions)}
                      disabled={readOnly}
                      aria-label={`Select all ${feature.label} permissions`}
                      className={CHECKBOX_STANDARD}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePermissionMatrix;
