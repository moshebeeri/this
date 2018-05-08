#!/usr/bin/env bash
cd android && ./gradlew assembleStaging && cd ..
if [ $1 == "run" ]; then
    react-native run-android --variant=staging
fi

