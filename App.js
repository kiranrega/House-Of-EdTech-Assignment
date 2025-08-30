import 'react-native-gesture-handler'; // must be at top — ensures native module registers early
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import WebViewPage from './src/screens/WebViewPage';
import VideoPlayerPage from './src/screens/VideoPlayerPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="WebView"
          screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { fontWeight: '600' },
            headerRight: () => (
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('VideoPlayer')}
                  style={styles.headerIconButton}
                >
                  <Ionicons name="videocam" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            ),
          })}
        >
          <Stack.Screen name="WebView" component={WebViewPage} options={{ title: 'WebView Page' }} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerPage} options={{ title: 'Video Player' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerIconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
    borderRadius: 8,
  },
});
