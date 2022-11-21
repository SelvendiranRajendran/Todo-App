import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {BLACK} from '../constants/constants';

const AddTodoModal = ({visible, setVisible, onApply, listLength}) => {
  const [todo, setTodo] = useState('');
  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
      transparent
      animationType="slide">
      <View style={styles.mainContiner}>
        <Pressable
          onPress={() => {
            setVisible(false);
          }}
          style={[StyleSheet.absoluteFill, styles.blur]}
        />
        <View style={styles.textinputContainer}>
          <TextInput
            onChangeText={text => {
              setTodo(text);
            }}
            placeholderTextColor={BLACK}
            style={styles.textInput}
            placeholder="Enter youre to do "
          />
          <TouchableOpacity
            onPress={() => {
              if (todo !== '') {
                onApply({
                  todo: todo,
                  time: new Date().getTime(),
                  id: listLength + 1,
                });
              }
            }}
            style={styles.button}>
            <Text style={styles.text}>{'Add'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddTodoModal;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: '#44d4ad',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  textInput: {
    borderColor: '#3dd1aa',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: BLACK,
  },
  mainContiner: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {color: 'black', fontSize: 17, fontWeight: 'bold'},
  blur: {
    backgroundColor: 'white',
  },
  textinputContainer: {width: '70%'},
});
