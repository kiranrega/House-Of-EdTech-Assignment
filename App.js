import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebViewPage from './src/screens/WebViewPage';
import VideoPlayerPage from './src/screens/VideoPlayerPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WebView">
        <Stack.Screen name="WebView" component={WebViewPage} options={{ title: 'WebView Page' }} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerPage} options={{ title: 'Video Player' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
