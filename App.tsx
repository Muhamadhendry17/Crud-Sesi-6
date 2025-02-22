import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://h70lzdr8-3000.asse.devtunnels.ms/contacts';

const AddContact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch contacts from the API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to fetch contacts');
    }
  };

  const handleFirstNameChange = (value) => setFirstName(value);
  const handleLastNameChange = (value) => setLastName(value);
  const handleEmailChange = (value) => setEmail(value);
  const handlePhoneNumberChange = (value) => setPhoneNumber(value);

  // Create or Update contact
  const handleSubmit = async () => {
    const contactData = { firstName, lastName, email, phoneNumber, profile };

    if (!firstName || !email || !phoneNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      if (isEditing) {
        // Update contact
        await axios.put(`${API_URL}/${editId}`, contactData);
        Alert.alert('Success', 'Contact updated successfully');
      } else {
        // Create new contact
        await axios.post(API_URL, contactData);
        Alert.alert('Success', 'Contact added successfully');
      }
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setProfile(null);
    setIsEditing(false);
    setEditId(null);
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert('Success', 'Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  // Edit contact
  const handleEdit = (contact) => {
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setEmail(contact.email);
    setPhoneNumber(contact.phoneNumber);
    setProfile(contact.profile);
    setIsEditing(true);
    setEditId(contact.id);
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <Text>{item.firstName} {item.lastName}</Text>
      <Text>{item.email}</Text>
      <Text>{item.phoneNumber}</Text>
      <View style={styles.contactActions}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? 'Edit Contact' : 'Add a Contact'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={handleFirstNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={handleLastNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        keyboardType="phone-pad"
      />
      <Button title={isEditing ? 'Update Contact' : 'Save Contact'} onPress={handleSubmit} />
      
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id?.toString() || item._id}
        renderItem={renderContact}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No contacts available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  contactItem: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default AddContact;
