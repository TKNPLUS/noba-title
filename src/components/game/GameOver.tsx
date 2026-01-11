"use client";

import { useGame } from "@/components/game/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RefreshCw } from "lucide-react";

export function GameOver() {
  const { score, shuffledVideos, restartGame } = useGame();

  return (
    <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in zoom-in-95">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline">ゲームオーバー！</CardTitle>
        <CardDescription>全てのクイズが終了しました。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Trophy className="h-24 w-24 text-accent" />
        <p className="text-2xl font-semibold">
          最終スコア: {score} / {shuffledVideos.length}
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={restartGame}>
          <RefreshCw className="mr-2 h-4 w-4" />
          もう一度プレイ
        </Button>
      </CardFooter>
    </Card>
  );
}
