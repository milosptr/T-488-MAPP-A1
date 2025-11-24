import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { Text, View } from '@/src/components/Themed';
import { useStore } from '@/src/store/useStore';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function SingleBoardScreen() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const board = useStore(state => state.boards.find(board => board.id === Number(id)));

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
                <Text style={styles.title}>{board.name}</Text>
                <Text style={styles.description}>{board.description}</Text>
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
});
