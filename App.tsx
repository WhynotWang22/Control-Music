import React, { useState, useEffect } from 'react'
import {
    ImageBackground,
    Button,
    AppState,
    View,
    FlatList,
    Text,
    NativeModules
} from 'react-native'
import RNAndroidNotificationListener from 'react-native-android-notification-listener'
import { setupPlayer, addTracks } from './trackPlayerServices';
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from './styles'
import { Notification } from './renderItem'
import TrackPlayer from 'react-native-track-player';

let interval: any = null;
const {MusicModule} = NativeModules;

const App =() =>{
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [hasPermission, setHasPermission] = useState(false)
    const [lastNotification, setLastNotification] = useState<any>(null)
    const [data, setData] = useState('');
    const handleOnPressPermissionButton = async () => { RNAndroidNotificationListener.requestPermission()}
   
    const handleAppStateChange = async (
        nextAppState: string,
        force = false
    ) => {
        if (nextAppState === 'active' || force) {
            const status =
                await RNAndroidNotificationListener.getPermissionStatus()
            setHasPermission(status !== 'denied')
        }
    }

    const handleCheckNotificationInterval = async () => {
        const lastStoredNotification = await AsyncStorage.getItem('@lastNotification')
        if (lastStoredNotification) {
            setLastNotification(JSON.parse(lastStoredNotification))
        }
    }
    useEffect(() => {
        clearInterval(interval)
        interval = setInterval(handleCheckNotificationInterval, 3000)
        const listener = AppState.addEventListener('change', handleAppStateChange)
        handleAppStateChange('', true)
        return () => {
            clearInterval(interval)
            listener.remove()
        }
    }, [])
  const pause = () => {
    MusicModule.pauseMusic()
  };
  const playMusic = () => {
    MusicModule.playMusic()
  };
  
    const hasGroupedMessages =
        lastNotification &&
        lastNotification.groupedMessages &&
        lastNotification.groupedMessages.length > 0
      
    return (
          //  <ImageBackground source={}>
             <View style={styles.notificationsWrapper}>
                {lastNotification && !hasGroupedMessages && (
                    <FlatList
                        data={[{}]}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={() => <Notification {...lastNotification} />}
                    />
                )}
                <Button title='Cap quyen' onPress={handleOnPressPermissionButton}/>
                <Button title='pause' onPress={pause}/>
                <Button title='play' onPress={playMusic}/>
            </View>
          //  </ImageBackground>
    )
};
export default App