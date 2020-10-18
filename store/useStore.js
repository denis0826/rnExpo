import React, { createContext, useContext, useReducer } from "react";
import dayjs from 'dayjs';

//GET ALL TODOS by USER ID order by DESC,
const initialState = {
  todos: [
    {
      id: 1,
      title: 'Grocery',
      date: dayjs().add(10, 'second'),
    },
    {
      id: 2,
      title: 'Gym Class',
      date: dayjs().add(20, 'second'),
    },
    {
      id: 3,
      title: 'Movie Night',
      shared: true,
      matched: {
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        name: 'Dennis',
      },
      date: dayjs().add(30, 'second'),
    },
  ],
  notifications: [
    {
      id: 5,
      title: "Market",
      userId: 1001,
      notificationId: 2,
      date: dayjs('2020-02-06').add(5, 'minute'),
    },
    {
      id: 6,
      title: "Jogging",
      userId: 1001,
      notificationId: 1,
      date: dayjs('1990-02-02').add(5, 'minute'),
    },
  ]
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload].concat(state.notifications)
      }
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    default:
      return state;
  }
};

const Store = createContext({
  dispatch: () => null,
  state: initialState,
});
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ dispatch, state }}>{children}</Store.Provider>
  );
};
export const useStore = () => useContext(Store);
export default StoreProvider;