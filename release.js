#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Lire la version actuelle
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`📱 Umuryango Budget - Version actuelle: ${currentVersion}`);

// Incrémenter la version
const versionParts = currentVersion.split('.');
versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
const newVersion = versionParts.join('.');

// Mettre à jour package.json
packageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log(`🚀 Nouvelle version: ${newVersion}`);

try {
  // Commit et tag
  execSync('git add package.json', { stdio: 'inherit' });
  execSync(`git commit -m "Release v${newVersion}"`, { stdio: 'inherit' });
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });
  
  console.log(`✅ Release v${newVersion} créée avec succès!`);
  console.log(`📥 APK sera disponible sur: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/tag/v${newVersion}`);
} catch (error) {
  console.error('❌ Erreur lors de la release:', error.message);
}