
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { callApi } from './util';
import { io } from 'socket.io-client'

export default function App() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const isIdle = false;
  const sock = io(`http://${ip}:3000`, {extraHeaders : {"Authorization" : "Bearer token"}})
  const handleOnSubmit = async (e) => {
    try {
      setLoading(true)
      // console.log('sending request');
      sock.emit("register")
      console.log('sending request');
      sock.on('message', (type, msg) =>{
        console.log(msg.msg)
      })
      sock.onAny((event, ...args) =>{
        console.log(event, args, "any");
      });
      // console.log(response);
    
    } catch (error) {
      console.warn(error);
    } finally{
      setLoading(false)

      alert('Connection established. Please leave phone plugged in and idle while training')

          //https://socket.io/docs/v4/emitting-events

      // whatever tag is used in server to send model/data needs to be same and replace message
      sock.on('message', () => {
        console.log("Client-Edge Server connection established");
      })

          // startTime = performance.now()
          // insert training code here
          // endTime = performance.now()

      //sock.emit("model training finished and data sent",);
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {sock.disconnect()}}>
        <View style={styles.container}>
        <Text>Enter the address of the edge server you want to connect to</Text>
        <TextInput 
        style={styles.input}
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
  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1
  }
});

//after the app is redunred:
// start function to run a server on the device to recive the data and start training
//server.js file to run the server on the device
// res.send 


