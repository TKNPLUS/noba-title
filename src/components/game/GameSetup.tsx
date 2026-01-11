"use client";

import { useGame } from "@/components/game/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function GameSetup() {
  const { gameMode, setGameMode, difficulty, setDifficulty, startGame, error, videos } = useGame();

  return (
    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline tracking-tight">ゲーム設定</CardTitle>
        <CardDescription>モードと難易度を選択してゲームを開始してください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="game-mode" className="text-base">ゲームモード</Label>
          <RadioGroup
            id="game-mode"
            value={gameMode}
            onValueChange={(value) => setGameMode(value as "normal" | "hard")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="r1" />
              <Label htmlFor="r1">通常</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="r2" />
              <Label htmlFor="r2">ハード</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            {gameMode === 'normal' ? '4つの選択肢から正解を選びます。' : '動画タイトルを正確に入力します。'}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-base">難易度 (ランキング)</Label>
          <Select
            value={String(difficulty)}
            onValueChange={(value) => setDifficulty(Number(value) as 10 | 25 | 50 | 100)}
          >
            <SelectTrigger id="difficulty" className="w-full">
              <SelectValue placeholder="難易度を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">上位10%</SelectItem>
              <SelectItem value="25">上位25%</SelectItem>
              <SelectItem value="50">上位50%</SelectItem>
              <SelectItem value="100">全て</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {`ゲームに表示される動画の範囲 (全 ${videos.length} 件中)`}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startGame} className="w-full" disabled={!!error}>ゲーム開始</Button>
      </CardFooter>
    </Card>
  );
}
