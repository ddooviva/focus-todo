import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function App() {
  const [toDos, setToDos] = useState({});
  const [inputT, setInputT] = useState("");

  const sorting = (a) => {
    const entries = Object.entries(a);

    // 2. 배열을 정렬
    const sortedEntries = entries.sort(([, a], [, b]) => {
      const aStarNotProgress2 = a.star && a.progress !== 2; // a가 star이면서 progress가 2가 아닌 경우
      const bStarNotProgress2 = b.star && b.progress !== 2; // b가 star이면서 progress가 2가 아닌 경우
      const aStarFalse = !a.star; // a가 star가 아닌 경우
      const bStarFalse = !b.star; // b가 star가 아닌 경우
      const aStarAndProgress2 = a.star && a.progress === 2; // a가 star이면서 progress가 2인 경우
      const bStarAndProgress2 = b.star && b.progress === 2; // b가 star이면서 progress가 2인 경우
      const aProgress2 = a.progress === 2 && !a.star; // a가 star가 아니고 progress가 2인 경우
      const bProgress2 = b.progress === 2 && !b.star; // b가 star가 아니고 progress가 2인 경우

      // 정렬 조건
      if (aStarNotProgress2 && !bStarNotProgress2) return -1; // a가 위로
      if (!aStarNotProgress2 && bStarNotProgress2) return 1; // b가 위로

      if (aStarFalse && bStarFalse) {
        if (aProgress2 && !bProgress2) return 1; // a가 progress 2면 b보다 아래로
        if (!aProgress2 && bProgress2) return -1;
        return 0; // b가 위로
      }

      if (aStarAndProgress2 && !bStarAndProgress2) return 1; // a가 아래로
      if (!aStarAndProgress2 && bStarAndProgress2) return -1; // b가 아래로

      return 0; // 둘 다 같으면 순서 유지
    });

    // 3. 정렬된 배열을 다시 객체로 변환
    const sortedToDos = Object.fromEntries(sortedEntries);
    return sortedToDos;
  }

  const giveStar = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].star = !newToDos[key].star;
    setToDos(sorting(newToDos));
  }

  const editTextStart = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].edit = true;
    setToDos(sorting(newToDos));
  }

  const editTextEnd = (event, key) => {
    const newToDos = { ...toDos };
    newToDos[key].text = event.nativeEvent.text;
    newToDos[key].edit = false;
    setToDos(sorting(newToDos));
    if (event.nativeEvent.text === "") { delete newToDos[key] } { return }
  }
  const checking = (key) => {
/*     const key = event._dispatchInstances.child.key
 */    const newToDos = { ...toDos };
    if (toDos[key].progress < 2) { toDos[key].progress = toDos[key].progress + 1 } else { toDos[key].progress = 0 }
    setToDos(sorting(newToDos));
  }
  const addToDo = () => {
    if (inputT !== "") {
      setInputT("");
      const newToDos = { ...toDos, [Date.now()]: { text: inputT, progress: 0, edit: false, star: false } }
      console.log(newToDos)
      setToDos(sorting(newToDos));
    }
  }
  const inputText = (a) => (setInputT(a));
  console.log(toDos)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity><AntDesign name="caretleft" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.date}> 2025.04.21 (월)</Text>
        <TouchableOpacity><AntDesign name="caretright" size={24} color="black" /></TouchableOpacity>
      </View>
      <TextInput style={styles.inputBox}
        placeholder='오늘 할 일을 적어주세요'
        onSubmitEditing={addToDo}
        onChangeText={(a) => inputText(a)}
        value={inputT}>

      </TextInput>
      <View style={styles.listContainer}>

        <ScrollView >
          {Object.keys(toDos).map((key) =>
            <View key={key} style={{ ...styles.list, backgroundColor: (toDos[key].star && toDos[key].progress !== 2 ? "red" : toDos[key].star && toDos[key].progress === 2 ? "lightpink" : "lightgrey"), borderWidth: (toDos[key].star ? 1 : 0), borderColor: "red" }}><TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => checking(key)}><MaterialCommunityIcons style={{ paddingRight: 10 }} name={toDos[key].progress === 0 ? "checkbox-blank-outline" : (toDos[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color="black" /></TouchableOpacity>
              {(!toDos[key].edit ? <Text style={{ ...styles.listText, textDecorationLine: (toDos[key].progress === 2 ? "line-through" : "none"), textDecorationStyle: "double", textDecorationColor: "bold" }} onPress={() => editTextStart(key)} onLongPress={() => giveStar(key)}>{toDos[key].text}</Text> :
                <TextInput style={{ ...styles.listText }} onEndEditing={(event) => editTextEnd(event, key)} autoFocus defaultValue={toDos[key].text}></TextInput>)}
            </View>
          )}

        </ScrollView>
      </View >


      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  header: {
    width: "100%",
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20
  },
  date: {
    fontSize: 20,
    fontWeight: 600
  },
  inputBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    fontSize: 16,
    color: "black",
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dotted",
    marginHorizontal: 30
  },
  listContainer: {
    flex: 6,
    paddingTop: 10,
    marginBottom: 10,
    height: '100%'
  },
  list: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    backgroundColor: "lightgrey",
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    height: 60
  },
  listText: {
    fontSize: 16,
    paddingVertical: 6,
    width: '100%', height: '100%', textAlignVertical: 'bottom'

  }
});
