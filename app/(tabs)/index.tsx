import { StyleSheet } from 'react-native';

import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { Text, View } from '@/src/components/Themed';

export default function BoardsScreen() {
    return (
        <SafeAreaScreen>
            <View style={styles.container}>
                <Text style={styles.title}>Boards</Text>
            </View>
        </SafeAreaScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
