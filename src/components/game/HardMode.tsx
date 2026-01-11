"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "@/components/game/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export function HardMode() {
  const { score, currentIndex, shuffledVideos, submitGuess, nextQuestion, currentVideo } = useGame();
  const [guess, setGuess] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!guess.trim() || showFeedback) return;

    const correct = submitGuess(guess);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setGuess("");
    nextQuestion();
  };
  
  if (!currentVideo) return null;

  return (
    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline tracking-tight">ハードモード</CardTitle>
        <CardDescription>このサムネイルの動画タイトルは？</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 overflow-hidden rounded-lg border shadow-sm">
          <Image
            key={currentVideo.URL}
            src={currentVideo.Thumbnail}
            alt="YouTube Thumbnail"
            width={480}
            height={360}
            className="aspect-video w-full object-cover"
            priority
          />
        </div>

        {showFeedback ? (
          <div className="flex flex-col items-center gap-4 rounded-lg p-4 mb-4 animate-in fade-in-50">
            <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 className="h-8 w-8 text-chart-2" /> : <XCircle className="h-8 w-8 text-destructive" />}
                <p className={`text-xl font-semibold ${isCorrect ? 'text-chart-2' : 'text-destructive'}`}>{isCorrect ? "正解！" : "不正解"}</p>
            </div>
             <div className="text-center text-sm text-muted-foreground">
                <p>正解は:</p>
                <Link href={currentVideo.URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-foreground hover:underline">
                    {currentVideo.Title}
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>
            <Button onClick={handleNext} className="mt-2">次の問題へ</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="タイトルを正確に入力..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={showFeedback}
              className="text-base"
              aria-label="Your guess for the title"
            />
            <Button type="submit" disabled={showFeedback || !guess.trim()}>回答する</Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-medium text-muted-foreground">スコア: <span className="font-bold text-accent">{score}</span></p>
        <p className="text-sm text-muted-foreground">
          {`問題 ${currentIndex + 1} / ${shuffledVideos.length}`}
        </p>
      </CardFooter>
    </Card>
  );
}
