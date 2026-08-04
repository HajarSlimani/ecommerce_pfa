import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminSidebar />
      <main className="flex-1 bg-surface-muted px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
