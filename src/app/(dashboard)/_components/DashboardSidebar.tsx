"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constant/dashboardNavbar.constant";
import { usePermissions } from "@/components/permissions";
import { sidebarHrefToFeature } from "@/constant/permissions";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React, { useState } from "react";
import type { TDashboardAdminData } from "@/types/auth.types";

type NavChild = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

interface SidebarProps {
  adminData?: TDashboardAdminData;
  isMobile?: boolean;
  onNavItemClick?: () => void;
}

export function Sidebar({ isMobile, onNavItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { permissions, isSuperAdmin } = usePermissions();

  // A menu item is visible with "view" on its canonical feature.
  // Dashboard / Log Out have no feature and are always visible.
  // Super Admin bypasses all checks.
  const isItemAllowed = (href: string, label: string) => {
    if (href === "/dashboard" || label === "Log Out") return true;
    if (isSuperAdmin) return true;
    const feature = sidebarHrefToFeature(href);
    if (!feature) return true;
    return !!permissions[feature]?.includes("view");
  };

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!isItemAllowed(item.href, item.label)) return false;

    // If item has children, keep only allowed children (or all for a
    // parent-level grant); hide the parent when nothing is allowed.
    if (item.children && Array.isArray(item.children)) {
      if (isSuperAdmin) return true;
      const parentFeature = sidebarHrefToFeature(item.href);
      if (parentFeature && permissions[parentFeature]?.includes("view"))
        return true;
      return item.children.some((child: NavChild) =>
        isItemAllowed(child.href, child.label)
      );
    }

    return true;
  });

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    const clean = href.startsWith("/") ? href.slice(1) : href;
    return pathname === `/dashboard/${clean}` || pathname.startsWith(`/dashboard/${clean}/`);
  };

  // Dropdown state for items with children
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownClick = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <aside
      className={cn(
        "border-r bg-background",
        isMobile
          ? "h-full"
          : "fixed left-0 w-56 px-2 pt-1 top-16 h-[calc(100vh-4rem)] hidden md:block z-10"
      )}
    >
      <nav className={cn("h-full", isMobile && "py-1")}>
        <ScrollArea className="h-full">
          <div className={cn("grid gap-1", isMobile && "px-4")}>
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => {
                const Icon = item.icon;
                if (item.children && Array.isArray(item.children)) {
                  // Filter children based on view permission
                  const parentFeature = sidebarHrefToFeature(item.href);
                  const parentGranted =
                    isSuperAdmin ||
                    (parentFeature &&
                      permissions[parentFeature]?.includes("view"));
                  const filteredChildren = parentGranted
                    ? item.children
                    : item.children.filter((child: NavChild) =>
                        isItemAllowed(child.href, child.label)
                      );

                  // Don't show parent if no children are allowed
                  if (filteredChildren.length === 0) return null;

                  // Dropdown menu item
                  const isOpen = openDropdown === item.label;
                  return (
                    <div key={item.label} className="relative">
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-3 rounded-3xl px-3 py-2 text-sm font-medium w-full transition-colors hover:bg-brand/10 hover:text-brand",
                          isOpen && "bg-brand-gradient text-white hover:bg-brand/90 hover:text-white",
                          !isOpen && "text-muted-foreground"
                        )}
                        onClick={() => handleDropdownClick(item.label)}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                        {isOpen ? (
                          <ChevronUp className="ml-auto w-4 h-4" />
                        ) : (
                          <ChevronDown className="ml-auto w-4 h-4" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-1 space-y-1 ml-4">
                          {filteredChildren.map((child: NavChild) => {
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                prefetch={true}
                                className={cn(
                                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-brand/10 hover:text-brand",
                                  isActive(child.href) &&
                                    "bg-brand-gradient text-white hover:bg-brand/90 hover:text-white",
                                  !isActive(child.href) && "text-muted-foreground"
                                )}
                                onClick={onNavItemClick}
                              >
                                {ChildIcon && <ChildIcon className="h-4 w-4" />}
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                // Regular menu item
                return (
                  <Link
                    key={item.href}
                    href={
                      item.href === "/dashboard"
                        ? "/dashboard"
                        : `/dashboard/${item.href.replace(/^\//, "")}`
                    }
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-3 rounded-3xl px-3 py-2 text-sm font-medium transition-colors hover:bg-brand/10 hover:text-brand",
                      isActive(item.href) &&
                        "bg-brand-gradient text-white hover:bg-brand/90 hover:text-white",
                      !isActive(item.href) && "text-muted-foreground"
                    )}
                    onClick={onNavItemClick}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })
            ) : (
              <div className="p-4 space-y-2">
                <p className="text-muted-foreground">No menu items available</p>
                <p className="text-xs text-muted-foreground">
                  Check console for debugging info
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </nav>
    </aside>
  );
}
