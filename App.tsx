import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/JubuNiyokoDev/umuryango-budget/releases/latest';

const App = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'downloading' | 'installing'>('idle');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    getDeviceInfo();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    }
  };

  const getDeviceInfo = async () => {
    try {
      const info = {
        arch: await DeviceInfo.supportedAbis(),
        model: await DeviceInfo.getModel(),
        brand: await DeviceInfo.getBrand(),
        systemVersion: await DeviceInfo.getSystemVersion(),
      };
      setDeviceInfo(info);
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  };

  const getApkUrl = (arch: string[]) => {
    if (arch.includes('arm64-v8a')) return 'arm64-v8a';
    if (arch.includes('armeabi-v7a')) return 'armeabi-v7a';
    if (arch.includes('x86_64')) return 'x86_64';
    if (arch.includes('x86')) return 'x86';
    return 'universal';
  };

  const downloadAndInstall = async () => {
    if (!deviceInfo) {
      Alert.alert('Erreur', 'Impossible de détecter l\'architecture du périphérique');
      return;
    }

    setUpdateStatus('downloading');
    setDownloadProgress(0);
    
    try {
      const response = await fetch(GITHUB_RELEASES_URL);
      const release = await response.json();
      
      const targetArch = getApkUrl(deviceInfo.arch);
      const apkFileName = `app-${targetArch}-release.apk`;
      
      const asset = release.assets.find((asset: any) => 
        asset.name.includes(targetArch) || asset.name.includes('universal')
      );

      if (!asset) {
        Alert.alert('Erreur', 'Aucun APK compatible trouvé');
        setUpdateStatus('idle');
        return;
      }

      const downloadUrl = asset.browser_download_url;
      const localFile = `${RNFS.DownloadDirectoryPath}/umuryango_budget.apk`;

      // Supprimer l'ancien fichier
      if (await RNFS.exists(localFile)) {
        await RNFS.unlink(localFile);
      }

      // Télécharger avec progression
      const downloadResult = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: localFile,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          setDownloadProgress(Math.round(progress));
        },
      });

      const result = await downloadResult.promise;
      
      if (result.statusCode === 200) {
        await installApk(localFile);
      } else {
        throw new Error('Échec du téléchargement');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Impossible de télécharger l\'application');
      setUpdateStatus('idle');
    }
  };

  const installApk = async (filePath: string) => {
    try {
      setUpdateStatus('installing');
      
      // Installation automatique avec Intent Android
      const { NativeModules } = require('react-native');
      const { RNInstallApk } = NativeModules;
      
      if (RNInstallApk) {
        RNInstallApk.install(filePath);
      } else {
        // Fallback: ouvrir le fichier APK
        const intent = {
          action: 'android.intent.action.VIEW',
          data: `file://${filePath}`,
          type: 'application/vnd.android.package-archive',
          flags: 268435456, // FLAG_ACTIVITY_NEW_TASK
        };
        
        NativeModules.IntentLauncher?.startActivity(intent);
      }
    } catch (error) {
      console.error('Install error:', error);
      Alert.alert('Erreur', 'Impossible d\'installer l\'application');
      setUpdateStatus('idle');
    }
  };

  return (
    <LinearGradient
      colors={['#1976D2', '#42A5F5']}
      style={styles.container}>
      
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>UB</Text>
        </View>
        <Text style={styles.title}>Umuryango Budget</Text>
        <Text style={styles.subtitle}>Installateur Universel</Text>
      </View>

      <View style={styles.infoContainer}>
        {deviceInfo && (
          <>
            <Text style={styles.infoText}>📱 {deviceInfo.brand} {deviceInfo.model}</Text>
            <Text style={styles.infoText}>🤖 Android {deviceInfo.systemVersion}</Text>
            <Text style={styles.infoText}>⚙️ {getApkUrl(deviceInfo.arch)}</Text>
          </>
        )}
      </View>

      {updateStatus === 'downloading' && (
        <View style={styles.progressContainer}>
          <Text style={styles.statusText}>Téléchargement... {downloadProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
          </View>
        </View>
      )}

      {updateStatus === 'installing' && (
        <View style={styles.progressContainer}>
          <Text style={styles.statusText}>🔧 Installation en cours...</Text>
          <Text style={styles.installText}>L'application va se lancer automatiquement</Text>
        </View>
      )}

      {updateStatus === 'idle' && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadAndInstall}>
          <Text style={styles.buttonText}>📥 Installer l'Application</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.description}>
        Installation automatique avec remplacement de cet installateur.
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  installText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 10,
  },
  downloadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 250,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default App;