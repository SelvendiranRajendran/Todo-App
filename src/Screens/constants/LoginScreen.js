/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import React from 'react';
import {APP_PRIMARY_COLOR, DEVICE_WIDTH, storeToken} from './constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import facebook from '../images/facebook.png';
import apple from '../images/apple.png';
import google from '../images/google.png';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const LoginScreen = ({navigation}) => {
  GoogleSignin.configure({
    webClientId: '1099464574638-rtp6t3hr9246u3rg9h744ajp6jglrof9.apps.googleusercontent.com',
    offlineAccess: true,
  });
  const handleFbLogin = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          let accessToken;
          AccessToken.getCurrentAccessToken()
            .then(data => {
              accessToken = data.accessToken;
              const responseInfoCallback = (error, resResult) => {
                if (error) {
                  console.log(error);
                  console.log('Error fetching data: ' + error.toString());
                } else {
                  console.log(resResult);
                  console.log('Success fetching data: ' + resResult.toString());
                }
              };

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string:
                        'email,name,first_name,middle_name,last_name,picture',
                    },
                  },
                },
                responseInfoCallback,
              );

              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .then(async () => {
              await storeToken(accessToken, navigation);
            });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await storeToken(userInfo?.idToken, navigation);
    } catch (e) {
      console.log('error', e);
    }
  };
  const LoginOptions = [
    {
      name: 'facebook',
      image: facebook,
      onPress: handleFbLogin,
      style: {backgroundColor: '#1778f2'},
    },
    {
      name: 'Apple',
      image: apple,
      onPress: () => {},
      style: {backgroundColor: '#838f86'},
    },
    {
      name: 'google',
      image: google,
      onPress: handleGoogleLogin,
      style: {backgroundColor: 'grey'},
    },
  ];
  const RenderIcons = ({item}) => {
    const scale = useSharedValue(1);
    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [{scaleX: scale.value}],
      };
    });
    const handlePress = () => {
      scale.value = withRepeat(withSpring(1.2), 2, true, () => {
        scale.value = 1;
        runOnJS(item.onPress)();
      });
    };

    return (
      <Animated.View style={[rStyle, item.style, styles.button]}>
        <TouchableOpacity style={styles.TouchableButton} onPress={handlePress}>
          <Text style={styles.text}>Login with {item.name}</Text>
          <Image source={item.image} style={[styles.logo]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainCobatiner}>
      <View style={styles.iconsContainer}>
        {LoginOptions.map((item, index) => (
          <RenderIcons key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  mainCobatiner: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TouchableButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  loginContainer: {
    width: DEVICE_WIDTH / 1.5,
    borderWidth: 2,
    borderColor: APP_PRIMARY_COLOR,
    paddingHorizontal: 5,
    paddingVertical: 70,
    borderRadius: 30,
  },
  button: {
    width: DEVICE_WIDTH / 1.5,
    marginTop: 10,
    paddingVertical: 5,
  },
  logo: {
    height: 30,
    width: 30,
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'grey',
  },
  iconsContainer: {},
});
