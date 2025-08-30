# Expo Assignment App

## Overview
A small Expo app demonstrating:
- Embedding a webpage via WebView
- Local and scheduled notifications
- HLS and MP4 video playback with custom controls and stream switching

## Features
- WebView page that schedules a local notification when the page finishes loading
- Scheduled notification that can navigate to the video player when tapped
- Video player with support for HLS (.m3u8) and MP4 streams
- Custom player controls: play/pause, seek forward/back, mute/unmute, fullscreen, and a seek slider
- Multiple stream selection (switch between streams at runtime)
- Icon-based controls and subtle animations for a polished UI
- Header icon shortcuts to quickly open video screens

## Installation
- `npm install`
- `npx expo start`

## Notes about Android push notifications
Android remote push notifications (obtaining push tokens / receiving remote pushes) are not supported in Expo Go as of SDK 53+. To test remote push notifications on Android you must use a development build (dev client) or produce a standalone build. See https://docs.expo.dev/develop/development-builds/introduction/

Local scheduled notifications (scheduleNotificationAsync) still work in Expo Go.

## Implementation choices
- Navigation: React Navigation (stack navigator) — simple, familiar navigation flow.
- Video playback: Expo AV (Video) — handles HLS and MP4 and integrates with Expo.
- Web content: react-native-webview — reliable in-app browser component.
- Notifications: expo-notifications — scheduling and handling notification responses; remote pushes on Android require a dev build.
- Slider: @react-native-community/slider — used for seek slider.
- Icons: @expo/vector-icons — icon buttons for compact and clear controls.
- Animations: React Native Animated API — subtle pulsing/press effects on controls.

## Usage hints
- Restart Metro after changes.
- For Android remote push features, create a development build (e.g. via EAS) or test on a standalone app; local notifications work in Expo Go.
