import React, { createContext, useContext, useReducer } from "react";
import dayjs from 'dayjs';

//GET ALL TODOS by USER ID order by DESC,
const initialState = {
  todos: [
    {
      title: "Jogging",
      userId: 1001,
      notificationId: 1,
      notificationStart: dayjs('1990-02-02'),
      notificationEnd: dayjs('1990-02-02').add(5, 'minute'),
    },
    {
      title: "Market",
      userId: 1001,
      notificationId: 2,
      notificationStart: dayjs('2020-02-06'),
      notificationEnd: dayjs('2020-02-06').add(5, 'minute'),
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOCAL_NOTIFICATION":
      return {
        ...state,
        todos: state.todos.concat(action.payload)
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