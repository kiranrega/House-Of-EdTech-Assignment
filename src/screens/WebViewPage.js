import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export default function WebViewPage({ navigation }) {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log('Permission denied');
    })();
  }, []);

  const scheduleNotification = async (title, body, delay) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: delay },
    });
  };

  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://flipkart.com' }} style={styles.webview} />
      <Button title="Trigger Notification 1" onPress={() => scheduleNotification('Hello!', 'This is notification 1', 3)} />
      <Button title="Trigger Notification 2" onPress={() => scheduleNotification('Alert!', 'This is notification 2', 4)} />
      <Button title="Go to Video Player" onPress={() => navigation.navigate('VideoPlayer')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
