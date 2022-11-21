import React, {useEffect, useState} from 'react';
import HomeScreen from './src/Screens/HomeScreen';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LoginScreen from './src/Screens/constants/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getAccessToken, UPDATE_TOKEN} from './src/Screens/constants/constants';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
const App = () => {
  const Stack = createNativeStackNavigator();
  const [accessToken, setAccessToken] = useState(null);
  const initialState = {
    accessToken: null,
  };
  const getDate = async () => {
    const token = await getAccessToken();
    setAccessToken(token);
  };
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_TOKEN:
        state.accessToken = action.payload;
        return state;
      default:
        return state;
    }
  };
  const store = createStore(reducer);
  useEffect(() => {
    getDate();
  }, []);
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.mainConatiner}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {accessToken ? (
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
            ) : (
              <>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};
const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
  },
  button: {height: 30, width: 300, backgroundColor: 'red'},
});
export default App;
