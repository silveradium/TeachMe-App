import { NextSeo } from "next-seo";
import Image from "next/image";
import DayOneDone from "~/assets/achievements/Day-One-Done.png";
import IronWill from "~/assets/achievements/Iron-Will.png";
import MomentumMaker from "~/assets/achievements/Momentum-Maker.png";
import MonthMarvel from "~/assets/achievements/Month-Marvel.png";
import PerfectlyPolished from "~/assets/achievements/Perfectly-Polished.png";
import PremiumPlayer from "~/assets/achievements/Premium-Player.png";
import RealityCheck from "~/assets/achievements/Reality-Check.png";
import SessionSensation from "~/assets/achievements/Session-Sensation.png";
import SessionSizzler from "~/assets/achievements/Session-Sizzler.png";
import SessionSlayer from "~/assets/achievements/Session-Slayer.png";
import SessionSuperstar from "~/assets/achievements/Session-Superstar.png";
import SevenDaySprinter from "~/assets/achievements/Seven-Day-Sprinter.png";
import TenSessionTitan from "~/assets/achievements/Ten-Session-Titan.png";
import TwoSessionStar from "~/assets/achievements/Two-Session-Star.png";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import { Avatar, BackButton, ComingSoonOverlay, DashboardLayout } from "~/components";
import { Loader, LoaderSize, Tooltip } from "~/components/ui";
import { defaultAvatarSrc } from "~/lib/defaultAvatarImage";
import { api } from "~/utils/api";

import styles from "./Achievements.module.scss";

export default function Achievements() {
  const { data: user, isLoading: isUserLoading } = api.me.useQuery();

  return (
    <>
      <NextSeo title="Achievements | TeachMe" />
      <DashboardLayout>
        <div className="relative overflow-hidden">
          <div
            className="relative flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 bg-blend-color"
            style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
            {!user || isUserLoading ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader size={LoaderSize.Five} />
              </div>
            ) : (
              <div className="mx-8 flex flex-auto flex-col items-center overflow-hidden shadow">
                <div className="flex w-full justify-between self-start bg-primary-700 py-4 pl-4 pr-16">
                  <div className="space-y-4">
                    <BackButton className="self-start !text-white hover:!text-gray-100" />
                    <div className="mx-8 text-3xl text-gray-50 underline decoration-gray-50">
                      Achievements
                    </div>
                  </div>
                  <Tooltip content={`${user.points} / ${user.pointsOfNextLevel}`} placement="right">
                    <Avatar
                      imageSrc={defaultAvatarSrc({ email: user.email, size: 240 })}
                      alt={user.name || "You"}
                      size="2xl"
                      levelDetails={{
                        points: user.points,
                        level: user.level,
                        pointsOfNextLevel: user.pointsOfNextLevel,
                      }}
                    />
                  </Tooltip>
                </div>
                <div className="relative flex w-full flex-auto overflow-auto bg-gray-50 bg-opacity-80 shadow">
                  <div className={styles["bottom-half"]}>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={DayOneDone} alt="Day One Done" />
                        <span className={styles["achievement-name"]}>Day One Done</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={SessionSensation} alt="Session Sensation" />
                        <span className={styles["achievement-name"]}>Session Sensation</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={SessionSizzler} alt="Session Sizzler" />
                        <span className={styles["achievement-name"]}>Session Sizzler</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={SessionSuperstar} alt="Session Superstar" />
                        <span className={styles["achievement-name"]}>Session Superstar</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={SessionSlayer} alt="Session Slayer" />
                        <span className={styles["achievement-name"]}>Session Slayer</span>
                      </div>
                    </div>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={MomentumMaker} alt="Momentum Maker" />
                        <span className={styles["achievement-name"]}>Momentum Maker</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={SevenDaySprinter} alt="Seven-Day Sprinter" />
                        <span className={styles["achievement-name"]}>Seven-Day Sprinter</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={MonthMarvel} alt="Fortnight Phenom" />
                        <span className={styles["achievement-name"]}>Fortnight Phenom</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={MonthMarvel} alt="Month Marvel" />
                        <span className={styles["achievement-name"]}>Month Marvel</span>
                      </div>
                    </div>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image
                          className={styles["images"]}
                          src={PerfectlyPolished}
                          alt="Perfectly Polished"
                        />
                        <span className={styles["achievement-name"]}>Perfectly Polished</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={RealityCheck} alt="Reality Check" />
                        <span className={styles["achievement-name"]}>Reality Check</span>
                      </div>
                    </div>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={TwoSessionStar} alt="Two-Session Star" />
                        <span className={styles["achievement-name"]}>Two-Session Star</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={TwoSessionStar} alt="Five-Session Feat" />
                        <span className={styles["achievement-name"]}>Five-Session Feat</span>
                      </div>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={TenSessionTitan} alt="Ten-Session Titan" />
                        <span className={styles["achievement-name"]}>Ten-Session Titan</span>
                      </div>
                    </div>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={PremiumPlayer} alt="Premium Player" />
                        <span className={styles["achievement-name"]}>Premium Player</span>
                      </div>
                    </div>
                    <div className={styles["div1"]}>
                      <div className={styles["badge"]}>
                        <Image className={styles["images"]} src={IronWill} alt="Iron Will" />
                        <span className={styles["achievement-name"]}>Iron Will</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ComingSoonOverlay />
        </div>
      </DashboardLayout>
    </>
  );
}
