"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pool", label: "Gamble" },
  { href: "/profile/trades", label: "Trades" },
  { href: "/profile", label: "Profile" },
];

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function VegasHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } finally {
      router.push("/login");
      router.refresh();
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-2xl font-black tracking-tight">
            Pot<span className="text-primary">zi</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden flex-wrap gap-2 sm:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors md:text-base ${
                    isActive
                      ? "bg-white/10 text-primary"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="sm:hidden">
            <Menu as="div" className="relative">
              <Menu.Button className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-sm font-semibold text-zinc-100 hover:border-zinc-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                  <div className="p-1">
                    {navItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                                isActive ? "font-semibold text-primary" : ""
                              } ${
                                active ? "bg-white/5 text-white" : "text-zinc-300"
                              }`}
                            >
                              {item.label}
                            </Link>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <Menu as="div" className="relative">
            <Menu.Button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm font-bold text-primary hover:border-zinc-500">
              <ProfileIcon />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                          active ? "bg-white/5 text-white" : "text-zinc-300"
                        }`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile/trades"
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                          active ? "bg-white/5 text-white" : "text-zinc-300"
                        }`}
                      >
                        Trades
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                          active ? "bg-red-500/20 text-red-300" : "text-red-400"
                        }`}
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? "Signing out..." : "Sign out"}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
