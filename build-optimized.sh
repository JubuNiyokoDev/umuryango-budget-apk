#!/bin/bash

echo "🚀 Build APK optimisé - Réduction de taille maximale"

# Nettoyage complet
echo "🧹 Nettoyage..."
cd android
./gradlew clean
cd ..

# Suppression des caches
rm -rf node_modules/.cache
rm -rf android/.gradle
rm -rf android/app/build

# Réinstallation optimisée
echo "📦 Installation des dépendances..."
npm ci --production

# Build avec optimisations maximales
echo "🔨 Build APK optimisé..."
cd android
./gradlew assembleRelease \
  --no-daemon \
  --no-build-cache \
  --no-configuration-cache \
  -Dorg.gradle.jvmargs="-Xmx2048m -XX:MaxPermSize=512m" \
  -Pandroid.enableR8.fullMode=true \
  -Pandroid.enableR8=true

echo "✅ APK optimisé généré dans android/app/build/outputs/apk/release/"

# Affichage de la taille
APK_FILE="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_FILE" ]; then
    SIZE=$(du -h "$APK_FILE" | cut -f1)
    echo "📊 Taille finale: $SIZE"
fi