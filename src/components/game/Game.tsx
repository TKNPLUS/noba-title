"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { videoData, type Video } from "@/lib/video-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Trophy, RefreshCw } from "lucide-react";

const shuffleArray = (array: Video[]): Video[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function Game() {
  const [shuffledVideos, setShuffledVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setShuffledVideos(shuffleArray(videoData));
    setIsMounted(true);
  }, []);

  const currentVideo = useMemo(() => {
    return shuffledVideos[currentIndex];
  }, [shuffledVideos, currentIndex]);

  const isGameOver = useMemo(() => {
    if (!isMounted) return false;
    return currentIndex >= shuffledVideos.length;
  }, [currentIndex, shuffledVideos.length, isMounted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!guess.trim() || showFeedback) return;

    const correct = guess.trim().toLowerCase() === currentVideo.title.trim().toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setGuess("");
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleRestart = () => {
    setShuffledVideos(shuffleArray(videoData));
    setCurrentIndex(0);
    setScore(0);
    setGuess("");
    setShowFeedback(false);
  };

  if (!isMounted) {
    return (
        <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
            </CardHeader>
            <CardContent>
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-1/4 rounded-md" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <Skeleton className="h-6 w-1/4 rounded-md" />
                 <Skeleton className="h-4 w-1/3 rounded-md" />
            </CardFooter>
        </Card>
    );
  }

  if (isGameOver) {
    return (
      <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Game Over!</CardTitle>
          <CardDescription>You've completed all the questions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Trophy className="h-24 w-24 text-accent" />
          <p className="text-2xl font-semibold">
            Your Final Score: {score} / {shuffledVideos.length}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline tracking-tight">Thumbnail Title Guesser</CardTitle>
        <CardDescription>Guess the title of the YouTube video below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 overflow-hidden rounded-lg border shadow-sm">
          <Image
            key={currentVideo.url}
            src={currentVideo.thumbnail}
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
                <p className={`text-xl font-semibold ${isCorrect ? 'text-chart-2' : 'text-destructive'}`}>{isCorrect ? "Correct!" : "Incorrect!"}</p>
            </div>
            {!isCorrect && (
                <p className="text-center text-sm text-muted-foreground">
                The correct title was: <strong className="font-bold text-foreground">{currentVideo.title}</strong>
                </p>
            )}
            <Button onClick={handleNext} className="mt-2">Next Question</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={showFeedback}
              className="text-base"
              aria-label="Your guess for the title"
            />
            <Button type="submit" disabled={showFeedback || !guess.trim()}>Guess</Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-medium text-muted-foreground">Score: <span className="font-bold text-accent">{score}</span></p>
        <p className="text-sm text-muted-foreground">
          {`Question ${currentIndex + 1} / ${shuffledVideos.length}`}
        </p>
      </CardFooter>
    </Card>
  );
}
