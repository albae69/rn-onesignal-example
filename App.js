import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import OneSignal from 'react-native-onesignal';

const App = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  let appId = '17e3330d-7aab-433b-8074-5a2686c150e6';

  useEffect(() => {
    // onesignal setup start
    OneSignal.setAppId(appId);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse((res) => {
      console.log('prompt response', res);
    });
    // onesignal setup end

    // onesignal handler start
    OneSignal.setNotificationWillShowInForegroundHandler((foregroundNotif) => {
      console.log('one signal notification foreground: ', foregroundNotif);
      let notif = foregroundNotif.getNotification();

      const btn1 = {
        text: 'cancel',
        onePress: () => {
          foregroundNotif.complete();
        },
        style: 'cancel',
      };

      const btn2 = {
        text: 'complete',
        onePress: () => {
          foregroundNotif.complete(notif);
        },
      };
      Alert.alert('complete notification?', 'tes', [btn1, btn2], {
        cancelable: true,
      });
    });

    OneSignal.setNotificationOpenedHandler((notification) =>
      console.log('onesignal: notification opened', notification),
    );
    OneSignal.setInAppMessageClickHandler((e) => console.log('iam clicked', e));
    OneSignal.addEmailSubscriptionObserver((e) =>
      console.log('onesignal email subscription changed', e),
    );
    OneSignal.addSubscriptionObserver((e) => {
      console.log('onesignal subscription changed', e);
      setIsSubscribed(e.to.isSubscribed);
    });
    OneSignal.addPermissionObserver((e) =>
      console.log('onesignal: permission changed', e),
    );

    const getDevice = async () => {
      const device = await OneSignal.getDeviceState();
      return device;
    };

    getDevice()
      .then((res) => {
        setIsSubscribed(res);
        console.log(res);
      })
      .catch((err) => console.log('error', err));
    // onesignal handler end
  }, []);

  return (
    <View>
      <Text>Hello World!</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
