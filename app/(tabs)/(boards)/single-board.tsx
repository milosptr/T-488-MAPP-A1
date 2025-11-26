import { Button } from '@/src/components/button';
import { ListCard } from '@/src/components/cards/ListCard';
import AddTaskModal from '@/src/components/input/AddTaskModal';
import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function SingleBoardScreen() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const board = useStore(state => state.boards.find(board => board.id === Number(id)));
    const allLists = useStore(state => state.lists);
    const allTasks = useStore(state => state.tasks);
    const addTask = useStore(state => state.addTask);
    const moveTask = useStore(state => state.moveTask);
    const updateTask = useStore(state => state.updateTask);

    const lists = React.useMemo(
        () => allLists.filter(list => list.boardId === Number(id)),
        [allLists, id]
    );

    const theme = useTheme();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeListId, setActiveListId] = useState<number | null>(null);

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
                        <Button
                            size="small"
                            title="Add List"
                            leadingIcon={
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={16}
                                    color={theme.onButton}
                                />
                            }
                            onPress={() => router.push(`/add-list?boardId=${board.id}`)}
                        />
                    )}
                />
                <Text style={styles.description}>{board.description}</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.listsScroll}
                    contentContainerStyle={styles.listsContainer}
                >
                    {lists.map(list => {
                        const tasks = allTasks.filter(t => t.listId === list.id);

                        return (
                            <View key={list.id} style={[styles.column, { borderColor: theme.border }]}>
                                <ListCard list={list} onPress={() => {}} />

                                <Button
                                    size="small"
                                    title="Add Task"
                                    onPress={() => {
                                        setActiveListId(list.id);
                                        setModalVisible(true);
                                    }}
                                />

                                <View style={styles.tasksList}>
                                    {tasks.map(task => {
                                        const currentListIndex = lists.findIndex(l => l.id === list.id);
                                        const nextList = lists[currentListIndex + 1];
                                        
                                        return (
                                            <View key={task.id} style={[styles.taskCard, { borderColor: theme.border }]}> 
                                                <View style={styles.taskRow}>
                                                    <Button
                                                        size="small"
                                                        title=""
                                                        leadingIcon={
                                                            <MaterialCommunityIcons
                                                                name={task.isFinished ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                                size={20}
                                                                color={theme.text}
                                                            />
                                                        }
                                                        variant="outlined"
                                                        onPress={() => updateTask({ ...task, isFinished: !task.isFinished })}
                                                    />
                                                    <View style={styles.taskContent}>
                                                        <Text style={[
                                                            styles.taskName, 
                                                            { 
                                                                color: theme.text,
                                                                textDecorationLine: task.isFinished ? 'line-through' : 'none',
                                                                opacity: task.isFinished ? 0.6 : 1
                                                            }
                                                        ]}>
                                                            {task.name}
                                                        </Text>
                                                        <Text style={[
                                                            styles.taskDesc, 
                                                            { 
                                                                color: theme.textMuted,
                                                                textDecorationLine: task.isFinished ? 'line-through' : 'none',
                                                                opacity: task.isFinished ? 0.6 : 1
                                                            }
                                                        ]}>
                                                            {task.description}
                                                        </Text>
                                                    </View>
                                                    {nextList && (
                                                        <Button
                                                            size="small"
                                                            title=""
                                                            trailingIcon={
                                                                <MaterialCommunityIcons
                                                                    name="arrow-right"
                                                                    size={16}
                                                                    color={theme.onButton}
                                                                />
                                                            }
                                                            onPress={() => moveTask(task.id, nextList.id)}
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <AddTaskModal
                    visible={!!(modalVisible && activeListId)}
                    onClose={() => setModalVisible(false)}
                    onSubmit={(data) => {
                        if (!activeListId) return;
                        addTask(activeListId, data);
                        setModalVisible(false);
                        setActiveListId(null);
                    }}
                />
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
        paddingHorizontal: 12,
    },
    column: {
        width: 320,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginRight: 12,
        backgroundColor: 'transparent',
    },
    tasksList: {
        marginTop: 12,
    },
    taskCard: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 15,
        fontWeight: '600',
    },
    taskDesc: {
        fontSize: 13,
        marginTop: 4,
    },
});
