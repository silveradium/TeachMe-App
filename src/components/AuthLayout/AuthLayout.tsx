import Image from "next/image";
import BackgroundPatternRedScreenshot from "~/assets/background-pattern-red.webp";
import Logo from "~/assets/logo.webp";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex max-h-screen flex-col overflow-hidden">
      <div
        className="fixed left-0 top-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BackgroundPatternRedScreenshot.src})`,
        }}
      />
      <div className="relative flex flex-auto flex-wrap overflow-auto text-dark lg:overflow-hidden">
        <div className="relative hidden h-screen w-full items-center justify-center px-16 py-8 text-white lg:flex lg:w-1/2">
          <div className="space-y-2">
            <Image src={Logo} alt="TeachMe" className="h-64 w-64" aria-hidden="true" />
            <div className="text-center">
              <h1 className="text-5xl font-bold">TeachMe</h1>
              <div className="text-2xl">I&apos;m listening</div>
            </div>
          </div>
        </div>
        <div className="z-10 w-full overflow-hidden lg:max-h-full lg:w-1/2 lg:overflow-auto">
          <div className="w-full bg-white lg:rounded-l-[40px]">{children}</div>
        </div>
      </div>
    </main>
  );
}
