package com.music;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.text.TextUtils;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;


import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MusicModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private AudioManager audioManager;
    private MediaPlayer mediaPlayer;

    public MusicModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
        mediaPlayer = new MediaPlayer();
    }

    @NonNull
    @Override
    public String getName() {
        return "MusicModule";
    }

    @ReactMethod
    public void sayHello(String name, Callback callback) {
        try {
            String message = "Hello World " + name;
            callback.invoke(null, message);
        } catch (Exception e) {
            callback.invoke(e.toString(), null);
        }
    }

    @ReactMethod
    public void getMP3Files(Callback callback) {
        List<String> mp3Files = new ArrayList<>();

        try {
            File root = android.os.Environment.getExternalStorageDirectory();
            findMP3Files(root, mp3Files);

            WritableArray mp3FilesArray = Arguments.fromList(mp3Files);
            callback.invoke(null, mp3FilesArray);
        } catch (Exception e) {
            callback.invoke(e.toString(), null);
        }
    }

    private void findMP3Files(File dir, List<String> mp3Files) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    findMP3Files(file, mp3Files);
                } else {
                    String fileName = file.getName();
                    if (fileName.endsWith(".mp3")) {
                        mp3Files.add(file.getAbsolutePath());
                    }
                }
            }
        }
    };
//    / get current
    @ReactMethod
    public void playMusic() {
     MediaControllerCompat mediaController = MediaControllerCompat.getMediaController(getCurrentActivity());
        audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        Intent playIntent = new Intent(Intent.ACTION_MEDIA_BUTTON);
        playIntent.putExtra(Intent.EXTRA_KEY_EVENT, new KeyEvent(KeyEvent.ACTION_MULTIPLE, KeyEvent.ACTION_UP));
        getReactApplicationContext().sendOrderedBroadcast(playIntent, null);

    }

//    @ReactMethod
//    public void playMusic(Callback callback) {
//        MediaControllerCompat mediaController = MediaControllerCompat.getMediaController(getCurrentActivity());
//
//        if (mediaController != null && mediaController.getPlaybackState() != null &&
//                mediaController.getPlaybackState().getState() == PlaybackStateCompat.STATE_PLAYING) {
//            // Nhạc đang phát, thực hiện các hành động cần thiết
//            // Ví dụ: tạm dừng nhạc
//            mediaController.getTransportControls().pause();
//            callback.invoke("Music is paused");
//        } else {
//            // Nhạc không phát, thực hiện các hành động cần thiết
//            // Ví dụ: phát nhạc
//            mediaController.getTransportControls().play();
//            callback.invoke("Music is played");
//        }
//    }

    @ReactMethod
    public void pauseMusic() {
        audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        Intent playIntent = new Intent(android.content.Intent.ACTION_MEDIA_BUTTON);
        playIntent.putExtra(Intent.EXTRA_KEY_EVENT, new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PLAY));
        getReactApplicationContext().sendOrderedBroadcast(playIntent, null);
    };

    @ReactMethod
    public void isMusicPlaying(Promise promise) {
        String packageName = getPackageNameOfCurrentlyPlayingApp(getReactApplicationContext());

        if (!TextUtils.isEmpty(packageName)) {
            promise.resolve("Music is playing in " + packageName);
        } else {
            promise.resolve("Music is not playing");
        }
    }

    private String getPackageNameOfCurrentlyPlayingApp(Context context) {
        Intent intent = new Intent(Intent.ACTION_MEDIA_BUTTON);
        PackageManager pm = context.getPackageManager();
        List<ResolveInfo> resolveInfoList = pm.queryBroadcastReceivers(intent, 0);

        for (ResolveInfo resolveInfo : resolveInfoList) {
            ComponentName componentName = new ComponentName(resolveInfo.activityInfo.packageName, resolveInfo.activityInfo.name);
            MediaControllerCompat controller = MediaControllerCompat.getMediaController((Activity) getCurrentActivity());

            if (controller != null && controller.getPlaybackState() != null &&
                    controller.getPlaybackState().getState() == PlaybackStateCompat.STATE_PLAYING) {
                return resolveInfo.activityInfo.packageName;
            }
        }

        return null;
    }
}