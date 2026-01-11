"use client";

import { useState } from "react";
import { Video } from "@/lib/video-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  questionVideo: Video;
  onNext: (isCorrect: boolean) => void;
}

export default function HardMode({ questionVideo, onNext }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;

    // 空白削除して完全一致判定
    const cleanInput = inputVal.trim();
    const cleanAnswer = questionVideo.title.trim();
    
    const correct = cleanInput === cleanAnswer;
    
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-video relative mb-6 bg-black rounded-md overflow-hidden">
          <img 
            src={questionVideo.thumbnail} 
            alt="Quiz Thumbnail" 
            className="w-full h-full object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="動画のタイトルを正確に入力してください"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isAnswered}
            className="text-lg"
          />
          {!isAnswered && (
            <Button type="submit" className="w-full">
              回答する
            </Button>
          )}
        </form>

        {isAnswered && (
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
            <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "正解！" : "不正解..."}
            </h3>
            {!isCorrect && (
              <div className="mb-4 text-left bg-white p-3 rounded border">
                <p className="text-xs text-gray-500">あなたの回答:</p>
                <p className="text-red-500 font-mono text-sm mb-2">{inputVal}</p>
                <p className="text-xs text-gray-500">正解:</p>
                <p className="text-green-600 font-bold text-sm">{questionVideo.title}</p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center items-center">
              <a 
                href={questionVideo.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 underline text-sm"
              >
                動画を開く
              </a>
              <Button onClick={() => {
                setIsAnswered(false);
                setInputVal("");
                onNext(isCorrect);
              }}>
                次の問題へ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}