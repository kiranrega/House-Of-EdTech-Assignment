import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function WebViewPage({ navigation }) {
  const isAndroidInExpoGo = Platform.OS === 'android' && Constants.appOwnership === 'expo';
  useEffect(() => {
    if (isAndroidInExpoGo) {
      console.warn(
        'expo-notifications: Android push notifications (remote) are not supported in Expo Go. Use a development build to test push notifications.'
      );
    }

    (async () => {
      // still request permissions for local notifications where applicable;
      // remote push token flows require a dev build on Android (not Expo Go).
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") console.log("Permission denied");
    })();

    // Listen for notification responses (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === "VideoPlayer") {
          navigation.navigate("VideoPlayer");
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  const scheduleNotification = async (title, body, delay /* optional seconds number */ = undefined, data = {}) => {
    // If no explicit delay provided, pick a random integer between 2 and 5 seconds
    const chosenDelay = typeof delay === 'number'
      ? Math.max(0, Math.floor(delay))
      : Math.floor(Math.random() * (5 - 2 + 1)) + 2;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: { seconds: chosenDelay },
    });
  };

  const handleWebViewLoad = () => {
    // use default random delay between 2-5s
    scheduleNotification("WebView Loaded!", "The webpage has finished loading successfully");
  };

  const sendVideoPlayerNotification = () => {
    // use default random delay between 2-5s
    scheduleNotification("Video Player Ready!", "Tap to open the Video Player", undefined, { screen: "VideoPlayer" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://flipkart.com" }}
        style={styles.webview}
        onLoadEnd={handleWebViewLoad}
      />
      {isAndroidInExpoGo && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Note: Android remote push notifications are not supported in Expo Go. Build a development client to test push notifications.
          </Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconPill} onPress={sendVideoPlayerNotification}>
          <Ionicons name="notifications" size={18} color="#fff" />
          <Text style={styles.iconPillText}>Notify</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconPill} onPress={() => navigation.navigate("VideoPlayer")}>
          <Ionicons name="videocam" size={18} color="#fff" />
          <Text style={styles.iconPillText}>Player</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  buttonContainer: {
    padding: 12,
    // ensure the button bar sits above the device bottom inset (home indicator)
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
    backgroundColor: "#f5f7fb",
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap removed — spacing handled by child margins (iconPill.marginRight)
  },
  iconPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    marginRight: 8, // spacing between pills; last item will have extra margin but layout stays correct
  },
  iconPillText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
});
