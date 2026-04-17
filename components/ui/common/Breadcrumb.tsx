// Breadcrumb.tsx
import { ChevronRightIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { navLinks } from '../../pages/Tabs';

type NavLink = {
  path?: string;
  label: string;
  resource: string | string[];
  icon?: React.ReactNode;
  children?: NavLink[];
};


type BreadcrumbItem = { label: string; path?: string };

const findBreadcrumb = (
  links: NavLink[],
  pathname: string,
  trail: BreadcrumbItem[] = []
): BreadcrumbItem[] | null => {
  for (const link of links) {
    const current = [...trail, { label: link.label, path: link.path }];
    if (link.path && link.path === pathname) return current;
    if (link.children) {
      const found = findBreadcrumb(link.children, pathname, current);
      if (found) return found;
    }
  }
  return null;
};

const Breadcrumb = () => {
  const location = useLocation();
  let crumbs: BreadcrumbItem[]

  if (location.pathname === '/dashboard/client') {
    crumbs = [
      { label: 'Manage Account' },
    ]
  } else {
    crumbs =
      findBreadcrumb(navLinks, location.pathname) ?? [
        { label: 'Dashboard', path: '/dashboard/home' },
      ]
  }

  return (
    <div className=" hidden md:flex flex-wrap items-center gap-1">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRightIcon size={13} className="text-gray-400 shrink-0" />
            )}
            <span
              className={` text-xs md:text-sm ${
                isLast
                  ? 'text-gray-700 font-medium'
                  : 'text-gray-500 font-normal'
              }`}
            >
              {crumb.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;