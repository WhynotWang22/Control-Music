import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,
   PermissionsAndroid, ActivityIndicator, NativeModules,
    Button, NativeEventEmitter} from 'react-native';
import Sound from 'react-native-sound';

const {MusicModlue} = NativeModules;
const TakeMusic = () => {

  const [name, setName] = useState('');
  const [mp3Files, setMP3Files] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  let sound: Sound | null = null;
  const loadSound = () => {
    sound = new Sound('/storage/emulated/0/Download//Quên Người Đã Quá Yêu (Orinn Remix) - Hà Duy Thái - Nhạc Remix EDM Tik Tok Gây Nghiện Hay Nhất 2021.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Error loading sound:', error);
      }
    });
  };
 
  const playSound = () => {
    if (sound) {
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Sound playback failed');
        }
      });
    }
  };
  const handleClick = () => {
    MusicModlue.sayHello('wang', (err: any, message: any) => {
      if (err) {
        console.log(err);
        return;
      }
      setName(message);
    });
  };

  const handleTakeMusic = async () => {
    setLoading(true);
    const permissionResult = await requestStoragePermission();
    
    if (permissionResult === 'granted') {
      fetchMP3Files();
    } else {
      console.log('Storage permission denied');
      setLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'App Storage Permission',
          message: 'App needs access to your storage to read MP3 files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return result;
    } catch (error) {
      console.warn(error);
    }
  };

  const fetchMP3Files = () => {
    MusicModlue.getMP3Files((err: any, files: string[]) => {
      if (err) {
        console.log(err);
        setLoading(false);
        return;
      }
      setMP3Files(files);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMP3Files()
  }, []);

  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 100 }} onPress={handleClick}>Hi</Text>
      <Text style={{ textAlign: 'center', marginTop: 120, color: 'red' }}>{name}</Text>
      <TouchableOpacity style={styles.fileList} onPress={handleTakeMusic}>
        <Text>MP3 Files:</Text>
        {loading ? (
          <ActivityIndicator size="small" color="gray" />
        ) : (
          mp3Files.map((file, index) => (
            <Text key={index}>{file}</Text>
          ))
        )}
      </TouchableOpacity>
      <Button title="Load Sound" onPress={loadSound} />
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  fileList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default TakeMusic;
