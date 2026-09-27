import Link from 'next/link';

const nav = [
  { label: 'Dashboard', href: '/admin' },
  { group: 'Content' },
  { label: 'Destinations', href: '/admin/destinations' },
  { label: 'Packages', href: '/admin/packages' },
  { label: 'Hotels', href: '/admin/hotels' },
  { label: 'Activities', href: '/admin/activities' },
  { group: 'Bookings' },
  { label: 'All Bookings', href: '/admin/bookings' },
  { group: 'Marketing' },
  { label: 'Coupons', href: '/admin/coupons' },
  { label: 'Newsletter', href: '/admin/newsletter' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[80vh] max-w-6xl mx-auto">
      <aside className="w-56 border-r border-gray-100 p-4 text-sm">
        {nav.map((item, i) =>
          'group' in item ? (
            <div key={i} className="text-[11px] uppercase tracking-wide text-gray-400 font-bold mt-5 mb-1 first:mt-0">
              {item.group}
            </div>
          ) : (
            <Link key={item.href} href={item.href!} className="block py-1.5 px-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              {item.label}
            </Link>
          )
        )}
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
