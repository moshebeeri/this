keytool -genkey -v -dname 'CN=Supriya,OU=StrapMobile,O=GeekyAnts,L=Bangalore,ST=Karnataka,C=IN' -keystore social-app-key.keystore -keypass ***** -storepass ***** -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
mv social-app-key.keystore ../android/app
cd ../android
./gradlew clean
./gradlew assembleRelease