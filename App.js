
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { callApi } from './util';

export default function App() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const handleOnSubmit = async (e) => {
    try {
      setLoading(true)
      // console.log('sending request');
      const response = await callApi({
        url:"http://" + ip + ":3000/register/client",
        token:'token',
        method:"PUT"
      })
      // console.log(response);
    
    } catch (error) {
      console.warn(error);
    } finally{
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Enter the address of the edge server you want to connect to</Text>
      <TextInput 
      onChange={(e)=>setIp(e.nativeEvent.text)}
      value={ip}
      placeholder="225.225.225.1"
      keyboardType="numeric"
      ></TextInput>
      <Button 
      disabled={loading}
        onPress={handleOnSubmit}
        title="Submit"
        // color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
