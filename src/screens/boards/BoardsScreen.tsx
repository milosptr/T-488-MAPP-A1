import { Alert, ScrollView, StyleSheet } from 'react-native';

import { BoardCard } from '@/src/components/cards';
import { SafeAreaScreen, ScreenHeader } from '@/src/components/layout';
import { Button, View } from '@/src/components/ui';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BoardsScreen = () => {
    const { bottom: bottomPadding } = useSafeAreaInsets();
    const theme = useTheme();
    const boards = useStore(state => state.boards);
    const resetStore = useStore(state => state.resetStore);
    const router = useRouter();

    const handleAddBoard = () => {
        router.push('/modals/add-board');
    };

    const handleRefreshStore = () => {
        Alert.alert('Reset Store', 'Are you sure you want to reset the store to initial state?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                    resetStore();
                },
            },
        ]);
    };

    return (
        <SafeAreaScreen>
            <View style={styles.container}>
                <ScreenHeader
                    title="Boards"
                    rightAction={() => (
                        <View style={styles.buttonsContainer}>
                            <Button
                                size="small"
                                title="Add Board"
                                leadingIcon={
                                    <MaterialCommunityIcons
                                        name="plus"
                                        size={16}
                                        color={theme.onPrimary}
                                    />
                                }
                                onPress={handleAddBoard}
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                leadingIcon={
                                    <MaterialCommunityIcons
                                        name="refresh"
                                        size={16}
                                        color={theme.primary}
                                    />
                                }
                                onPress={handleRefreshStore}
                            />
                        </View>
                    )}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.boardsContainer, { paddingBottom: bottomPadding }]}>
                        {boards.map(board => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12,
    },
    boardsContainer: {
        gap: 16,
    },
    buttonsContainer: {
        gap: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
