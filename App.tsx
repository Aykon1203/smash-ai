import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ScreenType, VideoInfo, ShotAnalysis } from './src/types/badminton';
import { Colors } from './src/constants/theme';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { ResultScreen } from './src/screens/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Home');
  const [activeVideo, setActiveVideo] = useState<VideoInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ShotAnalysis | null>(null);

  /**
   * Transition from Home to Loading screen when a video is captured or selected
   */
  const handleStartAnalysis = (video: VideoInfo) => {
    setActiveVideo(video);
    setCurrentScreen('Loading');
  };

  /**
   * Transition from Loading to Result screen when AI analysis completes
   */
  const handleAnalysisComplete = (result: ShotAnalysis) => {
    setAnalysisResult(result);
    setCurrentScreen('Result');
  };

  /**
   * Cancel analysis and return to Home
   */
  const handleCancelLoading = () => {
    setActiveVideo(null);
    setCurrentScreen('Home');
  };

  /**
   * Reset and return to Home screen ready to record a new badminton video
   */
  const handleRecordNewVideo = () => {
    setActiveVideo(null);
    setAnalysisResult(null);
    setCurrentScreen('Home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />

        {/* Global SmashAI Brand Header */}
        <Header
          currentScreen={currentScreen}
          onBackToHome={currentScreen !== 'Home' ? handleRecordNewVideo : undefined}
        />

        {/* Screen Controller */}
        <View style={styles.screenContainer}>
          {currentScreen === 'Home' && (
            <HomeScreen onStartAnalysis={handleStartAnalysis} />
          )}

          {currentScreen === 'Loading' && activeVideo && (
            <LoadingScreen
              video={activeVideo}
              onAnalysisComplete={handleAnalysisComplete}
              onCancel={handleCancelLoading}
            />
          )}

          {currentScreen === 'Result' && analysisResult && (
            <ResultScreen
              analysis={analysisResult}
              onRecordNewVideo={handleRecordNewVideo}
              onNavigateHome={handleRecordNewVideo}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
