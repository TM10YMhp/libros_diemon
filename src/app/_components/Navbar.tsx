"use client";
import { page_metadata } from "@/config";
import { useUserState, useUserUpdater } from "@/context";
import { cx, launchConfetti } from "@/utils";

export default function Navbar() {
  const { user } = useUserState();
  const { addPoints } = useUserUpdater();

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    addPoints(Math.ceil(Math.random() * 5) * 100);

    launchConfetti(event.currentTarget, {
      shapes: ["circle"],
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      particleCount: 5,
      startVelocity: 10,
      gravity: 0.7,
      ticks: 50,
    });
  };

  /* eslint-disable @next/next/no-img-element */
  return (
    <nav className="flex items-center gap-8">
      <p className="text-2xl">{String(page_metadata.title)}</p>
      <div
        className={cx(
          "cursor-pointer select-none bg-base-100 p-1",
          "border rounded-full flex flex-row gap-1",
        )}
        onClick={handleClick}
      >
        <img
          src="https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=040"
          alt="memecoin"
          width={25}
        />
        <p className="pr-2">{user?.points ?? "woof..."}</p>
      </div>
    </nav>
  );
}
