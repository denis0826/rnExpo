import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StoreProvider from './store/useStore'

import useCachedResources from './hooks/useCachedResources';
import RootNavigator from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StoreProvider>
          <RootNavigator />
          <StatusBar />
        </StoreProvider>
      </SafeAreaProvider>
    );
  }
}
