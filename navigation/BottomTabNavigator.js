import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Home from '../screens/Home';
import Notification from '../screens/Notification';

const BottomTab = createBottomTabNavigator();
const TabOneStack = createStackNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen
        name="Home"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <Ionicons size={30} style={{ marginBottom: -3 }} name="ios-home" color={color} />,
          tabBarVisible: false,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: 'Home' }}
      />
      <TabOneStack.Screen
        name="Notification"
        component={Notification}
        options={{ headerTitle: 'Notification' }}
      />
    </TabOneStack.Navigator>
  );
}

// const TabTwoStack = createStackNavigator();

// function TabTwoNavigator() {
//   return (
//     <TabTwoStack.Navigator>
//       <TabTwoStack.Screen
//         name="Notification"
//         component={Notification}
//         options={{ headerTitle: 'Notifications' }}
//       />
//     </TabTwoStack.Navigator>
//   );
// }
