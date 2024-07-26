import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Stream App",
  description: "An app for studying together",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="navbar">
            <div className="navbar-left">
              <Link href="/" className="navbar-brand">
                Study Stream
              </Link>
              <Link href="/profile" className="navbar-link">
                Profile
              </Link>
              <Link href="/friends" className="navbar-link">
                Friends
              </Link>
            </div>
            <nav className="navbar-right">
              <SignedOut>
                <div className="navbar-button-wrapper">
                  <SignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
