import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/src/constants/DesignTokens';
import { useStore } from '@/src/store/useStore';
import { View } from '../ui/Themed';
import { Backdrop } from './Backdrop';
import { Button } from '../ui/Button/Button';

type Props = {
    ref: React.RefObject<BottomSheetModal | null>;
    listId: number;
};

export const EditListBottomSheetModal = ({ ref, listId }: Props) => {
    const { bottom } = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const deleteList = useStore(state => state.deleteList);

    const handleEditList = () => {
        ref.current?.close();
        router.push(`/modals/edit-list?id=${listId}`);
    };

    const handleDeleteList = () => {
        ref.current?.close();
        Alert.alert('Delete List', 'Are you sure you want to delete this list?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteList(listId);
                },
            },
        ]);
    };

    const handleAddTask = () => {
        ref.current?.close();
        router.push(`/modals/add-task?listId=${listId}`);
    };

    const handleClose = () => {
        ref.current?.close();
    };

    return (
        <BottomSheetModal
            backdropComponent={Backdrop}
            enableDynamicSizing
            enablePanDownToClose
            ref={ref}
            onDismiss={handleClose}
        >
            <BottomSheetView style={[styles.contentContainer, { paddingBottom: bottom }]}>
                <View style={styles.actionsContainer}>
                    <Button title="Edit List" onPress={handleEditList} />
                    <Button variant="danger" title="Delete List" onPress={handleDeleteList} />
                    <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                    <Button title="Add Task" onPress={handleAddTask} />
                    <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                    <Button variant="outlined" title="Close" onPress={handleClose} />
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    actionsContainer: {
        gap: 8,
    },
    separator: {
        height: 1,
        marginVertical: spacing.lg,
    },
});
