"use client";

import { useGame } from "@/components/game/GameContext";
import { GameContainer } from "@/components/game/GameContainer";
import { GameOver } from "@/components/game/GameOver";
import { GameSetup } from "@/components/game/GameSetup";
import { LoadingSpinner } from "@/components/game/LoadingSpinner";

export function Game() {
  const { gameState, isLoading, videos } = useGame();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (gameState === "setup" || videos.length === 0) {
    return <GameSetup />;
  }

  if (gameState === "playing") {
    return <GameContainer />;
  }

  if (gameState === "finished") {
    return <GameOver />;
  }

  return <GameSetup />;
}
