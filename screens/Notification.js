import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform  } from 'react-native';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';


const ListViewItemSeparator = () => {
  return (
    <View
      style={{ height: 0.5, width: '100%', backgroundColor: '#080808' }}
    />
  );
};

export default function Notification() {
  const { state } = useStore();
  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={state.notifications}
        renderSeparator={ListViewItemSeparator}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}, i) => (
          <View
            key={`${item.title}-${i}`}
            style={{
              flex: 1,
              flexDirection: 'column',
              paddingTop: 16,
              paddingBottom: 16,
            }}>
              <Text style={styles.textViewContainerHeading}>{item.title}</Text>
              <Text>{dayjs(item.date).format('MMM-DD-YYYY LT')}</Text>
            </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    backgroundColor: '#ffffff',
    padding: 5,
  },

  textViewContainerHeading: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  textViewContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});