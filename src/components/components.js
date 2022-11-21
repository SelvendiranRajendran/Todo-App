/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {APP_PRIMARY_COLOR} from '../Screens/constants/constants';

export const AddIcon = ({onPress}) => {
  const onPressAction = () => {
    onPress(true);
  };
  return (
    <TouchableOpacity onPress={onPressAction} style={styles.addContainer}>
      <Image
        style={styles.addImage}
        source={require('./../Screens/images/plus.png')}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  addContainer: {
    backgroundColor: APP_PRIMARY_COLOR,
    position: 'absolute',
    bottom: 60,
    right: 50, 
    padding: 20,
    borderRadius: 30,
  },
  addImage: {
    height: 20,
    width: 20,
  },
});
