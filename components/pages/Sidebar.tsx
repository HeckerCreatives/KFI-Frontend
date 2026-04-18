import { useState } from "react";
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/react";
import { menuController } from "@ionic/core";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { isVisible } from "../utils/permissions";
import { AccessToken, Permission } from "../../types/types";
import { jwtDecode } from "jwt-decode";

type NavLink = {
  path?: string;
  label: string;
  resource: string | string[];
  icon?: React.ReactNode;
  children?: NavLink[];
};

interface CollapsibleSidebarProps {
  navLinks: NavLink[];
  logoNoBg: any;
  location: { pathname: string };
}


const toResourceArray = (resource: string | string[]): string[] =>
  Array.isArray(resource) ? resource : [resource];

const isLinkVisible = (
  role: string,
  permissions: Permission[],
  link: NavLink
): boolean => {

  if (isVisible(role, permissions, toResourceArray(link.resource))) return true;

  if (link.children) {
    return link.children.some((child) => isLinkVisible(role, permissions, child));
  }

  return false;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CollapsibleSidebar({
  navLinks,
  logoNoBg,
  location,
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const permissions: Permission[] = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );
  const token: AccessToken = jwtDecode(
    localStorage.getItem("auth") as string
  );

  const isParentActive = (link: NavLink): boolean => {
    if (!link.children) return location.pathname === link.path;
    return link.children.some((child) =>
      child.children
        ? child.children.some((grand) => location.pathname === grand.path)
        : location.pathname === child.path
    );
  };

  const getManageAccountPath = (permissions: Permission[], role: string): string => {
    const hasAdmin = isVisible(role, permissions, ['admin']);
    return hasAdmin ? '/dashboard/admin' : '/dashboard/client';
  };
  
  const visibleLinks = (links: NavLink[]): NavLink[] =>
    links
      .filter((link) => isLinkVisible(token.role, permissions, link))
      .map((link) => {
        // ✅ FIX: Override path for "Manage Account" based on permissions
        if (link.label === 'Manage Account') {
          return {
            ...link,
            path: getManageAccountPath(permissions, token.role),
            children: link.children ? visibleLinks(link.children) : undefined,
          };
        }
  
        return {
          ...link,
          children: link.children ? visibleLinks(link.children) : undefined,
        };
      });
  
    const filteredNavLinks = visibleLinks(navLinks);

  return (
    <div
      className={`
        min-h-screen hidden xl:flex flex-col p-4 relative
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[320px]"}
        border-r border-zinc-100
        bg-white
      `}
    >
      {/* ── Toggle Button ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3.5 top-6 z-50
          h-7 w-7 rounded-full
          bg-zinc-100 border border-zinc-200
          flex items-center justify-center
          shadow-sm hover:shadow-md
          text-zinc-500 hover:text-orange-500
          transition-all duration-200
          hover:border-orange-300
          cursor-pointer
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRightIcon size={14} strokeWidth={2.5} />
        ) : (
          <ChevronLeftIcon size={14} strokeWidth={2.5} />
        )}
      </button>

      {/* ── Logo ── */}
      <div className={`px-2 mb-6 ${collapsed ? "flex justify-center" : ""}`}>
        <div className="flex items-center overflow-hidden">
          <Image
            alt="logo"
            src={logoNoBg}
            className={`w-auto transition-all duration-300 ${
              collapsed ? "h-4" : "h-12"
            }`}
          />
        </div>
      </div>

      {/* ── Section Label ── */}
      {!collapsed && (
        <p className="px-2 text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-2 transition-all duration-200">
          Menu
        </p>
      )}

      {/* ── Nav Items ── */}
      <div className="w-full overflow-y-auto overflow-x-hidden flex-1">
        {collapsed ? (
          /* ── Collapsed: icon-only buttons ── */
          <nav className="flex flex-col gap-1">
            {filteredNavLinks.map((link, idx) => {
              const active = link.path
                ? location.pathname === link.path
                : isParentActive(link);

              return (
                <p
                  key={idx}
                  title={link.label}
                  onClick={() => setCollapsed(false)}
                  className={`
                    group relative flex items-center justify-center
                    h-10 w-10 mx-auto rounded-xl
                    transition-all duration-200 cursor-pointer
                    ${
                      active
                        ? "bg-orange-500 text-white"
                        : "text-orange-500 hover:bg-orange-50"
                    }
                  `}
                >
                  {link.icon ?? (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}

                  {/* Tooltip */}
                  <span
                    className="
                      pointer-events-none absolute left-full ml-3
                      rounded-md bg-zinc-800 px-2 py-1
                      text-xs text-white whitespace-nowrap
                      opacity-0 group-hover:opacity-100
                      translate-x-1 group-hover:translate-x-0
                      transition-all duration-150 z-50
                      shadow-lg
                    "
                  >
                    {link.label}
                  </span>
                </p>
              );
            })}
          </nav>
        ) : (
          /* ── Expanded: full accordion nav ── */
          <IonAccordionGroup multiple={false} className="!px-0">
            {filteredNavLinks.map((link, idx) =>
              link.children ? (
                <IonAccordion
                  key={idx}
                  value={link.label}
                  toggleIconSlot="end"
                  className={isParentActive(link) ? "active-accordion" : ""}
                >
                  <IonItem
                    slot="header"
                    style={{
                      "--border-width": "0",
                      "--inner-border-width": "0",
                      "--background": isParentActive(link)
                        ? "#f97316"
                        : "transparent",
                      "--color": isParentActive(link) ? "#ffffff" : "inherit",
                      "--border-radius": "12px",
                    } as any}
                  >
                    {link.icon && (
                      <div
                        className={`rounded-md mr-2 ${
                          isParentActive(link) ? "text-white" : "text-orange-600"
                        }`}
                      >
                        {link.icon}
                      </div>
                    )}
                    <IonLabel
                      className={`!text-[1rem] ${
                        location.pathname === link.path ? "!text-orange-600" : ""
                      }`}
                    >
                      {link.label}
                    </IonLabel>
                  </IonItem>

                  <div slot="content">
                    <IonAccordionGroup multiple={true}>
                      {link.children.map((child, cIdx) =>
                        child.children ? (
                          <IonAccordion key={cIdx} value={child.label}>
                            <IonItem
                              slot="header"
                              style={{
                                "--border-width": "0",
                                "--inner-border-width": "0",
                              }}
                              className="pl-2"
                            >
                              <IonLabel
                                className={`!ml-6 !text-[1rem] ${
                                  location.pathname === child.path
                                    ? "!text-orange-600"
                                    : ""
                                }`}
                              >
                                {child.label}
                              </IonLabel>
                            </IonItem>
                            <div slot="content">
                              {child.children.map((grandChild, gIdx) => (
                                <IonItem
                                  key={gIdx}
                                  button
                                  routerLink={grandChild.path}
                                  onClick={() =>
                                    menuController.close("main-menu")
                                  }
                                  detail={false}
                                  style={{
                                    "--border-width": "0",
                                    "--inner-border-width": "0",
                                  }}
                                >
                                  <IonLabel
                                    className={`!ml-12 !text-[1rem] ${
                                      location.pathname === grandChild.path
                                        ? "!text-orange-600"
                                        : ""
                                    }`}
                                  >
                                    {grandChild.label}
                                  </IonLabel>
                                </IonItem>
                              ))}
                            </div>
                          </IonAccordion>
                        ) : (
                          <IonItem
                            key={cIdx}
                            button
                            routerLink={child.path}
                            onClick={() => menuController.close("main-menu")}
                            detail={false}
                            style={{
                              "--border-width": "0",
                              "--inner-border-width": "0",
                            }}
                          >
                            <IonLabel
                              className={`!pl-8 !text-[1rem] ${
                                location.pathname === child.path
                                  ? "!text-orange-600"
                                  : ""
                              }`}
                            >
                              {child.label}
                            </IonLabel>
                          </IonItem>
                        )
                      )}
                    </IonAccordionGroup>
                  </div>
                </IonAccordion>
              ) : (
                <IonItem
                  key={idx}
                  button
                  routerLink={link.path}
                  onClick={() => menuController.close("main-menu")}
                  detail={false}
                  style={{
                    "--border-width": "0",
                    "--inner-border-width": "0",
                    "--background":
                      location.pathname === link.path
                        ? "#f97316"
                        : "transparent",
                    "--color":
                      location.pathname === link.path ? "#ffffff" : "inherit",
                    "--border-radius": "8px",
                  } as any}
                >
                  {link.icon && (
                    <div
                      className={`rounded-md mr-2 ${
                        location.pathname === link.path
                          ? "text-white"
                          : "text-orange-600"
                      }`}
                    >
                      {link.icon}
                    </div>
                  )}
                  <IonLabel
                    className={`!text-[1rem] ${
                      location.pathname === link.path ? "!text-white" : ""
                    }`}
                  >
                    {link.label}
                  </IonLabel>
                </IonItem>
              )
            )}
          </IonAccordionGroup>
        )}
      </div>
    </div>
  );
}