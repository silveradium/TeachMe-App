import Image from "next/image";
import Link from "next/link";
import AchievementsScreenshot from "~/assets/achievements-screenshot.webp";
import BackgroundPatternRedScreenshot from "~/assets/background-pattern-red.webp";
import CurrentSessionScreenshot from "~/assets/current-session-screenshot.webp";
import FacebookIcon from "~/assets/facebook-icon";
import HomePageScreenshot from "~/assets/home-page-screenshot.webp";
import InstagramIcon from "~/assets/instagram-icon";
import MailIcon from "~/assets/mail-icon";
import NewSessionScreenshot from "~/assets/new-session-screenshot.webp";
import PhoneIcon from "~/assets/phone-icon";
import SessionRecordsScreenshot from "~/assets/session-records-screenshot.webp";
import SessionSummaryScreenshot from "~/assets/session-summary-screenshot.webp";
import SubscriptionPlansScreenshot from "~/assets/subscription-plans-screenshot.webp";
import { Header } from "~/components";
import type { CarouselImage } from "~/components/ui";
import { Button, Carousel } from "~/components/ui";
import { SOCIALS } from "~/lib/constants";

const SCREENSHOTS: CarouselImage[] = [
  {
    src: HomePageScreenshot,
    alt: "Home page",
    description: "Press the speaker button and start a new session",
  },
  {
    src: NewSessionScreenshot,
    alt: "New session",
    description: "Enter the topic you want to talk about and hit next",
  },
  {
    src: CurrentSessionScreenshot,
    alt: "Current session",
    description: "Start talking and answering to your student. When you’re done you can review the session",
  },
  {
    src: SessionSummaryScreenshot,
    alt: "Session summary",
    description: "Go through each of the review points",
  },
  {
    src: SessionRecordsScreenshot,
    alt: "Session records",
    description: "You can also view your past sessions in the session records",
  },
  {
    src: AchievementsScreenshot,
    alt: "Achievements",
    description: "Earn various badges as you broaden your knowledge (to be added)",
  },
];

export default function LandingPage() {
  return (
    <>
      <main className="flex max-h-screen flex-col overflow-hidden">
        <Header className="flex-1" />
        <div
          className="fixed left-0 top-16 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${BackgroundPatternRedScreenshot.src})`,
          }}
        />
        <div className="relative flex flex-auto flex-wrap overflow-auto text-dark lg:overflow-hidden">
          <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center px-16 py-8 text-white lg:w-1/2">
            <Carousel images={SCREENSHOTS} label="App screenshots" hideThumbnails />
            <div className="absolute bottom-10 left-16">
              <h1 className="text-3xl font-bold">TeachMe</h1>
              <div className="text-center">I&apos;m listening</div>
            </div>
          </div>
          <div className="z-10 w-full overflow-hidden text-center lg:h-[calc(100vh-4rem)] lg:max-h-full lg:w-1/2 lg:overflow-auto">
            <div className="w-full bg-white lg:rounded-tl-[40px]">
              <div className="relative mx-auto h-[calc(100vh-4rem)] max-w-lg space-y-20 py-44">
                <div className="space-y-14">
                  <h1 className="text-4xl font-bold">The Feynman Technique</h1>
                  <div className="text-2xl">
                    The Feynman Technique is considered to be one of the most effective learning techniques
                    out there. It uses a simple 4-step process for understanding any topic or concept quickly
                    and effectively.
                    <br />
                    Try it with us!
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/signup">
                    <Button className="text-xl">Sign up It&apos;s free</Button>
                  </Link>
                  <div className="text-sm">
                    <div>Already have an account?</div>
                    <Link href="/login">
                      <Button variant="secondary">Login here</Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex h-[calc(100vh-16rem)] w-full flex-col">
                <div className="mx-auto flex-auto space-y-8">
                  <h1 className="text-2xl font-bold">Our Subscription Plans</h1>
                  <Image src={SubscriptionPlansScreenshot} alt="Our Subscription Plans" />
                </div>
              </div>
            </div>
            <div className="flex-1 justify-between space-y-8 bg-white bg-opacity-10 py-4 pl-24 pr-48 text-white">
              <div className="space-y-2">
                <div className="text-left">Contact us:</div>
                <div className="flex justify-between pl-12">
                  <div className="inline-flex gap-x-8">
                    <a
                      href={`tel:${SOCIALS.phone.split(" ").join("")}`}
                      className="inline-flex items-center gap-x-2 hover:underline">
                      <PhoneIcon className="w-4.5 h-4.5" aria-hidden="true" />
                      <span>{SOCIALS.phone}</span>
                    </a>
                    <a
                      href={`mailto:${SOCIALS.email}`}
                      className="inline-flex items-center gap-x-2 hover:underline">
                      <MailIcon className="w-4.5 h-4.5" aria-hidden="true" />
                      <span>{SOCIALS.email}</span>
                    </a>
                  </div>
                  <div className="inline-flex items-center gap-x-2">
                    <a href={SOCIALS.instagram} target="_blank" rel="noreferrer noopener">
                      <InstagramIcon className="w-4.5 h-4.5" aria-hidden="true" />
                    </a>
                    <a href={SOCIALS.facebook} target="_blank" rel="noreferrer noopener">
                      <FacebookIcon className="w-4.5 h-4.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mx-auto inline-flex gap-x-20">
                <Link href="/" className="hover:underline">
                  Terms and Conditions
                </Link>
                <Link href="/" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
