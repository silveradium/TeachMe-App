import { NextSeo } from "next-seo";
import Image from "next/image";
import { HiCalendarDays } from "react-icons/hi2";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import StarIcon from "~/assets/star.png";
import { Avatar, BackButton, DashboardLayout } from "~/components";
import { Loader, LoaderSize, Tooltip } from "~/components/ui";
import { defaultAvatarSrc } from "~/lib/defaultAvatarImage";
import { api } from "~/utils/api";

import styles from "./Profile.module.scss";

export default function Profile() {
  const { data: user, isLoading: isUserLoading } = api.me.useQuery();

  return (
    <>
      <NextSeo title="Profile | TeachMe" />
      <DashboardLayout>
        <div
          className="relative flex h-full items-start bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 bg-blend-color"
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton className="relative z-10 mt-6 !text-white hover:!text-gray-100" />
          <div
            className={styles["red-strip"]}
            style={{
              backgroundImage: `url(${BackgroundPatternTransparent.src})`,
            }}
          />
          {!user || isUserLoading ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader className="text-primary-900" size={LoaderSize.Five} />
            </div>
          ) : (
            <>
              <div className="relative z-10 mx-auto flex h-[calc(100%-2rem)] max-w-xl flex-auto flex-col items-center space-y-6 rounded-b-3xl bg-white px-8 pb-24 pt-8 shadow">
                <Tooltip content={`${user.points} / ${user.pointsOfNextLevel}`} placement="right">
                  <Avatar
                    imageSrc={defaultAvatarSrc({ email: user.email, size: 240 })}
                    alt={user.name || "You"}
                    size="240"
                    levelDetails={{
                      points: user.points,
                      level: user.level,
                      pointsOfNextLevel: user.pointsOfNextLevel,
                    }}
                  />
                </Tooltip>
                <div className="flex flex-col items-center space-y-10">
                  <div className="text-center text-4xl font-bold shadow-gray-600 drop-shadow-md">
                    {user.name}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <HiCalendarDays className="h-6 w-6" aria-hidden="true" />
                      <span className="space-x-2">
                        <span>Joined:</span>
                        <span>
                          {user.createdAt.toLocaleString("en-UK", {
                            dateStyle: "short",
                          })}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Image src={StarIcon} alt="Star" className="w-7" />
                      <span>Total points: {user.points}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-8 z-10 hidden text-center text-primary-500 md:block">
                <h1 className="text-3xl font-bold">TeachMe</h1>
                <div className="text-lg">I&apos;m listening</div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
