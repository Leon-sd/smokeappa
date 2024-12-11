import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Vibration, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

const Help = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={["#7cccc7", "#4ca1af"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        {/* Top Navigation Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonGradient} onPress={() => navigation.navigate("HomeScreen")}>
            <LinearGradient colors={["#f2a541", "#ff6f61"]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Stats</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonGradient} onPress={() => navigation.navigate("Help")}>
            <LinearGradient colors={["#ff7b72", "#ff4e3e"]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Safety Tips</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
          <Text style={styles.headerText}>Emergency Procedures</Text>

          <View style={styles.bulletinContainer}>
            <Text style={styles.subHeaderText}>Fire Safety</Text>
            <Text style={styles.instructionText}>1. If you are indoors, stay low to the ground to avoid smoke inhalation.</Text>
            <Text style={styles.instructionText}>2. Use a fire extinguisher if the fire is small; otherwise, evacuate immediately.</Text>
            <Text style={styles.instructionText}>3. If the fire is spreading, evacuate the building calmly but quickly.</Text>
            <Text style={styles.instructionText}>4. Call 911 and report the fire with details about the location and severity.</Text>
          </View>

          <View style={styles.bulletinContainer}>
            <Text style={styles.subHeaderText}>Smoke Detection Response</Text>
            <Text style={styles.instructionText}>1. If the smoke alarm goes off, do not ignore it. It is a sign of potential danger.</Text>
            <Text style={styles.instructionText}>2. Check the environment for smoke or fire. If there is visible smoke or fire, evacuate immediately.</Text>
            <Text style={styles.instructionText}>3. Do not open doors or windows that are hot to the touch. It could feed the fire.</Text>
            <Text style={styles.instructionText}>4. Use a fire extinguisher if the fire is manageable; otherwise, evacuate the building and call 911.</Text>
          </View>

          <View style={styles.bulletinContainer}>
            <Text style={styles.subHeaderText}>Gas Leak Response</Text>
            <Text style={styles.instructionText}>1. Evacuate the area immediately—do not turn on any lights or appliances.</Text>
            <Text style={styles.instructionText}>2. Do not use your phone inside the building to avoid sparks.</Text>
            <Text style={styles.instructionText}>3. Once outside, call your gas provider or 911 to report the leak.</Text>
            <Text style={styles.instructionText}>4. Do not re-enter the building until authorities confirm it is safe.</Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation Container */}
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
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    width: "50%",
    marginTop: 10,
  },
  buttonGradient: {
    padding: 12,
    borderRadius: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    width: 95,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "PlayfairDisplayBlack",
    color: "white",
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    width: "100%",
    marginBottom: 70,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 50,
    marginBottom: 20,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
  },
  instructionText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 20,
    marginTop: 10,
    lineHeight: 25,
  },
  bulletinContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4ca1af",
    borderRadius: 10,
    marginBottom: 20,
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

export default Help;
