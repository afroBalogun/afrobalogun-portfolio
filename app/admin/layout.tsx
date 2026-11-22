import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-cream text-ink flex font-inter">
      <AdminNav />
      <main className="flex-1 min-w-0 px-6 md:px-12 py-10 md:py-14">
        {children}
      </main>
    </div>
  )
}
