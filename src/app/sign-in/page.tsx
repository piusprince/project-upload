"use client";
import { SignIn } from "@clerk/nextjs"; // Clerk component for sign-in
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/UMaT-Logo-WhiteText 1.png";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignInPage() {
  const router = useRouter();

  const handleOnSignIn = () => {
    // Redirect to the home page or dashboard after successful sign-in
    router.push("/dashboard");
  };

  return (
    <div className=" flex flex-row items-center justify-center min-h-screen py-2 bg-[#004C23]">
      <div>
        <div className="relative w-full h-full">
          <Image
            src={Logo}
            width="200"
            height="200"
            alt="FYP Upload Platform logo"
            className="inline-block mb-8"
          />
          <Avatar />
          <Avatar />
          <Avatar />
          <Avatar />
          <h1 className="text-5xl font-bold tracking-tight text-white  sm:text-6xl">
            Streamline your final year project workflow with our
            <span className="text-[#FFCB06]">intuitive platform!</span>
          </h1>
        </div>
      </div>
      {/* <div className="w-[613px] h-[916px] bg-white rounded-xl">
        <h1>Login to your account</h1>
        <Tabs defaultValue="student" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Login with your student mail and your pin. You can make
                  changes when you log in to your acccount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div> */}
      <SignIn />
    </div>
  );
}
