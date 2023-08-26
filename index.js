/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './trackPlayerServices';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage'
TrackPlayer.registerPlaybackService(() => playbackService);


// To open the Android settings so the user can enable it
RNAndroidNotificationListener.requestPermission()
const headlessNotificationListener = async ({notification}) => {
    /**
     * This notification is a JSON string in the follow format:
     *  {
     *      "app": string,
     *      "title": string,
     *      "titleBig": string,
     *      "text": string,
     *      "subText": string,
     *      "summaryText": string,
     *      "bigText": string,
     *      "audioContentsURI": string,
     *      "imageBackgroundURI": string,
     *      "extraInfoText": string,
     *      "groupedMessages": Array<Object> [
     *          {
     *              "title": string,
     *              "text": string
     *          }
     *      ]
     *  }
     */
  
    if (notification) {
      /**
       * Here you could store the notifications in a external API.
       * I'm using AsyncStorage here as an example.
       */
      await AsyncStorage.setItem('@lastNotification', notification);
      // DeviceEventEmitter.emit('notification', notification);
    }
  };
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName,	() => headlessNotificationListener)

AppRegistry.registerComponent(appName, () => App);
