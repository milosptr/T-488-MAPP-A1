import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Button, ModalCloseButton, TextInput, Text, View } from '@/src/components/ui';
import { SafeAreaScreen, ScreenHeader } from '@/src/components/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';

interface FormErrors {
    name: string;
    description: string;
    thumbnail: string;
}

const INITIAL_ERRORS: FormErrors = {
    name: '',
    description: '',
    thumbnail: '',
};

const ERROR_MESSAGES = {
    NAME_REQUIRED: 'Board name is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    THUMBNAIL_REQUIRED: 'Please select a thumbnail image',
    PERMISSION_DENIED: 'Sorry, we need camera roll permissions to select an image.',
} as const;

const IMAGE_PICKER_CONFIG: ImagePicker.ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
} as const;

export const AddBoardScreen = () => {
    const theme = useTheme();
    const router = useRouter();
    const boards = useStore(state => state.boards);
    const addBoard = useStore(state => state.addBoard);

    const [boardName, setBoardName] = useState('');
    const [boardDescription, setBoardDescription] = useState('');
    const [boardThumbnailPhoto, setBoardThumbnailPhoto] = useState('');
    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);

    const pickImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', ERROR_MESSAGES.PERMISSION_DENIED);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_CONFIG);

        if (!result.canceled && result.assets[0]) {
            setBoardThumbnailPhoto(result.assets[0].uri);
            setErrors(prev => ({ ...prev, thumbnail: '' }));
        }
    }, []);

    const handleNameChange = useCallback((text: string) => {
        setBoardName(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    }, []);

    const handleDescriptionChange = useCallback((text: string) => {
        setBoardDescription(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, description: '' }));
        }
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = { ...INITIAL_ERRORS };
        let isValid = true;

        if (!boardName.trim()) {
            newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
            isValid = false;
        }

        if (!boardDescription.trim()) {
            newErrors.description = ERROR_MESSAGES.DESCRIPTION_REQUIRED;
            isValid = false;
        }

        if (!boardThumbnailPhoto) {
            newErrors.thumbnail = ERROR_MESSAGES.THUMBNAIL_REQUIRED;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [boardName, boardDescription, boardThumbnailPhoto]);

    const handleAddBoard = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        const newId = boards.length > 0 ? Math.max(...boards.map(b => b.id)) + 1 : 1;

        addBoard({
            id: newId,
            name: boardName.trim(),
            description: boardDescription.trim(),
            thumbnailPhoto: boardThumbnailPhoto,
        });

        router.back();
    }, [validateForm, boards, addBoard, boardName, boardDescription, boardThumbnailPhoto, router]);

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={Platform.OS === 'android' ? 48 : 24}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScreenHeader title="Add New Board" rightAction={() => <ModalCloseButton />} />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    <TextInput
                        label="Board Name"
                        placeholder="Enter board name"
                        value={boardName}
                        onChangeText={handleNameChange}
                        error={errors.name}
                        returnKeyType="next"
                    />

                    <TextInput
                        label="Description"
                        placeholder="Enter board description"
                        value={boardDescription}
                        onChangeText={handleDescriptionChange}
                        error={errors.description}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        returnKeyType="done"
                    />

                    <View style={styles.imageSection}>
                        <Text style={styles.label}>Thumbnail Image</Text>

                        {boardThumbnailPhoto ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: boardThumbnailPhoto }}
                                    style={[styles.imagePreview, { borderColor: theme.border }]}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={[
                                        styles.changeImageButton,
                                        { backgroundColor: theme.surface },
                                    ]}
                                >
                                    <Text style={styles.changeImageText}>Change Image</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={pickImage}
                                style={[
                                    styles.imagePlaceholder,
                                    {
                                        backgroundColor: theme.surface,
                                        borderColor: errors.thumbnail ? theme.error : theme.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.imagePlaceholderText,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    Tap to select an image
                                </Text>
                            </TouchableOpacity>
                        )}

                        {errors.thumbnail ? (
                            <Text style={[styles.errorText, { color: theme.error }]}>
                                {errors.thumbnail}
                            </Text>
                        ) : null}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Add Board" onPress={handleAddBoard} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaScreen>
    );
};

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
    imageSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    imagePlaceholder: {
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 14,
    },
    imagePreviewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changeImageText: {
        fontSize: 12,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
});
