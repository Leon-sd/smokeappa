import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from "../../firebaseConfig"; // Make sure Firestore is initialized
import { doc, getDoc } from "firebase/firestore";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [passwordHint, setPasswordHint] = useState(""); // Store the password hint
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store the generated OTP

  // Generate a 6-digit OTP (this is for simulation purposes)
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp); // Store the generated OTP for later verification
    return otp;
  };

  const handleSendOTP = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    const otp = generateOtp(); // Generate OTP

    // Simulate sending OTP via email (you would use an email service or Firebase Cloud Functions in a real app)
    Alert.alert("OTP Sent", `A 6-digit OTP has been sent to your email: ${otp}`);

    // In a real-world scenario, you would send the OTP to the email here, using Firebase Cloud Functions or another email service.
    setIsOTPRequested(true);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    if (otp !== generatedOtp) {
      Alert.alert("Error", "Invalid OTP entered.");
      return;
    }

    // OTP verified, now we retrieve the password hint from Firestore
    const userDoc = doc(firestore, "users", auth.currentUser.uid); // Assuming the user is logged in
    const docSnapshot = await getDoc(userDoc);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      setPasswordHint(userData.passwordHint);
      Alert.alert("Success", `OTP verified! Here's your password hint: ${userData.passwordHint}`);
    } else {
      Alert.alert("Error", "User data not found.");
    }
  };

  return (
    <LinearGradient colors={["#4ca1af", "#c4e0e5"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        {/* Email input to send OTP */}
        {!isOTPRequested ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <LinearGradient colors={["#7cccc7", "#4ca1af"]} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          // OTP verification screen
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6} // Limit input to 6 digits
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
              <LinearGradient colors={["#7cccc7", "#4ca1af"]} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Go Back</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "PlayfairDisplayBlack",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    fontFamily: "HanumanBlack",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginBottom: 20,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    fontFamily: "PlayfairDisplayBlack",
    color: "white",
    fontSize: 16,
  },
  closeText: {
    color: "#4ca1af",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "PlayfairDisplayBlack",
  },
});

export default ForgotPasswordScreen;
