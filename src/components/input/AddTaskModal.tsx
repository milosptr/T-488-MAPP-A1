import { Text, View } from '@/src/components/Themed';
import { Button } from '@/src/components/button';
import { TextInput } from '@/src/components/input/TextInput';
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import { Modal, View as RNView, StyleSheet } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string; isFinished?: boolean }) => void;
};

export const AddTaskModal = ({ visible, onClose, onSubmit }: Props) => {
    const theme = useTheme();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const handleCreate = () => {
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), description: description.trim() });
        setName('');
        setDescription('');
        onClose();
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.overlay, { backgroundColor: theme.surface }]}> 
                <RNView style={[styles.container, { borderColor: theme.border }]}> 
                    <Text style={[styles.title, { color: theme.text }]}>Add Task</Text>

                    <TextInput
                        label="Title"
                        value={name}
                        onChangeText={setName}
                        placeholder="Task title"
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Optional description"
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.actionsRow}>
                        <Button title="Cancel" size="small" variant="outlined" onPress={handleClose} />
                        <Button title="Create" size="small" onPress={handleCreate} />
                    </View>
                </RNView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        width: '100%',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8,
    },
});

export default AddTaskModal;
