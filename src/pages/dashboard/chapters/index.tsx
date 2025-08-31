import Image from "next/image";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import InProgressIcon from "~/assets/in-progress.png";
import TickIcon from "~/assets/tick.png";
import { BackButton, ComingSoonOverlay, DashboardLayout } from "~/components";
import { Button } from "~/components/ui";
import { classNames } from "~/lib/classNames";

import styles from "./Chapters.module.scss";

export default function Chapters() {
  return (
    <DashboardLayout>
      <div className="relative h-full overflow-hidden">
        <div
          className={classNames(
            "flex h-full flex-col space-y-4 bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 pt-6 bg-blend-color"
          )}
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton />
          <div className={classNames(styles["left"])}>
            <div className={classNames(styles["chapters"])}>
              <span className={classNames(styles["chapters-title"])}>Chapters</span>

              <Button className={classNames(styles["new-chapter-text"])}>Start New Chapter</Button>
              {chaptersPlaceholder.map((chapter, index) => {
                return (
                  <div key={index} className={classNames(styles["chapter"], "bg-white")}>
                    {chapter.done ? (
                      <Image src={TickIcon} alt="Done" className={classNames(styles["icon"])} />
                    ) : (
                      <Image src={InProgressIcon} alt="In Progress" className={classNames(styles["icon"])} />
                    )}
                    <span>{chapter.title}</span>
                    <span>{chapter.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ComingSoonOverlay />
      </div>
    </DashboardLayout>
  );
}

const chaptersPlaceholder = [
  {
    title: "Evolutionary biology",
    date: "2020/04/09",
    done: true,
  },
  {
    title: "Artificial neural networks",
    date: "2022/04/08",
    done: false,
  },
  {
    title: "Quantum mechanics",
    date: "2022/02/15",
    done: false,
  },
  {
    title: "DNA sequencing",
    date: "2022/02/02",
    done: true,
  },
  {
    title: "Climate change",
    date: "2022/01/23",
    done: true,
  },
];
