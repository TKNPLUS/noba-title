"use client";

import { useState, useEffect } from "react";
import { Video } from "@/lib/video-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  questionVideo: Video;
  allVideos: Video[];
  onNext: (isCorrect: boolean) => void;
}

export default function NormalMode({ questionVideo, allVideos, onNext }: Props) {
  const [choices, setChoices] = useState<Video[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 選択肢を生成する（正解1つ + ダミー3つ）
  useEffect(() => {
    setSelected(null);
    setIsCorrect(null);
    
    // 自分以外の動画からランダムに3つ選ぶ
    const others = allVideos.filter(v => v.url !== questionVideo.url);
    const dummies = [];
    for (let i = 0; i < 3; i++) {
      if (others.length === 0) break;
      const idx = Math.floor(Math.random() * others.length);
      dummies.push(others[idx]);
      others.splice(idx, 1); // 重複しないように削除
    }
    
    // 正解と混ぜてシャッフル
    const list = [questionVideo, ...dummies].sort(() => Math.random() - 0.5);
    setChoices(list);
  }, [questionVideo, allVideos]);

  const handleAnswer = (video: Video) => {
    if (selected) return; // 回答済みなら何もしない
    
    const correct = video.url === questionVideo.url;
    setSelected(video.url);
    setIsCorrect(correct);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-video relative mb-6 bg-black rounded-md overflow-hidden">
          {/* サムネイル表示 */}
          <img 
            src={questionVideo.thumbnail} 
            alt="Quiz Thumbnail" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice) => {
            // 色付けロジック
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
            if (selected) {
              if (choice.url === questionVideo.url) variant = "default"; // 正解は常に緑（あるいは強調）
              else if (choice.url === selected && !isCorrect) variant = "destructive"; // 間違えた選択は赤
            }

            return (
              <Button
                key={choice.url}
                variant={variant}
                className={`h-auto py-3 px-4 text-left justify-start whitespace-normal ${
                   selected && choice.url === questionVideo.url ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""
                }`}
                onClick={() => handleAnswer(choice)}
                disabled={!!selected}
              >
                {choice.title}
              </Button>
            );
          })}
        </div>

        {/* 結果表示エリア */}
        {selected && (
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
            <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? "正解！" : "残念..."}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              正解は: <strong>{questionVideo.title}</strong>
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href={questionVideo.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 underline text-sm flex items-center"
              >
                YouTubeで動画を見る
              </a>
              <Button onClick={() => onNext(!!isCorrect)}>
                次の問題へ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}