@echo off
echo 🚀 Build APK optimise - Reduction de taille maximale

echo 🧹 Nettoyage...
cd android
call gradlew.bat clean
cd ..

echo 📦 Installation des dependances...
call npm ci --production

echo 🔨 Build APK optimise...
cd android
call gradlew.bat assembleRelease --no-daemon --no-build-cache -Pandroid.enableR8.fullMode=true -Pandroid.enableR8=true

echo ✅ APK optimise genere dans android\app\build\outputs\apk\release\

if exist "app\build\outputs\apk\release\app-release.apk" (
    for %%A in ("app\build\outputs\apk\release\app-release.apk") do echo 📊 Taille finale: %%~zA bytes
)

pause