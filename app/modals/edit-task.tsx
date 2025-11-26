import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Button } from '@/src/components/button';
import { TextInput } from '@/src/components/input';
import { SafeAreaScreen } from '@/src/components/SafeAreaScreen';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FormErrors {
    name: string;
    description: string;
}

const INITIAL_ERRORS: FormErrors = {
    name: '',
    description: '',
};

const ERROR_MESSAGES = {
    NAME_REQUIRED: 'Task name is required',
    DESCRIPTION_REQUIRED: 'Description is required',
} as const;

export default function EditTaskScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const task = useStore(state => state.tasks.find(task => task.id === Number(id)));
    const updateTask = useStore(state => state.updateTask);
    const deleteTask = useStore(state => state.deleteTask);
    const allLists = useStore(state => state.lists);

    const [taskName, setTaskName] = useState(task?.name || '');
    const [taskDescription, setTaskDescription] = useState(task?.description || '');
    const [selectedListId, setSelectedListId] = useState(task?.listId || 0);
    const [showListPicker, setShowListPicker] = useState(false);
    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);

    if (!task) {
        return <Redirect href="/+not-found" />;
    }

    const currentList = allLists.find(l => l.id === task.listId);
    const boardLists = allLists.filter(l => l.boardId === currentList?.boardId);

    const handleNameChange = useCallback((text: string) => {
        setTaskName(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    }, []);

    const handleDescriptionChange = useCallback((text: string) => {
        setTaskDescription(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, description: '' }));
        }
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = { ...INITIAL_ERRORS };
        let isValid = true;

        if (!taskName.trim()) {
            newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
            isValid = false;
        }

        if (!taskDescription.trim()) {
            newErrors.description = ERROR_MESSAGES.DESCRIPTION_REQUIRED;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [taskName, taskDescription]);

    const handleUpdateTask = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        updateTask({
            ...task,
            name: taskName.trim(),
            description: taskDescription.trim(),
            listId: selectedListId,
        });
        router.back();
    }, [validateForm, updateTask, task, taskName, taskDescription, selectedListId, router]);

    const handleDeleteTask = useCallback(() => {
        Alert.alert(
            'Delete Task',
            `Are you sure you want to delete "${task.name}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        router.back();
                        setTimeout(() => {
                            deleteTask(task.id);
                        }, 100);
                    },
                },
            ]
        );
    }, [task, deleteTask, router]);

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={24}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScreenHeader title="Edit Task" />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    <TextInput
                        label="Task Name"
                        placeholder="Enter task name"
                        value={taskName}
                        onChangeText={handleNameChange}
                        error={errors.name}
                        returnKeyType="next"
                    />

                    <TextInput
                        label="Description"
                        placeholder="Enter task description"
                        value={taskDescription}
                        onChangeText={handleDescriptionChange}
                        error={errors.description}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        returnKeyType="done"
                    />

                    <View style={styles.listSection}>
                        <Text style={styles.label}>Move to List</Text>
                        <TouchableOpacity
                            style={[
                                styles.listDropdown,
                                { borderColor: theme.border, backgroundColor: theme.surface },
                            ]}
                            onPress={() => setShowListPicker(!showListPicker)}
                        >
                            <Text style={[styles.listDropdownText, { color: theme.text }]}>
                                {boardLists.find(l => l.id === selectedListId)?.name ||
                                    'Select List'}
                            </Text>
                            <MaterialCommunityIcons
                                name={showListPicker ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={theme.text}
                            />
                        </TouchableOpacity>
                        {showListPicker && (
                            <View
                                style={[
                                    styles.listPicker,
                                    { borderColor: theme.border, backgroundColor: theme.surface },
                                ]}
                            >
                                {boardLists.map(list => (
                                    <TouchableOpacity
                                        key={list.id}
                                        style={[
                                            styles.listOption,
                                            selectedListId === list.id && {
                                                backgroundColor: theme.tint + '20',
                                            },
                                        ]}
                                        onPress={() => {
                                            setSelectedListId(list.id);
                                            setShowListPicker(false);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.listColorDot,
                                                { backgroundColor: list.color },
                                            ]}
                                        />
                                        <Text
                                            style={[styles.listOptionText, { color: theme.text }]}
                                        >
                                            {list.name}
                                        </Text>
                                        {selectedListId === list.id && (
                                            <MaterialCommunityIcons
                                                name="check"
                                                size={20}
                                                color={theme.tint}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Update Task" onPress={handleUpdateTask} />
                        <Button
                            title="Delete Task"
                            onPress={handleDeleteTask}
                            variant="danger"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    listSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    listDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    listDropdownText: {
        fontSize: 16,
    },
    listPicker: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    listOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    listColorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    listOptionText: {
        flex: 1,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
});
