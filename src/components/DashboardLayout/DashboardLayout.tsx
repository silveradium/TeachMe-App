import { Dialog, Transition } from "@headlessui/react";
import { UserStatus } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode, SVGProps } from "react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import AchievementsIcon from "~/assets/achievements.png";
import ChaptersIcon from "~/assets/chapters-icon";
import DashboardIcon from "~/assets/dashboard-icon";
import Logo from "~/assets/logo.webp";
import SessionRecordsIcon from "~/assets/session-records-icon";
import SessionsIcon from "~/assets/sessions-icon";
import SettingsIcon from "~/assets/settings-icon";
import { Header } from "~/components";
import SidebarButton from "~/components/DashboardLayout/SidebarButton";
import { Button, Tooltip, TooltipTheme } from "~/components/ui";
import { classNames } from "~/lib/classNames";
import matchPath from "~/lib/matchPath";
import { api } from "~/utils/api";

function useRedirectToLoginIfUnauthenticated() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace({
        pathname: "/login",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);
}
function useRedirectToOnboardingIfNeeded() {
  const router = useRouter();
  const query = api.me.useQuery(undefined, {
    retry(failureCount) {
      return failureCount > 3;
    },
  });

  useEffect(() => {
    if (query.data?.status === UserStatus.PENDING) {
      void router.replace({
        pathname: "/onboarding",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.status]);

  return {
    user: query.data,
  };
}

export interface NavigationItem {
  icon: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | StaticImageData;
  current: boolean;
  href: string;
  name: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  headerContent?: JSX.Element | JSX.Element[];
  className?: string;
}

export default function DashboardLayout({ children, headerContent, className }: DashboardLayoutProps) {
  useRedirectToLoginIfUnauthenticated();
  const { user } = useRedirectToOnboardingIfNeeded();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = useCallback(
    (pattern: string) => {
      return !!matchPath(pattern, router.pathname);
    },
    [router.pathname]
  );

  const sidebarNavigation = useMemo<NavigationItem[]>(
    () => [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: DashboardIcon,
        current: isActive("/dashboard"),
      },
      {
        name: "Session",
        href: `/dashboard/sessions/${user?.activeSessionRecordId || "new"}`,
        icon: SessionsIcon,
        current: isActive("/dashboard/sessions/:id/*"),
      },
      {
        name: "Session records",
        href: "/dashboard/sessions",
        icon: SessionRecordsIcon,
        current: isActive("/dashboard/sessions"),
      },
      {
        name: "Chapters",
        href: "/dashboard/chapters",
        icon: ChaptersIcon,
        current: isActive("/dashboard/chapters"),
      },
      {
        name: "Achievements",
        href: "/dashboard/achievements",
        icon: AchievementsIcon,
        current: isActive("/dashboard/achievements"),
      },
      {
        name: "Settings",
        href: "/dashboard/profile/settings",
        icon: SettingsIcon,
        current: isActive("/dashboard/profile/settings"),
      },
    ],
    [isActive, user?.activeSessionRecordId]
  );
  const [mainNavigation, settingsNavigation] = useMemo(
    () => [sidebarNavigation.slice(0, -1), sidebarNavigation[sidebarNavigation.length - 1]],
    [sidebarNavigation]
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Narrow sidebar */}
      <div className="fixed bottom-0 left-0 z-30 hidden h-[calc(100vh-4rem)] w-20 overflow-y-auto overflow-x-hidden bg-primary-700 md:block">
        <div className="flex h-full w-full flex-col items-center py-6">
          <div className="flex w-full flex-1 flex-col items-center gap-y-2">
            <div className="flex w-full flex-1 flex-col items-center gap-y-2">
              {mainNavigation.map((item) => (
                <Tooltip key={item.name} content={item.name} theme={TooltipTheme.Dark} placement="right">
                  <SidebarButton
                    {...item}
                    className={classNames(
                      item.current
                        ? "bg-primary-700 text-white"
                        : "text-primary-100 hover:bg-primary-700 hover:text-white",
                      "group flex h-20 w-20 flex-col items-center justify-center rounded-md p-3 text-xs font-medium"
                    )}
                  />
                </Tooltip>
              ))}
            </div>
            <div className="flex w-full flex-col items-center justify-center">
              {settingsNavigation && (
                <Tooltip content={settingsNavigation.name} theme={TooltipTheme.Dark} placement="right">
                  <SidebarButton
                    {...settingsNavigation}
                    className={classNames(
                      settingsNavigation.current
                        ? "bg-primary-700 text-white"
                        : "text-primary-100 hover:bg-primary-700 hover:text-white",
                      "group flex h-20 w-20 flex-col items-center justify-center rounded-md p-3 text-xs font-medium"
                    )}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex w-screen max-w-xs flex-1 flex-col bg-white pb-4 pt-5 sm:w-full">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute right-3 top-1 ml-4 flex pr-2 pt-4 sm:right-0 sm:-mr-12 sm:p-1">
                    <button
                      type="button"
                      className="rounded-md bg-gray-50 text-primary-700 ring-2 ring-primary-300 hover:text-primary-900 focus:outline-none sm:text-gray-500 sm:hover:text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}>
                      <span className="sr-only">Close panel</span>
                      <HiXMark className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="ml-4 flex w-fit flex-shrink-0 items-center px-2.5 py-2.5">
                  <div
                    style={{
                      backgroundImage: `url(${Logo.src})`,
                    }}
                    className="h-9 w-9 bg-contain bg-center bg-no-repeat text-white"
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                  <nav className="flex flex-1 flex-col pb-4">
                    <div className="space-y-1">
                      {sidebarNavigation.map((item) => (
                        <SidebarButton
                          key={item.name}
                          {...item}
                          className={classNames(
                            item.current
                              ? "bg-primary-50 border-primary-500 text-primary-700"
                              : "border-transparent text-gray-500 hover:border-primary-500 hover:bg-gray-50 hover:text-gray-700",
                            "block border-l-4 py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6",
                            "group flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium"
                          )}
                          mobile>
                          <span>{item.name}</span>
                        </SidebarButton>
                      ))}
                    </div>
                  </nav>
                  <div className="flex-1 border-t border-gray-200 pb-3 pt-4">
                    <div className="flex items-center gap-2.5 px-4 sm:px-6">
                      {(() => {
                        if (!user?.email) {
                          return (
                            <Link href="/login">
                              <Button>Log In</Button>
                            </Link>
                          );
                        }

                        if (!user.avatar) {
                          return (
                            <Link href="/dashboard">
                              <Button size="sm">Go to Dashboard</Button>
                            </Link>
                          );
                        }
                        return (
                          <Image
                            className="h-12 w-12 rounded-full"
                            src={user.avatar}
                            alt={user.name || "You"}
                            width={48}
                            height={48}
                          />
                        );
                      })()}
                      <div>
                        <div className="text-base font-medium text-gray-800">{/* {user?.name} */}</div>
                        <div className="text-sm font-medium text-gray-500">{/* {user?.email} */}</div>
                      </div>
                      {/* <Notifications /> */}
                    </div>
                    <div className="mt-3 space-y-1">
                      <button
                        className="block rounded-sm px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                        onClick={() => {
                          void signOut();
                        }}>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Header
        avatar={user?.avatar}
        headerContent={headerContent}
        showMobileMenu
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <main
        className={classNames(
          "flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden md:ml-20 md:w-[calc(100vw-5rem)]",
          className
        )}>
        {/* Main content */}
        {children}
      </main>

      {/* Toasts */}
      <div>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
