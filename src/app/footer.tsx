import Link from 'next/link.js'

export function Footer() {
  const today = new Date()
  return (
    <footer className="mt-auto w-full border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          &copy; {today.getFullYear()}
          <Link href="/" className="font-medium underline underline-offset-4">
            {' '}
            Rémi Meullemeestre
          </Link>
        </p>
      </div>
    </footer>
  )
}
