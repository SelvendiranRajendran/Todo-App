import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  BounceIn,
} from 'react-native-reanimated';
import {runOnJS} from 'react-native-reanimated/lib/reanimated2/core';
import {monthss} from './constants/constants';
const RenderItem = ({
  item,
  index,
  flatlistRef,
  handleRemove,
  addToFavorite,
}) => {
  const translateX = useSharedValue(0);
  const screedWidth = Dimensions.get('window').width;
  const getTiming = timeStamp => {
    const dateObj = new Date(timeStamp);
    const hours =
      dateObj.getHours() <= 12 ? dateObj.getHours() : dateObj.getHours() - 12;
    const mins =
      dateObj.getMinutes() < 10
        ? 0 + dateObj.getMinutes()
        : dateObj.getMinutes();
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    const formattedDate = `${monthss[month]} ${date} / ${
      hours < 10 ? '0' + hours : hours
    } : ${mins}`;
    return formattedDate;
  };

  const handleGesture = useAnimatedGestureHandler({
    onActive: event => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (-screedWidth / 2 > translateX.value) {
        runOnJS(handleRemove)(index);
      } else if (screedWidth / 2 < translateX.value) {
        runOnJS(addToFavorite)(index);
      }
      translateX.value = withTiming(0, {duration: 700});
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });
  const alterstyle = useAnimatedStyle(() => {
    return {
      opacity:
        translateX.value === 0
          ? 0
          : translateX.value < 0
          ? interpolate(translateX.value * -1, [0, screedWidth / 2], [0, 1])
          : interpolate(translateX.value, [0, screedWidth / 2], [0, 1]),
      backgroundColor: translateX.value < 0 ? 'red' : 'green',
    };
  });
  return (
    <View style={styles.mainContainer} key={index}>
      <Animated.View style={[styles.alertstyle, alterstyle]} />
      <PanGestureHandler
        simultaneousHandlers={flatlistRef}
        onGestureEvent={handleGesture}>
        <Animated.View
          entering={BounceIn.duration(1000)}
          key={item}
          style={[animatedStyle]}>
          <View style={[styles.textContainer]}>
            <Text style={styles.date}>{getTiming(item?.time)}</Text>
            <Text style={styles.text}>{item.todo}</Text>
          </View>
          {item.favorite && (
            <Image style={styles.image} source={require('./images/star.png')} />
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  textContainer: {
    backgroundColor: '#dff2ed',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    color: 'black',
    flexWrap: 'wrap',
  },
  date: {
    color: 'grey',
    textAlign: 'right',
    paddingHorizontal: 20,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  alertstyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: {height: 30, width: 30, position: 'absolute', right: 0},
});

export default RenderItem;
