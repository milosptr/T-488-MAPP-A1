import { BoardColumn } from '@/src/components/cards';
import { SafeAreaScreen } from '@/src/components/layout';
import { Button, Text, TextInput, View } from '@/src/components/ui';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import { DropProvider } from '@/src/lib/dnd';
import { useStore } from '@/src/store/useStore';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export const SingleBoardScreen = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const board = useStore(state => state.boards.find(board => board.id === Number(id)));
    const allLists = useStore(state => state.lists);
    const allTasks = useStore(state => state.tasks);
    const [searchQuery, setSearchQuery] = useState('');

    const lists = useMemo(
        () => allLists.filter(list => list.boardId === Number(id)),
        [allLists, id]
    );

    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return allTasks;
        const query = searchQuery.toLowerCase();
        return allTasks.filter(
            task =>
                task.name.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)
        );
    }, [allTasks, searchQuery]);

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
                            color={theme.onPrimary}
                            strokeWidth={2}
                        />
                        <Text style={[styles.headerActionButtonText, { color: theme.onPrimary }]}>
                            Back
                        </Text>
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
                            color={theme.onPrimary}
                            strokeWidth={2}
                        />
                        <Text style={[styles.headerActionButtonText, { color: theme.onPrimary }]}>
                            Add New List
                        </Text>
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
                                    color={theme.onPrimary}
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
                                    color={theme.onPrimary}
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
                <View
                    style={[
                        styles.searchContainer,
                        { backgroundColor: theme.surface, borderColor: theme.outline },
                    ]}
                >
                    <Feather
                        name="search"
                        size={18}
                        color={theme.onSurfaceVariant}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        containerStyle={styles.searchInput}
                        style={[
                            styles.searchInputField,
                            searchQuery.length > 0 && styles.searchInputFieldWithClear,
                        ]}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable
                            onPress={() => setSearchQuery('')}
                            style={({ pressed }) => [
                                styles.clearButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                        >
                            <Feather name="x" size={18} color={theme.onSurfaceVariant} />
                        </Pressable>
                    )}
                </View>
                <DropProvider>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.listsScroll}
                        contentContainerStyle={styles.listsContainer}
                    >
                        {lists.map(list => {
                            const tasks = filteredTasks.filter(t => t.listId === list.id);

                            return <BoardColumn key={list.id} list={list} tasks={tasks} />;
                        })}
                    </ScrollView>
                </DropProvider>
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
    },
    boardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        borderWidth: 1,
    },
    searchIcon: {
        marginLeft: spacing.xs,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
    },
    searchInputField: {
        borderWidth: 0,
        paddingHorizontal: 0,
        paddingVertical: spacing.xs,
    },
    searchInputFieldWithClear: {
        paddingRight: spacing.md,
    },
    clearButton: {
        padding: spacing.xs,
        marginRight: spacing.xs,
    },
    listsScroll: {
        flex: 1,
    },
    listsContainer: {
        gap: 12,
        paddingBottom: 24,
    },
});
