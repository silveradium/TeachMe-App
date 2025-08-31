import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("light")}>Set to Light</button>
      <button onClick={() => setTheme("dark")}>Set to Dark</button>
      <button onClick={() => setTheme("system")}>Set to System</button>
    </div>
  );
}
