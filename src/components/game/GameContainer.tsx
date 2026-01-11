"use client";

import { useState, useEffect } from "react";
import { Video } from "@/lib/video-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import NormalMode from "./NormalMode";
import HardMode from "./HardMode";

interface GameContainerProps {
  allVideos: Video[];
}

export default function GameContainer({ allVideos }: GameContainerProps) {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [mode, setMode] = useState<'normal' | 'hard'>('normal');
  const [rangePercent, setRangePercent] = useState<number[]>([20]); // デフォルトは上位20%
  const [currentQuestion, setCurrentQuestion] = useState<Video | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // ゲーム開始処理
  const startGame = () => {
    if (allVideos.length === 0) return;
    setScore(0);
    setQuestionCount(0);
    nextQuestion();
    setGameState('playing');
  };

  // 次の問題を作成
  const nextQuestion = () => {
    // 範囲設定に基づいて動画をフィルタリング
    // percent: 100なら全動画、10なら上位10%
    const limitIndex = Math.floor(allVideos.length * (rangePercent[0] / 100));
    const candidateVideos = allVideos.slice(0, Math.max(1, limitIndex));

    // ランダムに1つ選ぶ
    const randomIndex = Math.floor(Math.random() * candidateVideos.length);
    setCurrentQuestion(candidateVideos[randomIndex]);
    setQuestionCount(prev => prev + 1);
  };

  // セットアップ画面（難易度設定）
  if (gameState === 'setup') {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>ゲーム設定</CardTitle>
          <CardDescription>モードと難易度を選んでください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* モード選択 */}
          <div className="space-y-3">
            <Label className="text-base font-bold">モード選択</Label>
            <RadioGroup defaultValue="normal" onValueChange={(v) => setMode(v as 'normal' | 'hard')}>
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="normal" id="r-normal" />
                <Label htmlFor="r-normal" className="cursor-pointer flex-1">
                  通常モード <span className="text-xs text-gray-500 block">4つの選択肢から選ぶ</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="hard" id="r-hard" />
                <Label htmlFor="r-hard" className="cursor-pointer flex-1">
                  ハードモード <span className="text-xs text-gray-500 block">タイトルを完全一致で入力</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 難易度（範囲）設定 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-base font-bold">出題範囲 (難易度)</Label>
              <span className="text-sm text-blue-600 font-bold">上位 {rangePercent[0]}% から出題</span>
            </div>
            <Slider
              defaultValue={[20]}
              max={100}
              min={1}
              step={1}
              onValueChange={setRangePercent}
              className="py-4"
            />
            <p className="text-xs text-gray-500">
              ※数字が小さいほど「有名な動画」のみが出題されます（簡単）。<br/>
              ※数字を大きくすると「マニアックな動画」も含まれます（難しい）。
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-2 text-center">
              読み込み済み動画数: {allVideos.length}本
            </p>
            <Button onClick={startGame} className="w-full text-lg py-6" disabled={allVideos.length === 0}>
              ゲームスタート！
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // プレイ画面
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <Button variant="outline" size="sm" onClick={() => setGameState('setup')}>
          設定に戻る
        </Button>
        <div className="text-right">
          <p className="font-bold">問目: {questionCount}</p>
          <p className="text-sm text-gray-500">スコア: {score}</p>
        </div>
      </div>

      {currentQuestion && mode === 'normal' && (
        <NormalMode 
          questionVideo={currentQuestion} 
          allVideos={allVideos} 
          onNext={(isCorrect) => {
            if(isCorrect) setScore(s => s + 1);
            nextQuestion();
          }} 
        />
      )}

      {currentQuestion && mode === 'hard' && (
        <HardMode 
          questionVideo={currentQuestion} 
          onNext={(isCorrect) => {
            if(isCorrect) setScore(s => s + 1);
            nextQuestion();
          }} 
        />
      )}
    </div>
  );
}