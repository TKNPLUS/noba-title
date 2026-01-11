"use client";

import { Game } from "@/components/game/Game";
import { GameProvider } from "@/components/game/GameContext";

export default function Home() {
  return (
    <GameProvider>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
        <Game />
      </main>
    </GameProvider>
  );
}
