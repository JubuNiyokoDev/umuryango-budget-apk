package com.jubuniyokodev.umuryangobudget;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;

public class InstallApkModule extends ReactContextBaseJavaModule {

    public InstallApkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNInstallApk";
    }

    @ReactMethod
    public void install(String filePath) {
        try {
            File file = new File(filePath);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                Uri apkUri = FileProvider.getUriForFile(
                    getReactApplicationContext(),
                    getReactApplicationContext().getPackageName() + ".fileprovider",
                    file
                );
                intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
            }
            
            getReactApplicationContext().startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}