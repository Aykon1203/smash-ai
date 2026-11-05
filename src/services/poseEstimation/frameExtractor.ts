import * as VideoThumbnails from 'expo-video-thumbnails';
import { VideoInfo } from '../../types/badminton';

export interface ExtractedFrame {
  timestampMs: number;
  uri: string;
}

/**
 * Extraheert opeenvolgende video-frames uit een lokaal videobestand via expo-video-thumbnails
 */
export async function extractVideoFrames(
  video: VideoInfo,
  targetFrameCount = 6
): Promise<ExtractedFrame[]> {
  const frames: ExtractedFrame[] = [];

  // Als het een demo- of mock-video is, hoeven we geen lokale schijf-frames op te halen
  if (video.source === 'sample' || video.uri.startsWith('mock://')) {
    const durationMs = (video.duration || 4) * 1000;
    const step = Math.floor(durationMs / targetFrameCount);
    for (let i = 0; i < targetFrameCount; i++) {
      frames.push({
        timestampMs: i * step + 150,
        uri: video.uri,
      });
    }
    return frames;
  }

  try {
    const totalDurationMs = (video.duration || 5) * 1000;
    // Bemonster frames over het middendeel van de opname (waar de slag plaatsvindt)
    const startTime = Math.min(300, totalDurationMs * 0.1);
    const endTime = Math.max(startTime + 1000, totalDurationMs * 0.9);
    const interval = (endTime - startTime) / Math.max(1, targetFrameCount - 1);

    for (let i = 0; i < targetFrameCount; i++) {
      const timeMs = Math.round(startTime + i * interval);
      try {
        const thumbnail = await VideoThumbnails.getThumbnailAsync(video.uri, {
          time: timeMs,
          quality: 0.7,
        });

        frames.push({
          timestampMs: timeMs,
          uri: thumbnail.uri,
        });
      } catch (thumbErr) {
        // Indien een individueel frame faalt, ga door met fallback tijdstip
        frames.push({
          timestampMs: timeMs,
          uri: video.uri,
        });
      }
    }
  } catch (error) {
    console.warn('Video frame extractie waarschuwing, terugval naar standaard reeks:', error);
    // Val terug op logische frame-indexen
    for (let i = 0; i < targetFrameCount; i++) {
      frames.push({
        timestampMs: i * 250 + 200,
        uri: video.uri,
      });
    }
  }

  return frames;
}
