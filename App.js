import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { theme } from './color';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import PagePrevious from './pages/PagePrevious'; // PreviousDate 컴포넌트 임포트
import PageNext from './pages/PageNext'; // PreviousDate 컴포넌트 임포트
import PageGraph from './pages/PageGraph'; // PreviousDate 컴포넌트 임포트
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PageLocationProvider } from './PageLocationContext';
import { usePageLocation } from './PageLocationContext'; // Context 훅 임포트
import { RealDate, TodayDate } from './dateTranslator';
import { ToDosProvider } from './ToDos';
import { useToDos } from './ToDos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <PageLocationProvider>
      <ToDosProvider>
        < NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade', headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="PagePrevious" component={PagePrevious} options={{ animation: 'fade', headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="PageGraph" component={PageGraph} options={{ animation: 'fade', headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="PageNext" component={PageNext} options={{ animation: 'fade', headerShown: false, gestureEnabled: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToDosProvider>
    </PageLocationProvider>
  );
}

const window = {
  width: Dimensions.get('window').width, height: Dimensions.get('window').height
}


export function HomeScreen({ navigation }) {

  const { pageLocation, setPageLocation } = usePageLocation(); // Context 사용
  const { toDos, setToDos } = useToDos();
  const [inputT, setInputT] = useState("");
  const [showLottie, setShowLottie] = useState(false); // 폭죽 표시 상태
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 관리
  const [achiveNum, setAchiveNum] = useState(0);


  useEffect(() => {
    async function loadToDos() {
      const response = await AsyncStorage.getItem("@toDos")
      if (response) { setToDos(JSON.parse(response)) } else { setToDos({}) }
    } loadToDos()
  }, [])

  console.log(toDos)
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (isFirstLaunch === null) {
        const currentDate = TodayDate();
        await AsyncStorage.setItem('@firstDate', JSON.stringify(currentDate));
        await AsyncStorage.setItem('isFirstLaunch', 'false'); // 이후에는 다시 실행되지 않도록 설정
        console.log("앱 처음 실행 날짜 저장:", currentDate);
      } else {
        const savedDate = await AsyncStorage.getItem('@firstDate');
        console.log("저장된 날짜:", JSON.parse(savedDate));
      }
    };

    checkFirstLaunch(); // 비동기 함수 호출
  }, []);

  const dateNum = () => {
    const n = String(TodayDate() + pageLocation);
    const date = new Date(parseInt(n.slice(0, 4), 10), parseInt(n.slice(4, 6), 10) - 1, parseInt(n.slice(6, 8), 10))
    const dayOfWeek = date.getDay();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return n.slice(0, 4) + "." + n.slice(4, 6) + "." + n.slice(6, 8) + " (" + days[dayOfWeek] + ")"
  };
  if (pageLocation === 0) {



    const onSwipe = (event) => {
      if (event.nativeEvent.translationX > 50) {
        const countMinus = (a) => a - 1;
        setTimeout(() => {
          setPageLocation(countMinus(pageLocation));
        }, 100);
      } else if (event.nativeEvent.translationX < -50) {
        const countPlus = (a) => a + 1;
        setTimeout(() => {
          setPageLocation(countPlus(pageLocation));
        }, 100);
      }
    };
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

    const giveStar = async (key) => {
      const newToDos = { ...toDos };
      newToDos[key].star = !newToDos[key].star;
      setToDos(sorting(newToDos));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      await saveToDos(sorting(newToDos));

    }

    const editTextStart = async (key) => {
      const newToDos = { ...toDos };
      newToDos[key].edit = true;
      setToDos(sorting(newToDos));
      await saveToDos(sorting(newToDos));

    }

    const editTextEnd = async (e, key) => {
      e.persist();
      if (e.nativeEvent.text.trim() === "") {
        const newToDos = { ...toDos };
        delete newToDos[key]
        setToDos(sorting(newToDos));
        await saveToDos(sorting(newToDos));
      }
      else {
        const newToDos = { ...toDos };
        newToDos[key].text = e.nativeEvent.text;
        newToDos[key].edit = false;
        setToDos(sorting(newToDos));
        await saveToDos((sorting(newToDos)));
      }
    }
    const checking = async (key) => {
/*     const key = event._dispatchInstances.child.key
 */    const newToDos = { ...toDos };
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      if (toDos[key].progress < 2) { toDos[key].progress = toDos[key].progress + 1 } else { toDos[key].progress = 0 }
      if (newToDos[key].progress === 2 && newToDos[key].star) {
        setShowLottie(true);
        setTimeout(() => setShowLottie(false), 2000); // 3초 후 폭죽 숨기기
        setAnimationKey(animationKey + 1); // 키를 변경하여 리렌더링
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, i * 300);
        }
      } else null;
      setToDos(sorting(newToDos));
      setAchiveNum(() => {
        const num = Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === TodayDate()).length / Object.entries(toDos).filter(([key, value]) => value.date === TodayDate()).length
        return num;
      });
      await saveToDos((sorting(newToDos)));

    }
    const addToDo = async () => {
      if (inputT !== "") {
        setInputT("");
        const newToDos = { ...toDos, [Number(Date.now())]: { text: inputT, progress: 0, edit: false, star: false, date: RealDate(Date.now()) + pageLocation } }
        setToDos(sorting(newToDos));
        await saveToDos((sorting(newToDos)));
        setAchiveNum(() => {
          const num = Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === TodayDate()).length / Object.entries(toDos).filter(([key, value]) => value.date === TodayDate()).length
          return num;
        });
      }
    }

    async function saveToDos(toSave) {
      await AsyncStorage.setItem("@toDos", JSON.stringify(toSave))
    }



    const inputText = (a) => (setInputT(a));

    return <GestureHandlerRootView><PanGestureHandler onGestureEvent={onSwipe}>
      <View style={{ ...styles.container, backgroundColor: "transparent" }}>
        <LottieView
          key={Date.now()}
          PageLocationProvider
          autoPlay
          source={require('./assets/wave1.json')}
          style={{
            position: 'absolute',
            top: (-1050 - 600 * achiveNum) / 667 * window.height,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -5,
            width: '150%',
            height: '500%',
            backgroundColor: "white",
          }}
        ></LottieView>
        <View style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: "black", position: 'absolute', bottom: 0, width: '100%', height: 500 / 667 * window.height * achiveNum, zIndex: -5 }} />

        {showLottie && (<BlurView intensity={5} style={{ ...styles.blurContainer, zIndex: 2 }}>
          <LottieView
            key={animationKey}
            autoPlay
            style={{
              zIndex: 10,
              position: "absolute",
              top: 0,
              left: '-30%',
              right: 0,
              bottom: 0,
              width: window.width * 1.6,
              height: window.height,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            source={require('./assets/confatti1.json')}
          ></LottieView>

        </BlurView>
        )}
        <View style={styles.header}>
          <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme.ddgrey} /></TouchableOpacity>
          <TouchableOpacity onLongPress={() => navigation.navigate('PageGraph')}>
            <View style={{ backgroundColor: theme.dddgrey, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
              <Text style={{ ...styles.date, color: theme.bg }} >{dateNum()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretright" size={24} color={theme.ddgrey} /></TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputBox}
            placeholder='오늘 할 일을 적어주세요'
            onSubmitEditing={addToDo}
            onChangeText={(a) => inputText(a)}
            value={inputT}>
          </TextInput>
        </View>
        <View style={styles.listContainer}>

          <ScrollView >
            {Object.keys(toDos).map((key) => {
              return TodayDate() === toDos[key].date ? (
                <View key={key} style={{
                  ...styles.list, backgroundColor: (toDos[key].star && toDos[key].progress !== 2 ? theme.llgrey : toDos[key].progress === 2 ? theme.dgrey : theme.llgrey), borderWidth: 2, borderColor: (toDos[key].progress === 2 ? theme.dgrey : toDos[key].star && toDos[key].progress !== 2 ? theme.ddgrey : theme.llgrey)
                }}><TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => checking(key)}><MaterialCommunityIcons style={{ paddingRight: 10 }} name={toDos[key].progress === 0 ? "checkbox-blank-outline" : (toDos[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme.dddgrey} /></TouchableOpacity>
                  {(!toDos[key].edit ? <Text style={{ ...styles.listText, textDecorationLine: (toDos[key].progress === 2 ? "line-through" : "none") }} onPress={() => editTextStart(key)} onLongPress={() => giveStar(key)}>{toDos[key].text}</Text> :
                    <TextInput style={{ ...styles.listText }} onEndEditing={(event) => editTextEnd(event, key)} autoFocus defaultValue={toDos[key].text}></TextInput>)}
                  <StatusBar style="dark" />
                </View>) : null
            }
            )}
          </ScrollView>
          <Text onPress={() => { AsyncStorage.clear().then(setToDos({})) }} style={{ color: "red", fontSize: 100 }}>다지우기</Text>
        </View >
      </View >
    </PanGestureHandler>
    </GestureHandlerRootView>
  } else if (pageLocation < 0) { return <PagePrevious></PagePrevious> } else if (pageLocation > 0) { return <PageNext></PageNext> } { return null };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    width: "100%",
    flex: 3,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20
  },
  date: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.dddgrey
  },
  inputContainer: {
    flex: 2
  },
  inputBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: theme.dddgrey,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: theme.dgrey,
    marginHorizontal: 30
  },
  listContainer: {
    flex: 20,
    height: '100%',
    paddingTop: 10
  },
  list: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    backgroundColor: theme.lightgrey,
    margin: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  listText: {
    fontWeight: 500,
    fontSize: 16,
    paddingVertical: 6,
    width: '90%',
    height: '100%',
    color: theme.dddgrey
  },
  blurContainer: {
    overflow: 'hidden',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 400,
    height: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
