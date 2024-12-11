import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Vibration, Platform, Linking, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Modal from 'react-native-modal';
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [sensorData, setSensorData] = useState({ analogValue: 0, state: 'Normal' });
  const [chartData, setChartData] = useState([0]);
  const [timestamps, setTimestamps] = useState([0]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [buttonState, setButtonState] = useState({ stats: false, help: false });
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);
  const alertSound = useRef(null);
  const lastState = useRef('Normal');

  const requestAudioPermissions = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Audio permissions are required to play sounds');
      }
    }
  };

  useEffect(() => {
    requestAudioPermissions();
    return () => {
      stopAlertSound();
    };
  }, []);

  const loadAndPlayAlertSound = async () => {
    try {
      if (!alertSound.current) {
        alertSound.current = new Audio.Sound();
        await alertSound.current.loadAsync(require('../../app/assets/sounds/soundalarm.mp3'));
        setIsSoundLoaded(true);
        await alertSound.current.setIsLoopingAsync(true);
        await alertSound.current.playAsync();
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const stopAlertSound = async () => {
    try {
      if (alertSound.current && isSoundLoaded) {
        await alertSound.current.stopAsync();
        await alertSound.current.unloadAsync();
        alertSound.current = null;
        setIsSoundLoaded(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  const handleSensorState = (value) => {
    const analogValue = isNaN(value.analogValue) ? 0 : value.analogValue;
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    setSensorData({
      analogValue,
      state: value.state || 'Normal',
    });

    setChartData((prevData) => {
      const newData = [...prevData, analogValue];
      if (newData.length > 6) {
        newData.shift();
      }
      return newData;
    });

    setTimestamps((prevTimestamps) => {
      const newTimestamps = [...prevTimestamps, currentTimestamp];
      if (newTimestamps.length > 6) {
        newTimestamps.shift();
      }
      return newTimestamps;
    });

    if (value.state !== lastState.current) {
      lastState.current = value.state;
      if (value.state === 'Alert' || value.state === 'Danger') {
        setModalVisible(true);
        Vibration.vibrate(1000);
        loadAndPlayAlertSound();
      } else if (value.state === 'Normal') {
        setModalVisible(false);
        Vibration.cancel();
        stopAlertSound();
      }
    }
  };

  const handleButtonPress = (button) => {
    setButtonState((prev) => ({
      ...prev,
      [button]: true,
    }));
    if (button === 'help') {
      makeEmergencyCall();
    } else {
      setTimeout(() => {
        setButtonState((prev) => ({
          ...prev,
          [button]: false,
        }));
      }, 200);
    }
  };

  const dismissAlert = () => {
    setModalVisible(false);
    Vibration.cancel();
    if (alertSound.current) {
      stopAlertSound();
    }
    lastState.current = 'Normal';
  };

  const makeEmergencyCall = () => {
    const phoneNumber = "09171234567";
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => console.error("Failed to make a call", err));
  };

  const isStatisticsScreen = route.name === 'StatisticsScreen';

  return (
    <LinearGradient colors={["#7cccc7", "#4ca1af"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        {/* Statistics and Help Buttons in Top Left */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonGradient, isStatisticsScreen && styles.activeButton]}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <LinearGradient
              colors={["#f2a541", "#ff6f61"]}
              style={styles.gradientButton}
            >
              <Text style={[styles.buttonText, isStatisticsScreen && styles.activeButtonText]}>
                Stats
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonGradient, styles.helpButton]}
            onPress={() => navigation.navigate("Help")}
          >
            <LinearGradient
              colors={["#ff7b72", "#ff4e3e"]}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Safety Tips</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.smokeDetectorText}>Smoke Detector</Text>

        {/* State Circle with Color and Text Below Title */}
        <View style={styles.sensorStateContainer}>
          <Text style={styles.stateText}>State: </Text>
          <View
            style={[
              styles.stateCircle,
              sensorData.state === 'Normal' && styles.normalState,
              sensorData.state === 'Alert' && styles.alertState,
              sensorData.state === 'Danger' && styles.dangerState,
            ]}
          />
          <Text style={styles.stateText}>{sensorData.state}</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.graphContainer}>
            <LineChart
              data={{
                labels: timestamps.map((timestamp, index) => `${(index + 1) * 2}s`),
                datasets: [
                  {
                    data: chartData,
                    color: () => `rgba(255, 0, 0, 0.5)`
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40}
              height={200}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#00c6ff',
                backgroundGradientTo: '#0072ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Alert Modal */}
        <Modal isVisible={isModalVisible}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Danger! Smoke or Gas levels are high!</Text>
            <TouchableOpacity onPress={dismissAlert} style={styles.dismissButton}>
              <Text style={styles.dismissText}>Dismiss Alert</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Bottom Navigation Container with Icons */}
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AboutScreen")}
          >
            <Ionicons name="information-circle" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    width: "90%",
    marginTop: 10,
  },
  buttonGradient: {
    padding: 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  gradientButton: {
    width: 85,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    fontFamily: "PlayfairDisplayBlack",
    color: "white",
    fontSize: 12,
  },
  activeButton: {
    backgroundColor: "#c4e0e5",
  },
  activeButtonText: {
    color: "black",
  },
  helpButton: {
    marginLeft: 5,
  },
  smokeDetectorText: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBlack",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginTop: 100,
  },
  sensorStateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  stateText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 'bold',
    marginRight: 5,
  },
  stateCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  normalState: {
    backgroundColor: "#3bbf85",
  },
  alertState: {
    backgroundColor: "#ffcc00",
  },
  dangerState: {
    backgroundColor: "#ff4d4d",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  graphContainer: {
    marginTop: 10,
    marginBottom: 145,
  },
  chart: {
    borderRadius: 10,
    paddingVertical: 5,
  },
  modal: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  dismissButton: {
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  dismissText: {
    fontSize: 10,
    color: "blue",
    textAlign: "center",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "white",
  },
  navButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    elevation: 2,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
