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
    console.log('nextAppState', nextAppState)
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
  function handleTodos(i, time, data) {
    setTimeout(function() {
      dispatch({ type: 'ADD_NOTIFICATION', payload: data })
      dispatch({ type: 'REMOVE_TODO', payload: data.id })
    }, time * 1000);
  }

  async function sendPushNotification(expoPushToken) {
    for await (const [i, notif] of state.todos.entries()) {
      const remainingTime = generateRemainingTime(notif.date);

      console.log('appStateVisible', appStateVisible)
      //Decide if the app is active/inactive to send the notifications
      if(appStateVisible === 'active'){
        //@todo CONVERT TO FIREBASE since we are sharing this notifications
        //OR NODEJS BACKEND FOR expo push notifications https://github.com/expo/expo-server-sdk-node
        handleTodos(i, remainingTime, notif);
      }else{
        handleTodos(i, remainingTime, notif);
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
              state.notifications.length > 0 ?
                <View style={styles.badge}>
                  <Text style={{ color: 'white' }}>{state.notifications.length}</Text>
                </View> : null
            }
          </View>
        </TouchableOpacity>
      </View>
      {
        state.todos.length ?
        state.todos.map((sched, i) => {
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
                <Text>{dayjs(sched.date).format('MMM-DD-YYYY LT')}</Text>
              </View>
            </Card>
          );
        }) : <View style={styles.notodos}>
              <Text>No Todos</Text>
            </View>

      }
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'flex-start',
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
  },
  notodos: {
    flex: 4, 
    fontWeight: '800',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
});
