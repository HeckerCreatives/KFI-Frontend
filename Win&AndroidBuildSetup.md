KFI Win & Android Build Set Up

 
*****WINDOWS*****

//build windows
build:electron

//run exe directly for testing
.\node_modules\.bin\electron.cmd electron.js

//build windows
build:exe



*****ANDROID*****

//download
https://developer.android.com/studio#command-tools

//add path
put downloaded cli tool here on c
\Android\Sdk\cmdline-tools\latest\bin

//cd to the path created
\Android\Sdk\cmdline-tools\latest\bin

//run to download other tools
.\sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;33.0.2"

//final folder looks like bellow under \Android\Sdk
build-tools
platform-tools
platforms
cmdline-tools

//run build

//run if no android folder
-npx cap add android

//sync latest
-npx cap sync android

//add local.properties on android root based on path of the tools
sdk.dir=C:\\Android\\Sdk

//if no assets generated works on both win & android
npx capacitor-assets generate

//build apk
-npm run build
-cd android
./gradlew assembleDebug


//other config /app/src/main.AndroidManifest.xml

<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

