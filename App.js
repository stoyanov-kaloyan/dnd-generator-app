import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import axios from "axios";
import { useFonts } from "expo-font";

const App = () => {
  const [currentMonster, setCurrentMonster] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonsters = async () => {
    try {
      const response = await axios.get("https://www.dnd5eapi.co/api/monsters");
      setMonsters(response.data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching monsters:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonsters();
  }, []);

  const getRandomMonster = async () => {
    if (monsters.length === 0) {
      setCurrentMonster("No monsters available");
      return;
    }
    const randomIndex = Math.floor(Math.random() * monsters.length);
    const randomMonster = monsters[randomIndex];
    console.log(randomMonster.url);
    const url = "https://www.dnd5eapi.co" + randomMonster?.url;
    try {
      const response = await axios.get(url);
      console.log(response.data);
      setIsLoading(true);
      // if (!response.data.image) {
      //   getRandomMonster();
      //   return;
      // }
      setCurrentMonster(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching monster:", error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <Text>Loading...</Text>}
      {!currentMonster?.image && currentMonster ? (
        <Text
          style={{
            top: 80,
            fontSize: 15,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Image not available
        </Text>
      ) : null}
      <ImageBackground
        source={
          currentMonster
            ? { uri: `https://www.dnd5eapi.co${currentMonster.image}` }
            : null
        }
        style={styles.image}
      >
        <View
          style={{
            width: "80%",
            height: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 10,
            opacity: 0.8,
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 2,
            },
          }}
        >
          <Text style={styles.title}>
            {currentMonster
              ? currentMonster.name
              : "Welcome to random monster generator!"}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.size : null}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.type : null}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.alignment : null}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.challenge_rating : null}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.hit_points : null}
          </Text>
          <Text style={styles.description}>
            {currentMonster ? currentMonster.speed.walk : null}
          </Text>
        </View>
      </ImageBackground>
      <Pressable onPress={getRandomMonster}>
        <Text style={styles.fortune}>Get Random Monster</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontFamily: "metal-macabre",
    textShadowColor: "black", // Add text shadow
    textShadowOffset: { width: 2, height: 2 }, // Adjust the offset as needed
    textShadowRadius: 5, // Adjust the radius as needed
  },
  fortune: {
    position: "absolute",
    bottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 10,
    width: 200,
    right: -100,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
});

export default App;
