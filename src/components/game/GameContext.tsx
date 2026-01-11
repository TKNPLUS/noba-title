"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { Video } from '@/lib/video-data';

type GameMode = "normal" | "hard";
type GameState = "setup" | "playing" | "finished";
type Difficulty = 10 | 25 | 50 | 100;

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

interface GameContextType {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  gameState: GameState;
  gameMode: GameMode;
  difficulty: Difficulty;
  score: number;
  currentIndex: number;
  shuffledVideos: Video[];
  currentVideo: Video | null;
  isGameOver: boolean;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  submitGuess: (guess: string) => boolean;
  nextQuestion: () => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [shuffledVideos, setShuffledVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("setup");
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [difficulty, setDifficulty] = useState<Difficulty>(10);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/all_videos_ranking.csv');
        if (!response.ok) {
          throw new Error('CSVファイルの取得に失敗しました。publicフォルダに all_videos_ranking.csv を配置してください。');
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            const typedData = results.data as Video[];
            setVideos(typedData);
            setIsLoading(false);
          },
          error: (err: any) => {
            console.error("CSV Parse Error:", err);
            setError(`CSVの解析中にエラーが発生しました: ${err.message}`);
            setIsLoading(false);
          }
        });
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const startGame = useCallback(() => {
    const totalVideos = videos.length;
    const videosToInclude = Math.ceil(totalVideos * (difficulty / 100));
    const topVideos = videos.slice(0, videosToInclude);
    setShuffledVideos(shuffleArray(topVideos));
    setCurrentIndex(0);
    setScore(0);
    setGameState("playing");
  }, [videos, difficulty]);

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const submitGuess = useCallback((guess: string): boolean => {
    const correct = guess.trim().toLowerCase() === shuffledVideos[currentIndex]?.Title.trim().toLowerCase();
    if (correct) {
      setScore(prev => prev + 1);
    }
    return correct;
  }, [currentIndex, shuffledVideos]);


  const restartGame = useCallback(() => {
    setGameState("setup");
  }, []);

  useEffect(() => {
    if (gameState === "playing" && currentIndex >= shuffledVideos.length) {
      setGameState("finished");
    }
  }, [currentIndex, shuffledVideos.length, gameState]);

  const currentVideo = useMemo(() => {
    return gameState === 'playing' && currentIndex < shuffledVideos.length
      ? shuffledVideos[currentIndex]
      : null;
  }, [gameState, currentIndex, shuffledVideos]);

  const isGameOver = useMemo(() => {
    return gameState === 'finished';
  }, [gameState]);


  const value = {
    videos,
    isLoading,
    error,
    gameState,
    gameMode,
    difficulty,
    score,
    currentIndex,
    shuffledVideos,
    currentVideo,
    isGameOver,
    setGameMode,
    setDifficulty,
    startGame,
    submitGuess,
    nextQuestion,
    restartGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
