import { LiquidButton } from '@/src/components/button';
import { ListCard } from '@/src/components/cards/ListCard';
import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function SingleBoardScreen() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const board = useStore(state => state.boards.find(board => board.id === Number(id)));
    const allLists = useStore(state => state.lists);
    const lists = React.useMemo(
        () => allLists.filter(list => list.boardId === Number(id)),
        [allLists, id]
    );

    const theme = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (board && board.name.length > 0) {
            let title = board.name.slice(0, 20);
            if (title.length < board.name.length) {
                title += '...';
            }
            navigation.setOptions({
                title,
            });
        }
    }, [board, navigation]);

    if (!board) {
        return <Redirect href="/+not-found" />;
    }

    return (
        <SafeAreaScreen edges={[]} paddingTop={24}>
            <View style={styles.container}>
                <ScreenHeader
                    title={board.name}
                    rightAction={() => (
                        <LiquidButton
                            size="small"
                            title="Add List"
                            leadingIcon={
                                <MaterialCommunityIcons name="plus" size={16} color={theme.onButton} />
                            }
                            onPress={() => router.push(`/add-list?boardId=${board.id}`)}
                        />
                    )}
                />
                <Text style={styles.description}>{board.description}</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.listsScroll}>
                    <View style={styles.listsContainer}>
                        {lists.map(list => (
                            <ListCard key={list.id} list={list} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
    },
    listsScroll: {
        flex: 1,
    },
    listsContainer: {
        gap: 12,
        paddingBottom: 24,
    },
});
