import React, { useEffect, useRef, useState } from 'react';
import { AppState, Text, View, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Card  } from "react-native-elements";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime  from 'dayjs/plugin/relativeTime';
import * as Notifications from 'expo-notifications';
import { TouchableOpacity } from 'react-native-gesture-handler';
import registerForPushNotificationsAsync from '../utils/registerForPushNotifications';
import { useStore } from '../store/useStore';


dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

console.ignoredYellowBox = [
  'Setting a timer'
]

//GET ALL TODOS
const schedules = [
  {
     title: 'Grocery',
     notificationStart: dayjs(),
     notificationEnd: dayjs().add(1, 'minute'),
  },
  {
     title: 'Gym Class',
     notificationStart: dayjs().add(5, 'minute'),
     notificationEnd: dayjs().add(6, 'minute'),// add time here for testing
  },
  {
     title: 'Movie Night',
     shared: true,
     matched: {
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      name: 'Dennis',
     },
     notificationStart: dayjs().add(10, 'minute'),
     notificationEnd: dayjs().add(11, 'minute'),// add time here for testing
  },
]

export default function Home({navigation}) {
  const { state, dispatch } = useStore();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);


  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  
  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  function generateRemainingTime(date) {
    const from = dayjs(); //current date
    const to = dayjs(date); //scheduled notification
    return to.diff(from, "seconds");
  }

  async function sendPushNotification(expoPushToken) {
    for await (const notif of schedules) {
      const remainingTime = generateRemainingTime(notif.date);

      //Decide if the app is active/inactive to send the notifications
      if(appStateVisible === 'active'){
        //@todo CONVERT TO FIREBASE since we are sharing this notifications
        setTimeout(() => {
          dispatch({ type: 'LOCAL_NOTIFICATION', payload: notif })
        }, remainingTime * 1000)
      }else{
        Notifications.scheduleNotificationAsync({
          content: {
            title: notif.title,
            body: dayjs(notif.date).toNow(),
            data: { data: notif },
          },
          trigger: { seconds: remainingTime  },
        });
      }

    } 
  }


  //@todo trigger the pushNotification at useEffect
  useEffect(() => {
    sendPushNotification();
  }, [])

  return (
    <View style={styles.view}>
      <View style={styles.viewAvatar}>
        <Avatar
          rounded
          size="medium"
          source={{
            uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <View style={{marginRight: 15}}>
            <Ionicons name="ios-notifications-outline" size={40}/>
            {
              //global state
              state.todos.length > 0 ?
                <View style={styles.badge}>
                  <Text style={{ color: 'white' }}>{state.todos.length}</Text>
                </View> : null
            }
          </View>
        </TouchableOpacity>
      </View>
      {
        schedules.map((sched, i) => {
          return (
            <Card  key={i} containerStyle={styles.cardview} >
              <View>
                <Text>{sched.title}</Text>
                {!sched.shared ?
                  (<Avatar 
                    rounded 
                    containerStyle={styles.image} 
                    source={ require('../assets/lock.png') } 
                  />) :
                  (<Avatar
                    rounded
                    containerStyle={styles.image}
                    source={{ uri: sched.matched.avatar }}
                  />)}
                <Text>start: {dayjs(sched.notificationStart).format('MMM-DD-YYYY LT')}</Text>
                <Text>end: {dayjs(sched.notificationEnd).format('MMM-DD-YYYY LT')}</Text>
              </View>
            </Card>
          );
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30
  },
  viewAvatar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between'
  },
  cardview: {
    padding: 20,
    alignSelf: 'stretch'
  },
  image: {
    marginLeft: 'auto'
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: 5,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
