import { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import {
    ImageViewer,
    Button,
    EmojiPicker,
    IconButton,
    CircleButton,
    EmojiSticker,
} from '../components';

import EmojiList from './EmojiList'

const PlaceholderImage = require('../../assets/images/background-image.png');

const Home = () => {
    const imageRef = useRef();

    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);

    const [status, requestPermission] = MediaLibrary.usePermissions();

    console.log("status", status)
    if (status === null) {
        requestPermission();
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert('You did not select any image.');
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
    };

    const onSaveImageAsync = async () => {
        try {
            const localUri = await captureRef(imageRef, {
                height: 440,
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                alert("Saved!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.areaView}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View ref={imageRef} collapsable={false}>
                        <ImageViewer
                            placeholderImageSource={PlaceholderImage}
                            selectedImage={selectedImage}
                        />
                        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
                    </View>
                </View>
                {showAppOptions ? (
                    <View style={styles.optionsContainer}>
                        <View style={styles.optionsRow}>
                            <IconButton icon="refresh" label="Reset" onPress={onReset} />
                            <CircleButton onPress={onAddSticker} />
                            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.footerContainer}>
                        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
                        <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                    </View>
                )}
                <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                    <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
                </EmojiPicker>
                <StatusBar style="auto" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});

export default Home
