import { BoardColumn } from '@/src/components/cards';
import { SafeAreaScreen } from '@/src/components/layout';
import { Button, Text, View } from '@/src/components/ui';
import Colors from '@/src/constants/Colors';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export const SingleBoardScreen = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const board = useStore(state => state.boards.find(board => board.id === Number(id)));
    const allLists = useStore(state => state.lists);
    const allTasks = useStore(state => state.tasks);

    const lists = useMemo(
        () => allLists.filter(list => list.boardId === Number(id)),
        [allLists, id]
    );

    const theme = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (!!board && Platform.OS === 'ios') {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity
                        hitSlop={10}
                        style={styles.headerActionButton}
                        onPress={() => router.back()}
                    >
                        <Feather
                            name="chevron-left"
                            size={16}
                            color={theme.white}
                            strokeWidth={2}
                        />
                        <Text style={styles.headerActionButtonText}>Back</Text>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerActionButton}
                        onPress={() => router.push(`/modals/add-list?boardId=${board.id}`)}
                    >
                        <MaterialCommunityIcons
                            name="plus"
                            size={16}
                            color={theme.white}
                            strokeWidth={2}
                        />
                        <Text style={styles.headerActionButtonText}>Add New List</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [board, navigation]);

    if (!board) {
        return <Redirect href="/+not-found" />;
    }

    return (
        <SafeAreaScreen
            edges={Platform.OS === 'ios' ? [] : ['top']}
            paddingTop={Platform.OS === 'android' ? 12 : 24}
        >
            <View style={styles.container}>
                {Platform.OS === 'android' && (
                    <View style={styles.header}>
                        <Button
                            size="small"
                            title="Back"
                            onPress={() => router.back()}
                            leadingIcon={
                                <Feather
                                    name="chevron-left"
                                    size={16}
                                    color={theme.white}
                                    strokeWidth={2}
                                />
                            }
                        />
                        <Button
                            size="small"
                            title="Add New List"
                            onPress={() => router.push(`/modals/add-list?boardId=${board.id}`)}
                            leadingIcon={
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={16}
                                    color={theme.white}
                                    strokeWidth={2}
                                />
                            }
                        />
                    </View>
                )}
                <View>
                    <Text style={styles.boardTitle}>{board.name}</Text>
                    <Text style={styles.description}>{board.description}</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.listsScroll}
                    contentContainerStyle={styles.listsContainer}
                >
                    {lists.map(list => {
                        const tasks = allTasks.filter(t => t.listId === list.id);

                        return <BoardColumn key={list.id} list={list} tasks={tasks} />;
                    })}
                </ScrollView>
            </View>
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActionButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerActionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.white,
    },
    boardTitle: {
        fontSize: 24,
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
