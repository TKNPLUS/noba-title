import fs from 'fs';
import path from 'path';

export interface Video {
  rank: number;
  title: string;
  viewCount: number;
  url: string;
  thumbnail: string;
  publishedAt: string;
  duration: number;
}

export async function getVideos(): Promise<Video[]> {
  // ビルド時(サーバー側)で実行されるパス
  const filePath = path.join(process.cwd(), 'public', 'all_videos_ranking.csv');

  try {
    if (!fs.existsSync(filePath)) {
      console.warn("CSVファイルが見つかりません:", filePath);
      return [];
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    
    // ヘッダーを除外してデータをパース
    const data = lines.slice(1)
      .filter((line: string) => line.trim() !== '') 
      .map((line: string) => {
        // カンマ区切り（タイトル内のカンマ等は簡易的に考慮外とします）
        const parts = line.split(',');
        
        // データが足りない行はスキップ
        if (parts.length < 7) return null;

        const [rank, title, viewCount, url, thumbnail, publishedAt, duration] = parts;

        return {
          rank: Number(rank),
          title: title.replace(/"/g, ''), // CSVの引用符があれば除去
          viewCount: Number(viewCount),
          url: url,
          thumbnail: thumbnail,
          publishedAt: publishedAt,
          duration: Number(duration),
        };
      })
      .filter((item): item is Video => item !== null);

    return data;
  } catch (error) {
    console.error("CSV読み込みエラー:", error);
    return [];
  }
}