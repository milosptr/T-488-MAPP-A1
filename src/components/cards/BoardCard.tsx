import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import type { Board } from '@/src/types/data';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';

interface BoardCardProps {
    board: Board;
    style?: ViewStyle;
    onPress: () => void;
}

export function BoardCard({ board, style, onPress }: BoardCardProps) {
    const theme = useTheme();
    const getTasksByBoardId = useStore(state => state.getTasksByBoardId);
    const tasks = getTasksByBoardId(board.id);

    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <View
                    style={[
                        styles.card,
                        style,
                        { borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
                    ]}
                >
                    <View>
                        <Image
                            source={{ uri: board.thumbnailPhoto }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.6 }}
                            style={styles.gradient}
                        />
                        <View style={styles.tasksContainer}>
                            <Text style={[styles.tasks, { backgroundColor: theme.border }]}>
                                {tasks.length} tasks
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.content, { backgroundColor: theme.surface }]}>
                        <Text style={styles.name}>{board.name}</Text>
                        <Text style={styles.description}>{board.description}</Text>
                    </View>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        opacity: 0.7,
    },
    tasksContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    tasks: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
