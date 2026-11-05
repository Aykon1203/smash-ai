import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { globalNeuralVisionBridge, MOVENET_HTML } from '../services/poseEstimation/neuralVisionEngine';

export const PoseVisionBridge: React.FC = () => {
  const webViewRef = useRef<any>(null);

  useEffect(() => {
    if (webViewRef.current) {
      globalNeuralVisionBridge.setWebViewRef(webViewRef.current);
    }
  }, []);

  const handleMessage = (event: WebViewMessageEvent): void => {
    if (event && event.nativeEvent && event.nativeEvent.data) {
      globalNeuralVisionBridge.handleMessageFromWebView(event.nativeEvent.data);
    }
  };

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.hiddenContainer} pointerEvents="none">
      <WebView
        ref={(ref: any): void => {
          webViewRef.current = ref;
          if (ref) {
            globalNeuralVisionBridge.setWebViewRef(ref);
          }
        }}
        originWhitelist={['*']}
        source={{ html: MOVENET_HTML }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
    top: -100,
    left: -100,
  },
});
