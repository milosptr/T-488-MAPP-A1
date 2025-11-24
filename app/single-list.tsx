import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';

export default function SingleListScreen() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();

    const allLists = useStore(state => state.lists);
    const allTasks = useStore(state => state.tasks);
    const updateTask = useStore(state => state.updateTask);
    const moveTask = useStore(state => state.moveTask);

    const listId = Number(id);

    const list = React.useMemo(() => allLists.find(l => l.id === listId), [allLists, listId]);

    const boardLists = React.useMemo(() => {
        if (!list) return [];
        return allLists.filter(l => l.boardId === list.boardId);
    }, [allLists, list]);

    const tasks = React.useMemo(() => allTasks.filter(t => t.listId === listId), [allTasks, listId]);

    if (!list) {
        return <Redirect href="/+not-found" />;
    }

    const toggleFinished = (task: any) => {
        updateTask({ ...task, isFinished: !task.isFinished });
    };

    const moveToNext = (task: any) => {
        if (!list) return;
        const idx = boardLists.findIndex(l => l.id === list.id);
        if (idx === -1) return;
        const nextIdx = (idx + 1) % Math.max(1, boardLists.length);
        const target = boardLists[nextIdx];
        if (target) moveTask(task.id, target.id);
    };

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={24}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.text }]}>{list.name}</Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>Tasks</Text>

                <FlatList
                    data={tasks}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={[styles.taskCard, { borderColor: theme.border }]}>
                            <View style={styles.taskRow}>
                                <Pressable onPress={() => toggleFinished(item)} style={styles.checkbox}>
                                    <MaterialCommunityIcons
                                        name={item.isFinished ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        size={20}
                                        color={theme.text}
                                    />
                                </Pressable>

                                <View style={styles.taskContent}>
                                    <Text style={[styles.taskName, { color: theme.text }]}>{item.name}</Text>
                                    <Text style={[styles.taskDesc, { color: theme.textMuted }]}>
                                        {item.description}
                                    </Text>
                                </View>

                                <Pressable onPress={() => moveToNext(item)} style={styles.moveButton}>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color={theme.text} />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 12,
    },
    list: {
        paddingBottom: 24,
    },
    taskCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        padding: 6,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
    },
    taskDesc: {
        fontSize: 13,
        marginTop: 4,
    },
    moveButton: {
        padding: 8,
    },
});
