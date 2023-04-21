import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const basketballImage = require('./Images/bballimage.jpg');

function EnterGameScreen({ navigation }){
  const [points, setPoints] = useState("");
  const [rebounds, setRebounds] = useState("");
  const [assists, setAssists] = useState("");
  const [steals, setSteals] = useState("");
  const [blocks, setBlocks] = useState("");
  const [opponent, setOpponent] = useState("");

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
        navigation.navigate('Statistics', {
          lastPoints: points,
          lastRebounds: rebounds,
          lastAssists: assists,
          lastSteals: steals,
          lastBlocks: blocks,
          lastOpponent: opponent,
        });
      }}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  )
} 

function StatsScreen({ route }){
  const { lastPoints } = route.params;
  const { lastRebounds } = route.params;
  const { lastAssists } = route.params;
  const { lastSteals } = route.params;
  const { lastBlocks } = route.params;
  const { lastOpponent } = route.params;

  return(
    <View style={styles.statsContainer}>
      <Text style={styles.lastGameHeader}>Last Game</Text>
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
    </View>
    
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
    marginBottom: 20,
    marginLeft: 50,
  },
  lastGameItem: {
    marginLeft: 50,
    marginBottom: 10,
    fontSize: 20,
  },
  gameHistoryHeader: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  gameHistoryItem: {
    marginLeft: 30,
    marginBottom: 5,
    fontSize: 15,
  }
});
