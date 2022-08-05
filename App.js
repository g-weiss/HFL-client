import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { callApi } from './util';

export default function App() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const handleOnSubmit = async (e) => {
    try {
      setLoading(true)
      console.log('sending request');
      const response = await callApi({
        url:"http://" + ip + ":3000/register/client",
        token:'token',
        method:"PUT"
      })
      console.log(response);
    
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Enter the address of the edge server you want to connect to</Text>
      <TextInput 
      style={{outline:'1px solid', margin:'10px'}} 
      onChange={(e)=>setIp(e.nativeEvent.text)}
      value={ip}
      placeholder="225.225.225.1:3000"
      keyboardType="numeric"
      ></TextInput>
      <Button 
      disabled={loading}
        onPress={handleOnSubmit}
        title="Submit"
        // color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
