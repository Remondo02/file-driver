import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import Image from "next/image.js"
import Link from "next/link.js"

export function Header() {
  return (
    <header className="relative top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16  items-center justify-between gap-7 space-x-4 px-2 sm:space-x-0">
        <Link href="/" className="flex gap-2 items-center text-xl">
          <Image src="/logo.png" width="40" height="40" alt="file dirve logo" />
          FileDrive
        </Link>

        <SignedIn>
          <Button variant="outline">
            <Link href="/dashboard/files">Your Files</Link>
          </Button>
        </SignedIn>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
