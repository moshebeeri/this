cd android && ./gradlew assembleRelease && cd ..
if [ $1 == 'run' ]
then
    react-native run-android --variant=releasepwd
fi
