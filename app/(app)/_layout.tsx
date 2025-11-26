import { useTheme } from '@/src/hooks/useTheme';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export const unstable_settings = {
    initialRouteName: 'index',
};

export default function AppLayout() {
    const theme = useTheme();
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerBackground: () => (
                    <View style={{ backgroundColor: theme.headerBackground, flex: 1 }} />
                ),
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="boards/[id]"
                options={{ headerShown: true, headerBackTitle: 'Back', title: '' }}
            />
            <Stack.Screen name="lists/[id]" options={{ headerShown: true }} />
        </Stack>
    );
}
