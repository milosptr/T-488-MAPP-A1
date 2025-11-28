import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
    initialRouteName: '(app)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(app)" />
                        <Stack.Screen name="modals/add-board" options={{ presentation: 'modal' }} />
                        <Stack.Screen
                            name="modals/edit-board"
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen name="modals/add-list" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="modals/add-task" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="modals/edit-task" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="modals/edit-list" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
