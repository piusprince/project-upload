import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="container mx-auto flex flex-wrap items-center justify-between p-6">
      <h1>UMaT - FYP Upload</h1>
      <div>
        <OrganizationSwitcher />
        <UserButton />
        <SignedOut>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
