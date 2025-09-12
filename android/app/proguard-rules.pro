# Optimisations ProGuard ULTRA-AGRESSIVES pour taille minimale
-optimizationpasses 10
-allowaccessmodification
-mergeinterfacesaggressively
-repackageclasses ''
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# Optimisations maximales
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*

# Suppression TOTALE des logs et debug
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
    public static *** wtf(...);
}

-assumenosideeffects class java.io.PrintStream {
    public void println(...);
    public void print(...);
}

# Suppression des assertions
-assumenosideeffects class * {
    boolean assert*(...);
}

# React Native minimal
-keep class com.facebook.react.ReactApplication { *; }
-keep class com.facebook.react.ReactNativeHost { *; }
-keep class com.facebook.react.ReactPackage { *; }
-keep class com.facebook.react.shell.MainReactPackage { *; }
-keep class com.facebook.soloader.** { *; }

# App minimal
-keep class com.jubuniyokodev.umuryangobudget.MainApplication { *; }
-keep class com.jubuniyokodev.umuryangobudget.MainActivity { *; }

# Suppression métadonnées non-essentielles
-keepattributes Signature
-keepattributes *Annotation*

# Suppression des classes inutiles
-dontwarn **
-ignorewarnings

# Optimisation ressources
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Suppression des bibliothèques de test
-dontwarn junit.**
-dontwarn org.mockito.**
-dontwarn org.junit.**