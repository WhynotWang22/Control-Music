package com.music;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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
    public MusicModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
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
    /// get current
    @ReactMethod
    public void playMusic() {
//        Intent pauseIntent = new Intent(android.content.Intent.ACTION_MEDIA_BUTTON);
//        pauseIntent.putExtra(Intent.EXTRA_KEY_EVENT, new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PAUSE));
//        getReactApplicationContext().sendOrderedBroadcast(pauseIntent, null);
//        audioManager.abandonAudioFocus(null);
        audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        Intent playIntent = new Intent(android.content.Intent.ACTION_MEDIA_BUTTON);
        playIntent.putExtra(Intent.EXTRA_KEY_EVENT, new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_PLAY));
        getReactApplicationContext().sendOrderedBroadcast(playIntent, null);
    }

    @ReactMethod
    public void pauseMusic() {
        audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        Intent playIntent = new Intent(android.content.Intent.ACTION_MEDIA_BUTTON);
        playIntent.putExtra(Intent.EXTRA_KEY_EVENT, new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PLAY));
        getReactApplicationContext().sendOrderedBroadcast(playIntent, null);
    }
}
