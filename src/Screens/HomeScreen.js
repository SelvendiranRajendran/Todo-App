import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import RenderItem from './RenderItem';
import {APP_PRIMARY_COLOR, DEVICE_WIDTH} from './constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTodoModal from './Modals/AddTodoModal';

const HomeScreen = () => {
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const storeTodoList = async list => {
    try {
      const formattedList = JSON.stringify(list);
      await AsyncStorage.setItem('@todoList', formattedList);
    } catch (e) {
      console.log(e);
    }
  };
  const getTodoList = async () => {
    const list = await AsyncStorage.getItem('@todoList').then(res => {
      return JSON.parse(res);
    });
    return list ? list : [];
  };
  const addToFavorite = async index => {
    const formattedTodoList = [...todoList];
    formattedTodoList[index].favorite = true;
    await storeTodoList([...formattedTodoList]);
    setTodoList([...formattedTodoList]);
  };
  const Header = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{'Todo List'}</Text>
      </View>
    );
  }, []);
  const handleRemove = async index => {
    const formattedTodoList = [...todoList];
    formattedTodoList.splice(index, 1);
    await storeTodoList([...formattedTodoList]);
    setTodoList([...formattedTodoList]);
  };
  const AddIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowAddTodoModal(true);
        }}
        style={styles.addContainer}>
        <Image style={styles.addImage} source={require('./images/plus.png')} />
      </TouchableOpacity>
    );
  };
  const setTodo = useCallback(async () => {
    const list = await getTodoList();
    setTodoList(list);
  }, []);
  useEffect(() => {
    setTodo();
  }, [setTodo]);
  const flatlistRef = useRef(null);
  const onApply = async todo => {
    const updatedList = await getTodoList();
    if (updatedList) {
      storeTodoList([todo, ...updatedList]);
    } else {
      storeTodoList([todo]);
    }
    setShowAddTodoModal(false);
    setTodo();
  };
  return (
    <View style={styles.mainConatiner}>
      <Header />
      <ScrollView ref={flatlistRef}>
        <ScrollView contentContainerStyle={{width: DEVICE_WIDTH}} horizontal>
          <FlatList
            data={todoList}
            keyExtractor={item => String(item?.time)}
            renderItem={({item, index}) => {
              return (
                <RenderItem
                  item={item}
                  addToFavorite={addToFavorite}
                  flatlistRef={flatlistRef}
                  handleRemove={handleRemove}
                  index={index}
                />
              );
            }}
          />
        </ScrollView>
      </ScrollView>
      <AddIcon />
      {showAddTodoModal && (
        <AddTodoModal
          visible={showAddTodoModal}
          listLength={todoList.length}
          onApply={onApply}
          setVisible={setShowAddTodoModal}
        />
      )}
    </View>
  );
};

export default HomeScreen;

export const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: APP_PRIMARY_COLOR,
  },
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
