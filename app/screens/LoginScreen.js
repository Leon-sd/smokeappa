import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useFonts } from "expo-font";
import { setDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the eye icon

const { height } = Dimensions.get("window");

const CustomAlert = ({ visible, message, onClose }) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.alertBackdrop}>
      <View style={styles.alertBox}>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity style={styles.alertButton} onPress={onClose}>
          <Text style={styles.alertButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password
  const [registrationComplete, setRegistrationComplete] = useState(false); // New state for registration success alert
  const signupAnimation = useRef(new Animated.Value(height)).current;
  const logoAnimation = useRef(new Animated.Value(1)).current;

  const [fontsLoaded, fontsError] = useFonts({
    HanumanBlack: require("../assets/fonts/Hanuman-Black.ttf"),
    PlayfairDisplayBlack: require("../assets/fonts/PlayfairDisplay-Black.ttf"),
  });

  useEffect(() => {
    if (fontsError) {
      console.error("Error loading fonts:", fontsError);
    }
  }, [fontsError]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("HomeScreen");
      })
      .catch(() => {
        showAlert("Invalid credentials");
      });
  };

  const handleSignup = () => {
    if (!email || !password || !name || !confirmPassword) {
      showAlert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match!");
      return;
    }

    const authInstance = getAuth();

    fetchSignInMethodsForEmail(authInstance, email)
      .then((methods) => {
        if (methods.length > 0) {
          showAlert("Email is already in use.");
          return;
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            setDoc(userRef, {
              name: name,
              email: email,
            })
              .then(() => {
                // Set registration complete flag and show the success message
                setRegistrationComplete(true);
              })
              .catch((error) => {
                showAlert(error.message);
              });
          })
          .catch((error) => {
            showAlert(error.message);
          });
      })
      .catch((error) => {
        showAlert(error.message);
      });
  };

  const handleSignupToggle = () => {
    if (isSignupVisible) {
      Animated.parallel([
        Animated.timing(signupAnimation, {
          toValue: height,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(logoAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => setIsSignupVisible(false));
    } else {
      setIsSignupVisible(true);
      Animated.parallel([
        Animated.timing(signupAnimation, {
          toValue: height * 0.25,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(logoAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleBackButton = () => {
    Animated.parallel([
      Animated.timing(signupAnimation, {
        toValue: height,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => setIsSignupVisible(false));
  };

  const handleAlertClose = () => {
    setRegistrationComplete(false); // Reset the flag
    navigation.navigate("LoginScreen"); // Navigate to login screen
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#4ca1af", "#c4e0e5"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Animated.Image
          source={require("../../app/assets/images/logo.jpeg")}
          style={[styles.logo, { opacity: logoAnimation }]}
        />
        <Animated.Text
          style={[styles.appName, { opacity: logoAnimation }]}
        >
          Smoke Detector
        </Animated.Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={email}
            onChangeText={setEmail || setUsername}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#4ca1af"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("forgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient
              colors={["#7cccc7", "#4ca1af"]}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignupToggle}>
            <LinearGradient
              colors={["#f2a541", "#ff6f61"]}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[styles.signupContainer, { transform: [{ translateY: signupAnimation }] }]}
      >
        <LinearGradient
          colors={["#ff6f61", "#ffac8f"]}
          style={styles.signupGradient}
        >
          <Text style={styles.signupTitle}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#4ca1af"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#4ca1af"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBackButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Registration Complete Alert */}
      <CustomAlert
        visible={registrationComplete}
        message="Registration complete! Go to login."
        onClose={handleAlertClose}
      />
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontFamily: "PlayfairDisplayBlack",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  passwordInputContainer: {
    width: "100%",
    position: "relative", // Keeps icon fixed relative to the input field
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
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  forgotPasswordButton: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "white",
    fontFamily: "PlayfairDisplayBlack",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginRight: 75,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 12,
    width: 140,
    alignItems: "center",
    elevation: 3,
    marginHorizontal: 10,
  },
  buttonText: {
    fontFamily: "PlayfairDisplayBlack",
    color: "white",
    fontSize: 16,
  },
  signupContainer: {
    position: "absolute",
    width: "100%",
    height: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signupGradient: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
    padding: 20,
  },
  signupTitle: {
    fontSize: 24,
    fontFamily: "PlayfairDisplayBlack",
    color: "#fff",
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#4ca1af",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeText: {
    color: "#4ca1af",
    fontSize: 16,
    marginTop: 20,
  },
  alertBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: "center",
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#4ca1af",
    padding: 10,
    borderRadius: 5,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginScreen;
