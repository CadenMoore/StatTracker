import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite';
import * as WebBrowser from 'expo-web-browser';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const basketballImage = require('./Images/bballimage.jpg');
const performanceURL = 'https://oneupbasketball.com/basketball-player-rating/'

function openDatabase() {
  const db = SQLite.openDatabase("statTracker.db");
  return db;
}

const db = openDatabase();

function Items() {
  const [items, setItems] = useState(null);

  db.transaction((tx) => {
    tx.executeSql(
      `select id, points, rebounds, assists, steals, blocks, opponent, date(itemDate) as itemDate from items order by id desc;`,
      [],
      (_, {rows: {_array}}) => setItems(_array)
    );
  });

  if(items === null || items.length === 0){
    return null;
  }

  return (
    <SafeAreaView style={styles.gameHistoryContainer}>
      {items.map(({ id, points, rebounds, assists, steals, blocks, opponent, itemDate }) => {
        return (
          <Text key={id} style={styles.gameHistoryItem}>
            {itemDate} |  {opponent} - P:{points}, R:{rebounds}, A:{assists}, S:{steals}, B:{blocks}
          </Text>
        )
      })}
    </SafeAreaView>
  )
}

function EnterGameScreen({ navigation }){
  const [points, setPoints] = useState("");
  const [rebounds, setRebounds] = useState("");
  const [assists, setAssists] = useState("");
  const [steals, setSteals] = useState("");
  const [blocks, setBlocks] = useState("");
  const [opponent, setOpponent] = useState("");

  useEffect(() => {
    db.transaction((tx) => {
      //tx.executeSql(
        //"drop table items;"
      //);
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, opponent string, points integer, rebounds integer, assists integer, steals integer, blocks integer, itemDate real);"
      );
    });
  }, []);

  const add = () => {
    if (points === null || points === "" || isNaN(points)){
      return false;
    }
    if (rebounds === null || rebounds === "" || isNaN(rebounds)){
      return false;
    }
    if (assists === null || assists === "" || isNaN(assists)){
      return false;
    }
    if (steals === null || steals === "" || isNaN(steals)){
      return false;
    }
    if (blocks === null || blocks === "" || isNaN(blocks)){
      return false;
    }
    if (opponent == null || opponent === ""){
      return false;
    }

    db.transaction((tx) => {
      tx.executeSql("insert into items (points, rebounds, assists, steals, blocks, opponent, itemDate) values (?, ?, ?, ?, ?, ?, julianday('now'))", [points, rebounds, assists, steals, blocks, opponent]);
      tx.executeSql("select * from items", [], (_, {rows}) =>
        navigateToStats()
        //navigation.navigate('Statistics')
      );
    });
  };

  const navigateToStats = () => {
    navigation.navigate("Statistics", {
      routeLastPoints: points,
      routeLastRebounds: rebounds,
      routeLastAssists: assists,
      routeLastSteals: steals,
      routeLastBlocks: blocks,
      routeLastOpponent: opponent
    })
  }

  return (
    <View style={styles.gameContainer}>
      <Image style={styles.imageContainer} source={basketballImage} />
      <Text style={styles.gameHeader}>Enter Game Stats</Text>
      <TextInput style={styles.textBox}
        placeholder='Opponent'
        onChangeText={input => setOpponent(input)}
      />
      <TextInput style={styles.textBox}
        placeholder='Points'
        onChangeText={input => setPoints(input)}
      />
      <TextInput style={styles.textBox}
        placeholder='Rebounds'
        onChangeText={input => setRebounds(input)}
      />
      <TextInput style={styles.textBox}
        placeholder='Assists'
        onChangeText={input => setAssists(input)}
      />
      <TextInput style={styles.textBox}
        placeholder='Steals'
        onChangeText={input => setSteals(input)}
      />
      <TextInput style={styles.textBox}
        placeholder='Blocks'
        onChangeText={input => setBlocks(input)}
      />
      <Pressable style={styles.button} onPress={() => {
        add();
      }}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  )
} 

function StatsScreen({ route }){
  const [lastPoints, setLastPoints] = useState("N/A");
  const [lastRebounds, setLastRebounds] = useState("N/A");
  const [lastAssists, setLastAssists] = useState("N/A");
  const [lastSteals, setLastSteals] = useState("N/A");
  const [lastBlocks, setLastBlocks] = useState("N/A");
  const [lastOpponent, setLastOpponent] = useState("N/A");

  const {routeLastPoints} = route.params;
  const {routeLastRebounds} = route.params;
  const {routeLastAssists} = route.params;
  const {routeLastSteals} = route.params;
  const {routeLastBlocks} = route.params;
  const {routeLastOpponent} = route.params;

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from items", [], (_, {rows}) =>
          getLastStats(rows)
        );
    })
  })

  const getLastStats = (rows) => {
    if(routeLastPoints === undefined || routeLastRebounds === undefined || routeLastAssists === undefined ||
      routeLastBlocks === undefined || routeLastSteals === undefined || routeLastOpponent === undefined) {
      if(rows.length > 0){
        db.transaction((tx) => {
          tx.executeSql("select points from items order by itemDate desc limit 1", [], (_, {rows}) =>
            setLastPoints(rows.item(0).points)
          );
          tx.executeSql("select rebounds from items order by itemDate desc limit 1", [], (_, {rows}) =>
           setLastRebounds(rows.item(0).rebounds)
          );
          tx.executeSql("select assists from items order by itemDate desc limit 1", [], (_, {rows}) =>
           setLastAssists(rows.item(0).assists)
          );
          tx.executeSql("select steals from items order by itemDate desc limit 1", [], (_, {rows}) =>
           setLastSteals(rows.item(0).steals)
          );
          tx.executeSql("select blocks from items order by itemDate desc limit 1", [], (_, {rows}) =>
           setLastBlocks(rows.item(0).blocks)
          );
          tx.executeSql("select opponent from items order by itemDate desc limit 1", [], (_, {rows}) =>
           setLastOpponent(rows.item(0).opponent)
          );
        })
      }
    } else {
      setLastPoints(routeLastPoints);
      setLastRebounds(routeLastRebounds);
      setLastAssists(routeLastAssists);
      setLastBlocks(routeLastBlocks);
      setLastSteals(routeLastSteals);
      setLastOpponent(routeLastOpponent);
    }
    
  }

  return(
    <SafeAreaView style={styles.statsContainer}>
      <Text style={styles.lastGameHeader}>Last Game</Text>
      <Pressable style={styles.performanceLink}
        onPress = {() => WebBrowser.openBrowserAsync(performanceURL)}
      >
        <Text style={styles.performanceText}>Performance Calculator</Text>
      </Pressable>
      <Text style={styles.lastGameItem}>
        Player:   Caden Moore
      </Text>
      <Text style={styles.lastGameItem}>
        Opponent:   {lastOpponent}
      </Text>
      <Text style={styles.lastGameItem}>
        Points:   {lastPoints}
      </Text>
      <Text style={styles.lastGameItem}>
        Rebounds:   {lastRebounds}
      </Text>
      <Text style={styles.lastGameItem}>
        Assists:   {lastAssists}
      </Text>
      <Text style={styles.lastGameItem}>
        Steals:   {lastSteals}
      </Text>
      <Text style={styles.lastGameItem}>
        Blocks:   {lastBlocks}
      </Text>
      <Text style={styles.gameHistoryHeader}>Game History</Text>
      <ScrollView style={styles.listArea}>
        <Items />
      </ScrollView>
    </SafeAreaView>
    
    
  )
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator useLegacyImplementation initialRouteName='EnterGame'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0075FF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="EnterGame" component={EnterGameScreen}
          options={{title: 'Enter Game', unmountOnBlur: true}}
        />
        <Drawer.Screen name="Statistics" component={StatsScreen}
          options={{title: 'Statistics'}}
          initialParams={{
              lastPoints: 'N/A',
              lastRebounds: 'N/A',
              lastAssists: 'N/A',
              lastSteals: 'N/A',
              lastBlocks: 'N/A',
              lastOpponent: 'N/A',
            }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
  },
  gameHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textBox: {
    height: 35,
    width: 225,
    backgroundColor: '#f5f4f4',
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0075FF',
    height: 40,
    marginTop: 10,
    width: 225,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 7,
    color: '#fff'
  },
  statsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lastGameHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 15,
    marginLeft: 50,
  },
  lastGameItem: {
    marginLeft: 50,
    marginBottom: 10,
    fontSize: 20,
  },
  gameHistoryContainer: {
    marginTop: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  gameHistoryHeader: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  gameHistoryItem: {
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 16,
  },
  listArea: {
    flex: 1,
  },
  performanceLink: {
    marginLeft: 50,
    marginBottom: 20,
  },
  performanceText: {
    fontSize: 17,
    color: '#0075FF',
    fontWeight: 'bold',
  }
});
