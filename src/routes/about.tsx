import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <h1>About Us</h1>
      <p>
        Welcome to our world! 🌟 This site is a growing multi-app platform built to simplify and
        enhance your digital life. Right now, you can enjoy several useful and fun apps, including:
        <p> ✅ Todo App to help you plan and organize your day </p>
        <p>☁️ Weather App for quick, accurate weather updates</p>
        <p>🎮 Tic Tac Toe Game for a bit of light, casual fun We're just getting started,</p>
        and we have many more exciting apps planned for the future—designed.
      </p>
    </div>
  );
}
