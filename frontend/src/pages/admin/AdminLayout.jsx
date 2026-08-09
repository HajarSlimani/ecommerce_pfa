import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <AdminSidebar />
      <div className="ml-56 flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
