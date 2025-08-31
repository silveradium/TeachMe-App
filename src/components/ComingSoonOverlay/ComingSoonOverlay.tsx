import styles from "./ComingSoonOverlay.module.scss";

export default function ComingSoonOverlay() {
  return (
    <div className="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <span className={styles.text}>Coming Soon...</span>
    </div>
  );
}
