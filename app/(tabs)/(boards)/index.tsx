import { ScrollView, StyleSheet } from 'react-native';

import { BoardCard } from '@/src/components/cards/BoardCard';
import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { Text, View } from '@/src/components/Themed';
import { useStore } from '@/src/store/useStore';
import { useRouter } from 'expo-router';

export default function BoardsScreen() {
    const boards = useStore(state => state.boards);
    const router = useRouter();

    return (
        <SafeAreaScreen>
            <View style={styles.container}>
                <Text style={styles.title}>Boards</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        {boards.map(board => (
                            <BoardCard
                                key={board.id}
                                board={board}
                                onPress={() => router.push(`/single-board?id=${board.id}`)}
                            />
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
});
