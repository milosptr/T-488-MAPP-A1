import { BoardBottomSheetModal } from '@/src/components/bottom-sheet';
import { GlassView } from '@/src/components/ui/GlassView';
import { Text, View } from '@/src/components/ui/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useShallowStore } from '@/src/store/useStore';
import type { Board } from '@/src/types/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Image, Platform, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

const PRESSED_OPACITY = 0.8;
const GRADIENT_COLORS = ['rgba(0, 0, 0, 0.5)', 'transparent'] as const;
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 0, y: 0.8 };
const HIT_SLOP = 10;
const ICON_SIZE = 20;
const THUMBNAIL_HEIGHT = 200;
const OPACITY_DESCRIPTION = 0.7;

interface BoardCardProps {
    board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
    const theme = useTheme();
    const router = useRouter();
    const lists = useShallowStore(state => state.lists.filter(list => list.boardId === board.id));
    const tasks = useShallowStore(state => {
        const boardLists = state.lists.filter(list => list.boardId === board.id);
        const listIds = new Set(boardLists.map(list => list.id));
        return state.tasks.filter(task => listIds.has(task.listId));
    });
    const boardBottomSheetModalRef = useRef<BottomSheetModal>(null);

    const themedTextStyle = Platform.select({
        android: { color: theme.text },
        default: { color: '#fff' },
    });

    const handlePress = () => {
        router.push(`/boards/${board.id}`);
    };

    const handleMorePress = () => {
        boardBottomSheetModalRef.current?.present();
    };

    return (
        <>
            <Pressable onPress={handlePress} onLongPress={handleMorePress}>
                {({ pressed }) => (
                    <View
                        style={[
                            styles.card,
                            { borderColor: theme.border, opacity: pressed ? PRESSED_OPACITY : 1 },
                        ]}
                    >
                        <View>
                            <Image
                                source={{ uri: board.thumbnailPhoto }}
                                style={styles.thumbnail}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={GRADIENT_COLORS}
                                start={GRADIENT_START}
                                end={GRADIENT_END}
                                style={styles.gradient}
                            />
                            <View style={styles.actionsContainer}>
                                <GlassView style={styles.actionItem}>
                                    <Text style={[styles.tasks, themedTextStyle]}>
                                        {lists.length} lists
                                    </Text>
                                </GlassView>
                                <GlassView style={styles.actionItem}>
                                    <Text style={[styles.tasks, themedTextStyle]}>
                                        {tasks.length} tasks
                                    </Text>
                                </GlassView>
                            </View>
                        </View>
                        <View style={[styles.content, { backgroundColor: theme.surface }]}>
                            <View style={styles.contentInfo}>
                                <Text style={styles.name}>{board.name}</Text>
                                <Text style={styles.description}>{board.description}</Text>
                            </View>
                            <TouchableOpacity hitSlop={HIT_SLOP} onPress={handleMorePress}>
                                <MaterialCommunityIcons
                                    name="dots-vertical"
                                    size={ICON_SIZE}
                                    color={theme.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Pressable>
            <BoardBottomSheetModal ref={boardBottomSheetModalRef} boardId={board.id} />
        </>
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
        height: THUMBNAIL_HEIGHT,
    },
    content: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        opacity: OPACITY_DESCRIPTION,
    },
    tasks: {
        fontSize: 12,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    actionsContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        gap: 8,
        flexDirection: 'row',
    },
    actionItem: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    contentInfo: {
        flex: 1,
        flexShrink: 1,
    },
});
