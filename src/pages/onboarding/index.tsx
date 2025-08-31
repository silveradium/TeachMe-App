import { UserStatus } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import Logo from "~/assets/logo.webp";
import { OnboardingForm } from "~/components";
import { classNames } from "~/lib/classNames";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { ssrInit } from "~/server/lib/ssr";

import styles from "./Onboarding.module.scss";

export default function Onboarding() {
  return (
    <>
      <NextSeo title="Onboarding | TeachMe" />
      <div className="bg-white">
        <div
          className={styles.container}
          style={{
            backgroundImage: `url(${BackgroundPatternTransparent.src})`,
          }}>
          <div
            className={styles.redStrip}
            style={{
              backgroundImage: `url(${BackgroundPatternTransparent.src})`,
            }}
          />
          <div className="absolute left-8 top-8 hidden text-center leading-tight text-white md:block lg:left-12 lg:top-12">
            <h1 className="text-3xl font-bold">TeachMe</h1>
            <div className="text-lg">I&apos;m listening</div>
          </div>
          <div>
            <div className={classNames("relative z-10 text-center text-xl text-white")}>
              <Image src={Logo} alt="logo" className={styles.logo} />
              <div>
                <div className={classNames("font-bold")}>Thank you for signing up!</div>
                <div className={classNames("")}>Can you give us a little more info about yourself?</div>
              </div>
            </div>
            <OnboardingForm />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const ssr = await ssrInit(ctx);

  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({ where: { id: session.user.id } });
  if (user?.status !== UserStatus.PENDING) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: { trpcState: ssr.dehydrate() } };
}
