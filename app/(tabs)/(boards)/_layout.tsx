import { Stack } from 'expo-router';

export default function BoardsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Boards' }} />
            <Stack.Screen name="single-board" options={{ title: 'Board', headerShown: true }} />
        </Stack>
    );
}
