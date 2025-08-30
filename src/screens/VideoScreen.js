// import React, { useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
// import { Video } from 'expo-av';
// import Slider from "@react-native-community/slider";
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// const videoStreams = [
//   { id: 1, name: 'Stream 1 (HLS)', uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
//   { id: 2, name: 'Stream 2 (MP4)', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
//   { id: 3, name: 'Stream 3 (Tears of Steel)', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
// ];

// export default function VideoScreen({ navigation }) {
//   const videoRef = useRef(null);
//   const [status, setStatus] = useState({});
//   const [isMuted, setIsMuted] = useState(false);
//   const [currentStream, setCurrentStream] = useState(0);

//   const seek = async (seconds) => {
//     if (videoRef.current && status.positionMillis !== undefined) {
//       await videoRef.current.setPositionAsync(status.positionMillis + seconds * 1000);
//     }
//   };

//   const handleMute = async () => {
//     setIsMuted(!isMuted);
//     await videoRef.current.setIsMutedAsync(!isMuted);
//   };

//   const handleSeekSlider = async (value) => {
//     if (videoRef.current && status.durationMillis) {
//       const position = value * status.durationMillis;
//       await videoRef.current.setPositionAsync(position);
//     }
//   };

//   const switchStream = async (streamIndex) => {
//     setCurrentStream(streamIndex);
//     if (videoRef.current) {
//       await videoRef.current.unloadAsync();
//       await videoRef.current.loadAsync({ uri: videoStreams[streamIndex].uri });
//     }
//   };

//   const formatTime = (millis) => {
//     const totalSeconds = Math.floor(millis / 1000);
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Video
//         ref={videoRef}
//         source={{ uri: videoStreams[currentStream].uri }}
//         style={styles.video}
//         resizeMode="contain"
//         onPlaybackStatusUpdate={setStatus}
//         isMuted={isMuted}
//       />
      
//       {/* Stream Selection */}
//       <View style={styles.streamSelector}>
//         <Text style={styles.sectionTitle}>Available Streams:</Text>
//         <View style={styles.streamButtonsRow}>
//           {videoStreams.map((stream, index) => (
//             <TouchableOpacity
//               key={stream.id}
//               style={[styles.streamChip, index === currentStream && styles.streamChipActive]}
//               onPress={() => switchStream(index)}
//             >
//               <MaterialIcons name="ondemand-video" size={16} color={index === currentStream ? '#fff' : '#444'} />
//               <Text style={[styles.streamChipText, index === currentStream && styles.streamChipTextActive]}>{stream.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
 
//       {/* Seek Bar */}
//       <View style={styles.seekContainer}>
//         <Text style={styles.timeText}>{formatTime(status.positionMillis || 0)}</Text>
//         <Slider
//           style={styles.seekBar}
//           minimumValue={0}
//           maximumValue={1}
//           value={status.durationMillis ? (status.positionMillis || 0) / status.durationMillis : 0}
//           onValueChange={handleSeekSlider}
//           minimumTrackTintColor="#007AFF"
//           maximumTrackTintColor="#8E8E93"
//         />
//         <Text style={styles.timeText}>{formatTime(status.durationMillis || 0)}</Text>
//       </View>
 
//       {/* Controls */}
//       <View style={styles.controlsRow}>
//         <TouchableOpacity style={styles.iconButton} onPress={() => seek(-30)}>
//           <Ionicons name="play-back" size={20} color="#333" />
//           <Text style={styles.iconLabel}>30s</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton} onPress={() => seek(-10)}>
//           <Ionicons name="play-skip-back" size={20} color="#333" />
//           <Text style={styles.iconLabel}>10s</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.bigIconButton}
//           onPress={() => (status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync())}
//         >
//           <Ionicons name={status.isPlaying ? 'pause' : 'play'} size={26} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton} onPress={() => seek(10)}>
//           <Ionicons name="play-skip-forward" size={20} color="#333" />
//           <Text style={styles.iconLabel}>10s</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.iconButton} onPress={() => seek(30)}>
//           <Ionicons name="play-forward" size={20} color="#333" />
//           <Text style={styles.iconLabel}>30s</Text>
//         </TouchableOpacity>
//       </View>
// +
// +      <View style={styles.additionalControlsRow}>
// +        <TouchableOpacity style={styles.controlPill} onPress={handleMute}>
// +          <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={18} color={isMuted ? '#FF3B30' : '#34C759'} />
// +          <Text style={styles.controlPillText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
// +        </TouchableOpacity>
// +        <TouchableOpacity style={styles.controlPill} onPress={() => videoRef.current?.presentFullscreenPlayer()}>
// +          <MaterialIcons name="fullscreen" size={18} color="#007AFF" />
// +          <Text style={styles.controlPillText}>Fullscreen</Text>
// +        </TouchableOpacity>
// +      </View>
 
//       <Button title="Back to WebView" onPress={() => navigation.navigate('WebView')} />
       
//       <View style={styles.statusInfo}>
//         <Text style={styles.statusText}>
//           Current Stream: {videoStreams[currentStream].name}
//         </Text>
//         <Text style={styles.statusText}>
//           Time: {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
//         </Text>
//         <Text style={styles.statusText}>
//           Status: {status.isPlaying ? 'Playing' : 'Paused'} | Muted: {isMuted ? 'Yes' : 'No'}
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     padding: 16,
//     backgroundColor: '#f2f6fb',
//   },
//   video: { 
//     width: '100%', 
//     height: 220,
//     marginBottom: 18,
//     borderRadius: 8,
//     backgroundColor: '#000',
//   },
//   streamSelector: {
//     marginBottom: 12,
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 12,
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     marginBottom: 10,
//     color: '#222',
//   },
//   streamButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 8,
//   },
//   streamChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//   },
//   streamChipActive: {
//     backgroundColor: '#007AFF',
//   },
//   streamChipText: {
//     marginLeft: 6,
//     color: '#444',
//     fontSize: 12,
//   },
//   streamChipTextActive: {
//     color: '#fff',
//   },
//   seekContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 12,
//   },
//   seekBar: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#666',
//     minWidth: 40,
//     textAlign: 'center',
//   },
//   controlsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#eee',
//     width: 72,
//   },
//   bigIconButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#007AFF',
//     padding: 12,
//     borderRadius: 40,
//     width: 72,
//     height: 72,
//   },
//   iconLabel: {
//     fontSize: 11,
//     color: '#333',
//     marginTop: 4,
//   },
//   additionalControlsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//     marginBottom: 12,
//   },
//   controlPill: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#eee',
//     gap: 8,
//   },
//   controlPillText: {
//     color: '#333',
//     marginLeft: 6,
//     fontSize: 13,
//   },
//   statusInfo: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
// });
