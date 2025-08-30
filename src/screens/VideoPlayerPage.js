import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Animated, Button } from 'react-native';
import { Video } from 'expo-av';
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const videoStreams = [
  { id: 1, name: 'Stream 1 (HLS)', uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { id: 2, name: 'Stream 2 (MP4)', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 3, name: 'Stream 3 (Tears of Steel)', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
];

export default function VideoPlayerPage({ navigation }) {
   const video = useRef(null);
   const [status, setStatus] = useState({});
   const [isMuted, setIsMuted] = useState(false);
   const [currentStream, setCurrentStream] = useState(0);
   // seeking: whether the user is currently dragging the slider
   const [seeking, setSeeking] = useState(false);
   // seekPosition: temporary 0..1 value while dragging
   const [seekPosition, setSeekPosition] = useState(0);
   // wasPlayingBeforeSeek: whether playback was active when dragging started
   const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);

  // Animated pulse for play icon
  const playScale = useRef(new Animated.Value(1)).current;
  const playAnimRef = useRef(null);

  useEffect(() => {
    if (status.isPlaying) {
      // start a subtle pulse
      playAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(playScale, { toValue: 1.08, duration: 700, useNativeDriver: true }),
          Animated.timing(playScale, { toValue: 1.0, duration: 700, useNativeDriver: true }),
        ])
      );
      playAnimRef.current.start();
    } else {
      if (playAnimRef.current) {
        playAnimRef.current.stop();
        playScale.setValue(1);
      }
    }
    return () => {
      if (playAnimRef.current) playAnimRef.current.stop();
    };
  }, [status.isPlaying]);

   const seek = async (seconds) => {
     if (!video.current || typeof status.positionMillis !== 'number') return;
     try {
       await video.current.setPositionAsync(status.positionMillis + seconds * 1000);
     } catch (e) {
       console.warn('seek failed', e);
     }
   };
 
   const handleMute = async () => {
     setIsMuted(!isMuted);
     await video.current.setIsMutedAsync(!isMuted);
   };
 
  // Called when user starts sliding
  const onSeekStart = async () => {
    if (!video.current) return;
    setWasPlayingBeforeSeek(Boolean(status.isPlaying));
    // pause playback while dragging to avoid frequent rebuffering
    try { if (status.isPlaying) await video.current.pauseAsync(); } catch (e) {
      console.warn('pause before seek failed', e);
    }
    setSeeking(true);
    // initialize seekPosition from current progress
    const cur = (status.durationMillis && status.positionMillis) ? (status.positionMillis / status.durationMillis) : 0;
    setSeekPosition(cur);
  };

  // Called continuously while the slider moves — only update local value
  const onSeekChange = (value) => {
    setSeekPosition(value);
  };

  // Called when user releases the slider — perform a single seek and resume if needed
  const onSeekComplete = async (value) => {
    if (!video.current || !status.durationMillis) {
      setSeeking(false);
      return;
    }
    const finalValue = (typeof value === 'number') ? value : seekPosition;
    const position = Math.max(0, Math.min(1, finalValue)) * status.durationMillis;
    try {
      await video.current.setPositionAsync(position);
      if (wasPlayingBeforeSeek) {
        await video.current.playAsync();
      }
    } catch (e) {
      console.warn('seek complete failed', e);
    } finally {
      setSeeking(false);
    }
  };
 
   const switchStream = async (streamIndex) => {
     setCurrentStream(streamIndex);
     if (video.current) {
       await video.current.unloadAsync();
       // load with source object (expo-av accepts source and optional initialStatus)
       await video.current.loadAsync({ uri: videoStreams[streamIndex].uri }, { shouldPlay: false });
     }
   };
 
   const formatTime = (millis) => {
     const totalSeconds = Math.floor(millis / 1000);
     const minutes = Math.floor(totalSeconds / 60);
     const seconds = totalSeconds % 60;
     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   };
 
   return (
     <ScrollView style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{ uri: videoStreams[currentStream].uri }}
        resizeMode="contain"
        onPlaybackStatusUpdate={setStatus}
        isMuted={isMuted}
        shouldPlay={false}
        // lower update frequency to reduce UI re-renders; tweak as needed
        progressUpdateIntervalMillis={1000}
      />
       
       {/* Stream Selection */}
       <View style={styles.streamSelector}>
         <Text style={styles.sectionTitle}>Video Streams:</Text>
        <View style={styles.streamButtonsRow}>
          {videoStreams.map((stream, index) => (
            <TouchableOpacity
              key={stream.id}
              style={[
                styles.streamChip,
                index === currentStream && styles.streamChipActive,
              ]}
              onPress={() => switchStream(index)}
            >
              <MaterialIcons name="ondemand-video" size={18} color={index === currentStream ? '#fff' : '#444'} />
              <Text style={[styles.streamChipText, index === currentStream && styles.streamChipTextActive]}>
                {stream.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
       </View>
 
       {/* Custom Controls */}
       <View style={styles.controls}>
         <Text style={styles.sectionTitle}>Custom Controls:</Text>
         
         {/* Seek Bar */}
         <View style={styles.seekContainer}>
           <Text style={styles.timeText}>
             {formatTime(status.positionMillis || 0)}
           </Text>
           <Slider
             style={styles.seekBar}
             minimumValue={0}
             maximumValue={1}
             value={seeking ? seekPosition : (status.durationMillis ? (status.positionMillis || 0) / status.durationMillis : 0)}
             onValueChange={onSeekChange}
             onSlidingStart={onSeekStart}
             onSlidingComplete={onSeekComplete}
             minimumTrackTintColor="#007AFF"
             maximumTrackTintColor="#8E8E93"
           />
           <Text style={styles.timeText}>
             {formatTime(status.durationMillis || 0)}
           </Text>
         </View>
 
         {/* Playback Controls */}
        <View style={styles.playbackControlsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => seek(-30)}>
            <Ionicons name="play-back" size={22} color="#333" />
            <Text style={styles.iconLabel}>30s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => seek(-10)}>
            <Ionicons name="play-skip-back" size={22} color="#333" />
            <Text style={styles.iconLabel}>10s</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: playScale }] }}>
            <TouchableOpacity
              style={[styles.bigIconButton]}
              onPress={() => (status.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}
            >
              <Ionicons name={status.isPlaying ? "pause" : "play"} size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.iconButton} onPress={() => seek(10)}>
            <Ionicons name="play-skip-forward" size={22} color="#333" />
            <Text style={styles.iconLabel}>10s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => seek(30)}>
            <Ionicons name="play-forward" size={22} color="#333" />
            <Text style={styles.iconLabel}>30s</Text>
          </TouchableOpacity>
        </View>
 
         {/* Additional Controls */}
        <View style={styles.additionalControlsRow}>
          <TouchableOpacity style={styles.controlPill} onPress={handleMute}>
            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color={isMuted ? '#FF3B30' : '#34C759'} />
            <Text style={styles.controlPillText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlPill} onPress={() => video.current.presentFullscreenPlayer()}>
            <MaterialIcons name="fullscreen" size={20} color="#007AFF" />
            <Text style={styles.controlPillText}>Fullscreen</Text>
          </TouchableOpacity>
        </View>
 
         {/* Status Info */}
         <View style={styles.statusInfo}>
           <Text style={styles.statusText}>
             Current Stream: {videoStreams[currentStream].name}
           </Text>
           <Text style={styles.statusText}>
             Status: {status.isPlaying ? 'Playing' : status.isLoaded ? 'Paused' : 'Loading...'}
           </Text>
           <Text style={styles.statusText}>
             Muted: {isMuted ? 'Yes' : 'No'}
           </Text>
         </View>
       </View>
 
       <Button title="Back to WebView" onPress={() => navigation.navigate('WebView')} />
     </ScrollView>
   );
 }
 
 const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f2f6fb',
    padding: 12,
  },
  video: { 
    alignSelf: 'center', 
    width: '100%', 
    height: 220,
    borderRadius: 8,
    backgroundColor: '#000',
    marginBottom: 14,
  },
  streamSelector: {
    marginBottom: 14,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  streamButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 8, // spacing between chips; last one may have extra margin but it's acceptable
  },
  streamChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  streamChipText: {
    marginLeft: 6,
    color: '#444',
    fontSize: 12,
  },
  streamChipTextActive: {
    color: '#fff',
  },
  controls: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  seekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  seekBar: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    minWidth: 40,
    textAlign: 'center',
  },
  playbackControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: 72,
  },
  bigIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 40,
    width: 72,
    height: 72,
    shadowColor: '#007AFF',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  iconLabel: {
    fontSize: 11,
    color: '#333',
    marginTop: 4,
  },
  additionalControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  controlPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 12, // spacing between pills
  },
  controlPillText: {
    color: '#333',
    marginLeft: 6,
    fontSize: 13,
  },
  statusInfo: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
 });
