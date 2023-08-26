import TrackPlayer from 'react-native-track-player';

// Lấy thông tin bài hát hiện tại
async function getCurrentSongInfo() {
  try {
    const track = await TrackPlayer.getCurrentTrack();
    if (track) {
      const trackObject = await TrackPlayer.getTrack(track);
      return trackObject;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sử dụng getCurrentSongInfo để lấy thông tin và ảnh
getCurrentSongInfo()
  .then(trackInfo => {
    if (trackInfo) {
      console.log(trackInfo.title);
      console.log(trackInfo.artist);
      console.log(trackInfo.album);
      console.log(trackInfo.artwork); // Ảnh album
    } else {
      console.log("No song playing");
    }
  })
  .catch(error => {
    console.error(error);
  });
