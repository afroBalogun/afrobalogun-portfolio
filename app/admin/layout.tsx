import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary text-secondary flex">
      <AdminNav />
      <main className="flex-1 py-10 px-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}