#!/bin/bash

# ===== CONFIGURAÇÃO =====
# Default values
VERSION=$(grep 'versionName' android/app/build.gradle | head -1 | sed 's/.*"\(.*\)".*/\1/')

ENVIRONMENT="debug"
BUILD_MODE="production" # pode ser "production" ou "development"

# ===== PARSE FLAG =====
for ARG in "$@"; do
  case $ARG in
    --env=prod)
      BUILD_MODE="production"
      ENVIRONMENT="release"
      shift
      ;;
    --env=dev)
      BUILD_MODE="development"
      ENVIRONMENT="debug"
      shift
      ;;
    --version=*)
      VERSION="${ARG#*=}"
      shift
      ;;
  esac
done

echo "Build mode: $BUILD_MODE"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"

# ===== CAMINHOS =====
ANDROID_DIR="android"
APK_SRC="$ANDROID_DIR/app/build/outputs/apk/$ENVIRONMENT/app-$ENVIRONMENT.apk"
APK_DEST="builds/app-${VERSION}-${ENVIRONMENT}.apk"

# ===== PASSO 1: Build web React =====
if [ "$BUILD_MODE" = "production" ]; then
  echo "Building React (production)..."
  npm run build:prod
else
  echo "Building React (development)..."
  npm run build:dev
fi

# ===== PASSO 2: Syncronizar =====
echo "Sync..."
npx cap sync android

# ===== PASSO 3: Gerar APK =====

echo "Building Android APK..."
cd $ANDROID_DIR
if [ "$BUILD_MODE" = "production" ]; then
  ./gradlew assembleRelease
else
  ./gradlew assembleDebug
fi
cd ..

# ===== PASSO 4: Renomear e mover APK =====
mkdir -p builds/
cp "$APK_SRC" "$APK_DEST"

echo "APK gerado em: $APK_DEST"
