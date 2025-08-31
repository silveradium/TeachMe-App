import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { Fragment } from "react";
import { HiBars3BottomLeft } from "react-icons/hi2";
import Logo from "~/assets/logo.webp";
import LogoutIcon from "~/assets/logout-icon";
import { Button, Loader } from "~/components/ui";
import { classNames } from "~/lib/classNames";

const userNavigation = [
  {
    name: "Profile",
    href: "/dashboard/profile",
  },
  {
    name: "Settings",
    href: "/dashboard/profile/settings",
  },
  {
    name: "Sign out",
    onClick: () => {
      void signOut();
    },
    icon: LogoutIcon,
  },
];

interface HeaderProps {
  headerContent?: JSX.Element | JSX.Element[];
  avatar?: string;
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
  showMobileMenu?: boolean;
  className?: string;
}

export default function Header({
  headerContent,
  avatar,
  setMobileMenuOpen,
  showMobileMenu = false,
  className,
}: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className={classNames("h-16 w-full", className)}>
      <div className="relative z-50 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
        {showMobileMenu && (
          <button
            type="button"
            className={classNames(
              "border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            )}
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <HiBars3BottomLeft className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
        <div className="inline-flex h-16 w-20 items-center justify-center">
          <div
            style={{ backgroundImage: `url(${Logo.src})` }}
            className="h-10 w-10 bg-contain bg-center bg-no-repeat text-white"
          />
        </div>
        <div className="flex flex-1 justify-between pr-4 sm:pr-6">
          <div className="flex-1">{headerContent}</div>
          <div
            className={classNames(
              "ml-2 items-center space-x-4 sm:ml-6 sm:space-x-6",
              showMobileMenu ? "hidden md:flex" : "flex"
            )}>
            {/* <Notifications /> */}
            {/* Profile dropdown */}
            <Menu as="div" className="relative z-50 flex-shrink-0">
              <div>
                <Menu.Button
                  as="div"
                  className="flex rounded-full bg-white text-sm hover:shadow hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  {(() => {
                    if (status === "loading") {
                      return (
                        <div>
                          <Loader />
                        </div>
                      );
                    }

                    if (!session?.user?.email) {
                      return (
                        <Link href="/login">
                          <Button>Log In</Button>
                        </Link>
                      );
                    }

                    if (!avatar) {
                      return (
                        <Link href="/dashboard">
                          <Button size="sm">Go to Dashboard</Button>
                        </Link>
                      );
                    }
                    return (
                      <Image
                        className="h-12 w-12 rounded-full"
                        src={avatar}
                        alt={session.user.name || "You"}
                        width={48}
                        height={48}
                      />
                    );
                  })()}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => {
                        const element = (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700"
                            )}>
                            <div className="flex items-center gap-2">
                              {(() => {
                                if (!item.icon) {
                                  return null;
                                }

                                const { icon: Icon } = item;
                                return <Icon className="h-5 w-5" aria-hidden="true" />;
                              })()}
                              {item.name}
                            </div>
                          </button>
                        );

                        if (item.href) {
                          return <Link href={item.href}>{element}</Link>;
                        }

                        return element;
                      }}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
