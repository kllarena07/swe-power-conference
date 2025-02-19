import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, TouchableOpacityProps, Alert } from 'react-native';
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";

function Header() {
    return (
        <View className="flex-row justify-between w-full py-3 px-5 items-center">
            <Link href="/login">
                <MaterialIcons name="close" size={24} color="hsla(0, 0%, 74%, 1)" />
            </Link>
            <Text className="font-bold text-3xl mx-16">Forget Password?</Text>
        </View>
    );
}

function ResetPasswordButton(props: TouchableOpacityProps): JSX.Element {
    return (
        <TouchableOpacity
            {...props}
            className="w-full items-center justify-center bg-rich-plum rounded-lg py-4"
        >
            <Text className="text-white text-xl font-bold">Reset</Text>
        </TouchableOpacity>
    );
}

export default function forgetPassword() {
    const [ email, setEmail ] = useState('');

    const handleResetPassword = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                const errorObj = error as Error;
                Alert.alert('Error', errorObj.message);
            } else {
                Alert.alert('Email sent', 'An email to reset your password has been sent to your email address.');
                setEmail('');
            }
        } catch (error) {
            const errorObj = error as Error;
            Alert.alert('Error', errorObj.message);
        }

    };

    return (
        <SafeAreaView className="items-center h-full">
            <Header />
            <View className="gap-5 w-full px-5 pt-5 my-3">
                <TextInput
                    className="rounded-lg p-4 bg-light-gray border border-gray-300 text-md"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Enter your email"
                    textAlignVertical="center"
                    placeholderTextColor="#bdbdbd"
                />
                <ResetPasswordButton onPress={handleResetPassword} />
            </View>
        </SafeAreaView>


    )
}
