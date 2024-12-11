import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

const teamMembers = [
  {
    name: "Leoncio Amadore",
    role: "Project Manager",
    text: "Oversees timelines, resources, and budgets; ensures alignment with the team and effectively communicates to stakeholders.",
    image: require('../../app/assets/images/member5.jpg'),
  },
  {
    name: "Ryan Laurence Dingle",
    role: "UI/UX Designer",
    text: "Designs an application's user interface and user experience to be user-friendly, nice-looking, and obvious in the flow of interaction with the incorporation of wireframes, prototypes, and visual designs.",
    image: require('../../app/assets/images/member3.jpg'),
  },
  {
    name: "John Lorenz Cleofe",
    role: "Back-End Developer",
    text: "Are concerned with server-side logic, maintaining APIs, database interactions, and the functionality of an application that supports seamless and secure connectivity between the front end and the database.",
    image: require('../../app/assets/images/member1.jpg'),
  },
  {
    name: "Carlo Cahulogan",
    role: "Front-End Developer",
    text: "Integrates the UI/UX design into the front end of the app. They work with languages and frameworks such as Swift, Kotlin, Flutter, or React Native to provide a responsive and interactive user interface.",
    image: require('../../app/assets/images/member4.jpg'),
  },
  {
    name: "Jhob Vincent Aguilar",
    role: "Assurance Specialist for Quality & Security",
    text: "Performs application testing to assess the quality, functionality, and performance of the app, with auditing for security vulnerabilities. They perform both manual and automated testing, ensure secure coding practices, and work towards maintaining the app according to data protection and cybersecurity standards.",
    image: require('../../app/assets/images/member2.jpg'),
  },
  {
    name: "Joshua Nathan Enrico",
    role: "Release Manager",
    text: "In charge of managing version control and integrating front-end and back-end codebases. They communicate with the team about versioning and the release schedule to ensure deployments are stable and that development workflow is predictable.",
    image: require('../../app/assets/images/img1.jpg'),
  },
  {
    name: "Eduard Nacario",
    role: "User Insights Specialist",
    text: "The professional merges consumer analysis and content strategy in making sure that app feature developments tune in with user expectations. They analyze market trends and users' feedback and develop in-app content that enhances the usability of the app, aligning it with user needs.",
    image: require('../../app/assets/images/member11.jpg'),
  },
  {
    name: "Ronald Cabanez",
    role: "Database Administrator (DBA)",
    text: "Responsible for general database architecture, performance, and security. Guarantees data integrity and access by optimizing data storage and retrieval with a focus on reliability and efficiency.",
    image: require('../../app/assets/images/member12.jpg'),
  },
];

function AboutScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    setModalVisible(true); // Show the modal when a member is clicked
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  return (
    <LinearGradient colors={["#6CC7A1", "#4C9D91"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Text style={styles.headerText}>Our Team</Text>

          {/* New Text */}
          <Text style={styles.subHeaderText}>Our Team, Group 1, created this Smoke Detector for people to monitor their environment and ensure safety in homes, offices, and other spaces.</Text>

          {/* Team Members */}
          <View style={styles.teamContainer}>
            {teamMembers.map((member) => (
              <TouchableOpacity key={member.name} style={styles.memberContainer} onPress={() => handleMemberPress(member)}>
                <LinearGradient colors={["#FF7F50", "#FF4F5D"]} style={styles.memberInnerContainer}>
                  <Image source={member.image} style={styles.memberImage} />
                  <Text style={styles.memberName}>{member.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        {/* Modal to show member details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedMember && (
                <>
                  <Image source={selectedMember.image} style={styles.modalImage} />
                  <Text style={styles.modalName}>{selectedMember.name}</Text>
                  <Text style={styles.modalRole}>{selectedMember.role}</Text>
                  <Text style={styles.modalText}>{selectedMember.text}</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  mainContent: {
    flexGrow: 1,
    alignItems: "center",
    marginBottom: 70,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBlack",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginTop: 120,
    marginBottom: 10,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "PlayfairDisplayBlack",
    textAlign: "center",
    marginBottom: 30,
    marginHorizontal: 20,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  memberContainer: {
    width: '45%',
    marginBottom: 20,
  },
  memberInnerContainer: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  memberImage: {
    width: 100,  // Ensure consistent image size
    height: 100, // Ensure consistent image size
    borderRadius: 50,
    borderWidth: 5,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: 280,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalRole: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF4E3E',
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AboutScreen;
