import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import type { FC, ReactNode } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className={poppins.className}>{children}</main>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
