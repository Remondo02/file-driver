import Link from "next/link.js"

export function Footer() {
  return (
    <div className=" border-t h-40 bg-gray-50 mt-12 flex  items-center">
      <div className="container mx-auto flex justify-between ">
        <div>FileDrive</div>
        <Link className="text-blue-500 hover:text-blue-700" href="/privacy">
          Privacy Policy
        </Link>
        <Link
          className="text-blue-500 hover:text-blue-700"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link className="text-blue-500 hover:text-blue-700" href="/privacy">
          About
        </Link>
      </div>
    </div>
  )
}
