"use client";

import { useGame } from "@/components/game/GameContext";
import { NormalMode } from "@/components/game/NormalMode";
import { HardMode } from "@/components/game/HardMode";

export function GameContainer() {
  const { gameMode } = useGame();

  return gameMode === 'normal' ? <NormalMode /> : <HardMode />;
}
