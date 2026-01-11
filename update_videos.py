import pandas as pd
from googleapiclient.discovery import build
import os
import requests
import isodate

# ==========================================
# 設定項目
# ==========================================
# 【修正1】環境変数からAPIキーを取得する (なければエラーにする)
API_KEY = os.environ.get("YOUTUBE_API_KEY")
if not API_KEY:
    raise ValueError("APIキーが設定されていません。GitHub Secretsを確認してください。")

CHANNEL_ID = 'UCTW2tw0Mhho72MojB1L48IQ'

# 【修正2】保存先を Next.js の public フォルダに変更
# リポジトリのルートで実行されることを想定
OUTPUT_FILE = 'public/all_videos_ranking.csv'

def is_shorts(video_id):
    """URLリダイレクトチェックでShortsかどうかを判定"""
    url = f"https://www.youtube.com/shorts/{video_id}"
    try:
        response = requests.head(url, allow_redirects=False, timeout=5)
        return response.status_code == 200
    except:
        return False

def get_videos_exclude_shorts(api_key, channel_id):
    if not api_key:
        print("エラー: APIキーが設定されていません。")
        return None

    youtube = build('youtube', 'v3', developerKey=api_key)

    print("1. チャンネル情報を取得中...")
    try:
        channel_response = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        ).execute()
    except Exception as e:
        print(f"API接続エラー: {e}")
        return None

    items = channel_response.get('items', [])
    if not items:
        print("チャンネルが見つかりませんでした。")
        return None

    uploads_playlist_id = items[0]['contentDetails']['relatedPlaylists']['uploads']

    print(f"2. 全動画のIDを収集中... (リストID: {uploads_playlist_id})")
    video_ids = []
    next_page_token = None

    while True:
        try:
            playlist_response = youtube.playlistItems().list(
                part='contentDetails',
                playlistId=uploads_playlist_id,
                maxResults=50,
                pageToken=next_page_token
            ).execute()

            for item in playlist_response.get('items', []):
                video_ids.append(item['contentDetails']['videoId'])

            next_page_token = playlist_response.get('nextPageToken')
            if not next_page_token:
                break
        except Exception as e:
            print(f"リスト取得エラー: {e}")
            break
    
    print(f"合計 {len(video_ids)} 本の動画IDを取得しました。")

    if not video_ids:
        return None

    print("3. 詳細データを取得し、Shortsを除外中...")
    videos_data = []
    chunk_size = 50
    shorts_count = 0
    
    for i in range(0, len(video_ids), chunk_size):
        chunk_ids = video_ids[i:i + chunk_size]
        ids_string = ','.join(chunk_ids)

        try:
            video_response = youtube.videos().list(
                part='snippet,statistics,contentDetails',
                id=ids_string
            ).execute()

            for item in video_response.get('items', []):
                video_id = item['id']
                snippet = item['snippet']
                stats = item['statistics']
                content_details = item['contentDetails']
                
                duration_iso = content_details.get('duration', 'PT0S')
                duration_seconds = isodate.parse_duration(duration_iso).total_seconds()

                # Shorts判定 (60秒以下ならチェック)
                if duration_seconds <= 60:
                    if is_shorts(video_id):
                        shorts_count += 1
                        continue

                videos_data.append({
                    'Rank': 0, # 後で設定
                    'Title': snippet['title'],
                    'ViewCount': int(stats.get('viewCount', 0)),
                    'URL': f"https://www.youtube.com/watch?v={video_id}",
                    'Thumbnail': snippet['thumbnails'].get('high', {}).get('url', ''),
                    'PublishedAt': snippet['publishedAt'],
                    'DurationSec': int(duration_seconds)
                })
                
        except Exception as e:
            print(f"詳細取得エラー: {e}")
            continue
        
        print(f"進捗: {min(i + chunk_size, len(video_ids))}/{len(video_ids)} (Shorts除外: {shorts_count})")

    print(f"4. データを人気順にソートして保存中... (保存対象: {len(videos_data)}本)")
    df = pd.DataFrame(videos_data)
    
    if df.empty:
        print("データがありません。")
        return None

    # 人気順ソート
    df = df.sort_values(by='ViewCount', ascending=False).reset_index(drop=True)
    df['Rank'] = df.index + 1
    
    # Next.jsアプリが期待するカラム順序に合わせる
    cols = ['Rank', 'Title', 'ViewCount', 'URL', 'Thumbnail', 'PublishedAt', 'DurationSec']
    df = df[cols]

    # 保存 (publicフォルダへ)
    # webアプリ用なのでBOMなしutf-8推奨ですが、Excel編集したい場合は utf-8-sig にしてください
    df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8')
    print(f"\n完了！ ファイルを保存しました: {OUTPUT_FILE}")
    return df

if __name__ == "__main__":
    try:
        print("処理を開始します...")
        result_df = get_videos_exclude_shorts(API_KEY, CHANNEL_ID)
        if result_df is not None:
            # ディレクトリがない場合に備えて作成
            os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
            
            result_df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
            print(f"\n完了！ ファイルを保存しました: {OUTPUT_FILE}")
    except Exception as e:
        print(f"エラー: {e}")
        exit(1) # エラー終了させる