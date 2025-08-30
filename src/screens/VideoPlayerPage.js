import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function VideoPlayerPage({ navigation }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{ uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={setStatus}
      />
      <View style={styles.buttons}>
        <Button title={status.isPlaying ? 'Pause' : 'Play'} onPress={() => status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()} />
        <Button title="Fullscreen" onPress={() => video.current.presentFullscreenPlayer()} />
      </View>
      <Button title="Back to WebView" onPress={() => navigation.navigate('WebView')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  video: { alignSelf: 'center', width: 320, height: 200 },
  buttons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
