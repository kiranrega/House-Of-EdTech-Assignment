import React, { useRef, useState } from 'react';
import { View, Button, Slider, Text } from 'react-native';
import { Video } from 'expo-av';

export default function VideoScreen({ navigation }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isMuted, setIsMuted] = useState(false);

  const seek = async (seconds) => {
    if (videoRef.current && status.positionMillis !== undefined) {
      await videoRef.current.setPositionAsync(status.positionMillis + seconds * 1000);
    }
  };

  const handleMute = async () => {
    setIsMuted(!isMuted);
    await videoRef.current.setIsMutedAsync(!isMuted);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Video
        ref={videoRef}
        source={{ uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }}
        style={{ width: 320, height: 200 }}
        resizeMode="contain"
        onPlaybackStatusUpdate={setStatus}
        isMuted={isMuted}
      />
      <View style={{ flexDirection: 'row', margin: 10 }}>
        <Button title="<< 10s" onPress={() => seek(-10)} />
        <Button title={status.isPlaying ? "Pause" : "Play"}
          onPress={() =>
            status.isPlaying
              ? videoRef.current?.pauseAsync()
              : videoRef.current?.playAsync()
          }
        />
        <Button title="10s >>" onPress={() => seek(10)} />
        <Button title={isMuted ? "Unmute" : "Mute"} onPress={handleMute} />
      </View>
      <Button title="Fullscreen" onPress={() => videoRef.current?.presentFullscreenPlayer()} />
      <Button title="Back to WebView" onPress={() => navigation.navigate('WebView')} />
      <Text>
        {`Current: ${(status.positionMillis ?? 0) / 1000}s / ${(status.durationMillis ?? 0) / 1000}s`}
      </Text>
    </View>
  );
}
