import { SideNav } from './side-nav'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="container mx-auto mb-12 pt-12">
      <div className="flex gap-8">
        <SideNav />
        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
