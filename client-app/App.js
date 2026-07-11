import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Platform, Share, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

const PRODUCTION_URL = 'https://two-impalas-sniff.loca.lt';
const ROLE = 'USER';
const INITIAL_URL = `${PRODUCTION_URL}?role=${ROLE}`;

export default function App() {
  const [url, setUrl] = useState(INITIAL_URL);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  // Handle hardware back button on Android
  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  const handleMessage = (event) => {
    try {
      const msgData = JSON.parse(event.nativeEvent.data);
      const { handlerName, args } = msgData;

      if (handlerName === 'orbit_request_gps') {
        const gpsData = {
          lat: 19.0596,
          lng: 72.8295,
          accuracy: 5,
          altitude: 10,
          heading: 0,
          speed: 0,
          timestamp: new Date().toISOString()
        };
        const jsInject = `
          window.dispatchEvent(new CustomEvent("orbit_gps", {
            detail: ${JSON.stringify(gpsData)}
          }));
        `;
        webViewRef.current.injectJavaScript(jsInject);
      }

      if (handlerName === 'orbit_native_share') {
        const text = args[0] || '';
        const shareUrl = args[1] || null;
        Share.share({
          message: shareUrl ? `${text}\n${shareUrl}` : text
        });
      }

      if (handlerName === 'orbit_biometric_auth') {
        const success = true;
        const jsInject = `
          window.dispatchEvent(new CustomEvent("orbit_biometric_result", {
            detail: { success: ${success} }
          }));
        `;
        webViewRef.current.injectJavaScript(jsInject);
      }

      if (handlerName === 'orbit_get_platform') {
        const payload = {
          platform: Platform.OS,
          isNativeApp: true,
          appVersion: '1.0.0',
          role: ROLE
        };
        const jsInject = `
          if (window.resolvePlatformPromise) {
            window.resolvePlatformPromise(${JSON.stringify(payload)});
          }
        `;
        webViewRef.current.injectJavaScript(jsInject);
      }
    } catch (e) {
      console.warn("Error parsing postMessage data:", e);
    }
  };

  const injectedJavaScript = `
    (function() {
      if (window.OrbitBridge) return;
      window.OrbitBridge = {
        requestGPS: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ handlerName: 'orbit_request_gps', args: [] }));
        },
        requestConnectivity: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ handlerName: 'orbit_request_connectivity', args: [] }));
        },
        biometricAuth: function(reason) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ handlerName: 'orbit_biometric_auth', args: [reason] }));
        },
        share: function(text, url) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ handlerName: 'orbit_native_share', args: [text, url] }));
        },
        getPlatform: function() {
          return new Promise(function(resolve) {
            window.resolvePlatformPromise = resolve;
            window.ReactNativeWebView.postMessage(JSON.stringify({ handlerName: 'orbit_get_platform', args: [] }));
          });
        },
        isNativeApp: true,
        platform: "${Platform.OS}",
        role: "${ROLE}"
      };
      window.dispatchEvent(new CustomEvent("orbit_bridge_ready", {
        detail: { platform: "${Platform.OS}", role: "${ROLE}" }
      }));
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1 }}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00BFFF" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
