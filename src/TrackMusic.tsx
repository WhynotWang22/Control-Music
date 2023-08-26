import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { Event } from 'react-native-track-player';
import { setupPlayer, getCurrentTrack } from '../trackPlayerServices';

const TrackMusic = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
useEffect(() => {
  const fetchCurrentTrack = async () => {
    try {
      const trackObject = await getCurrentTrack();
      setCurrentTrack(trackObject);
    } catch (error) {
      console.error('Error fetching current track:', error);
    }
  };

  // Lắng nghe sự kiện thay đổi bài hát đang phát
  const trackChangeEventListener = TrackPlayer.addEventListener(
    Event.PlaybackTrackChanged,
    fetchCurrentTrack
  );

  // Khi component unmount, loại bỏ lắng nghe sự kiện
  return () => {
    trackChangeEventListener.remove();
  };
}, []);
 

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const trackId = await TrackPlayer.getCurrentTrack();
        if (trackId) {
          const trackObject = await TrackPlayer.getTrack(trackId);
          setCurrentTrack(trackObject);
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
      }
    };

    // Lắng nghe sự kiện thay đổi bài hát đang phát
    const trackChangeEventListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, fetchCurrentTrack);

    // Khi component unmount, loại bỏ lắng nghe sự kiện
    return () => {
      trackChangeEventListener.remove();
    };
  }, []);
  console.log(currentTrack);
  
  return (
    <View>
      {currentTrack ? (
        <View>
          <Text>Title: {currentTrack.title}</Text>
          <Text>Artist: {currentTrack.artist}</Text>
          {/* Hiển thị thông tin khác của bài hát nếu cần */}
        </View>
      ) : (
        <Text>No track is currently playing.</Text>
      )}
    </View>
  );
};

export default TrackMusic;
