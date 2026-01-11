import { getVideos } from '@/lib/video-data';
import GameContainer from '@/components/game/GameContainer';

export default async function Home() {
  // サーバーサイド（ビルド時）にCSVを読み込む
  const videos = await getVideos();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          YouTube動画タイトル クイズ
        </h1>
        
        {/* 読み込んだ動画データをゲームに渡す */}
        <GameContainer allVideos={videos} />
      </div>
    </main>
  );
}