import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';

const Signup = () => {
  const [ username, setUsername ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ email, setEmail ] = React.useState('');

  const handleSignup = () => {
    // Handle signup logic here
  };

  return (
    <View className="items-center justify-center text-center">
      <View className="flex-row left-8 my-2">
        <Text className="font-bold text-3xl">Sign Up</Text>
        <Link href="/login" className="left-24 text-rich-plum text-base">Login</Link>
      </View>

      <View className="w-4/5 mb-6">
        <TextInput
          className="h-12 rounded-lg p-2.5 bg-light-gray border border-gray-300 text-lg"
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Name"
          placeholderTextColor="#bdbdbd"
        />
      </View>

      <View className="w-4/5 mb-6">
        <TextInput
          className="h-12 rounded-lg p-2.5 bg-light-gray border border-gray-300 text-lg"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor="#bdbdbd"
        />
      </View>

      <View className="w-4/5 mb-6">
        <TextInput
          className="h-12 rounded-lg p-2.5 bg-light-gray border border-gray-300 text-lg"
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
        />
      </View>

      <View className="justify-center items-center mb-20">
        <Pressable onPress={handleSignup} className="items-center justify-center bg-rich-plum h-14 w-96 rounded-lg top-4 p-2">
          <Text className="text-white text-base font-bold">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Signup;