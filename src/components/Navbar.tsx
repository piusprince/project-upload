import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
  OrganizationList,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="container mx-auto flex flex-wrap items-center justify-between p-6">
      <Link href="/">UMaT - FYP Upload</Link>
      <div>
        <OrganizationSwitcher />
        <UserButton />
        <SignedOut>
          <SignInButton>
            <Button>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
