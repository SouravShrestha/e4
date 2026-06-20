import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { StartPanel } from "@/components/landing/StartPanel";
import { Logo } from "@/components/icons/Logo";
import packageInfo from "../../package.json";

export default function Home() {
  return (
    <div
      className="relative flex min-h-[100dvh] flex-col w-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="bg-decor" aria-hidden="true">
        <div className="bg-grid" />
      </div>
      <header className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
        <div></div>
        <SettingsMenu isMainScreen={true} />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <div>
          <Logo
            style={{
              height: 72,
              width: "auto",
            }}
            primaryColor="var(--logo-primary)"
            secondaryColor="var(--logo-secondary)"
          />
        </div>
        <div className="flex w-full max-w-sm flex-col items-center text-center mt-4">
          <h1
            className="text-3xl tracking-wide sm:text-2xl leading-7 mb-0"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-uber-move)",
            }}
          >
            e4{" "}
            <span style={{ color: "var(--logo-accent)" }} className="-ml-1">
              !
            </span>
          </h1>
        </div>
        <div className="flex w-full max-w-sm flex-col items-center text-center mt-2">
          <h1
            className="text-lg tracking-wide sm:text-xl leading-7 mb-8"
            style={{
              color: "color-mix(in srgb, var(--foreground) 60%, transparent)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Ready for your next
            <br />
            great move?
          </h1>
          <StartPanel />
        </div>
      </main>

      <footer
        className="shrink-0 px-5 py-4 text-center text-xs"
        style={{ color: "var(--footer)" }}
      >
        <p
          className="text-[13px] md:text-sm mt-1 md:mt-2 whitespace-nowrap tracking-wide"
          style={{
            color: "color-mix(in srgb, var(--foreground) 60%, transparent)",
            fontFamily: "var(--font-lato)",
          }}
        >
          Made with{" "}
          <span role="img" aria-label="Love">
            ꨄ︎
          </span>{" "}
          by{" "}
          <a
            href="https://cbsdev.me"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity text-[13px] md:text-sm mt-1 md:mt-2 whitespace-nowrap tracking-wide"
            style={{
              color: "color-mix(in srgb, var(--foreground) 60%, transparent)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Sourav Shrestha
          </a>
        </p>
        <div className="text-xs mt-1" style={{ color: "color-mix(in srgb, var(--foreground) 40%, transparent)", fontFamily: "var(--font-lato)" }}>
          v {packageInfo.version}
        </div>
      </footer>
    </div>
  );
}
