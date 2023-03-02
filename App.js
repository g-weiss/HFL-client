
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

// timing can be done in the function to train data

/**
 * checkUSBConnect()
 * checks for usb connection since phone needs to be plugged in for us to be training data
 * returns true if plugged in and false if disconnected
 */
function checkUSBConnect() {
  var usbDetect = require('usb-detection'); // NOTE: USB-detection dependency causes error with fs since web does not have usb-detection

  try {
    usbDetect.startMonitoring();
  } catch (error) {
    console.warn(error)
  } finally {
    // displaying console message when device is added
    usbDetect.on('add', function(device) {
      console.log('usb has been plugged in', device); 
      return true;
    });

    // if usb is removed/phone is not charging, stop training data and post error. need to change contents inside function(device)_
    usbDetect.on('remove', function(device) {
      console.log('usb has been removed, stop data training', device); 
      return false});
  }
}

/**
 * checkIdle()
 * function keeps track of inactivity, and stops training if activity is detected
 * returns false if activity detected
 */
  
function checkIdle() {
  if(document.onmousemove || document.onkeydown || document.ontouchmove) {
    console.log("activity detected")
    return false;
  } else {
    return true;
  }
}


function receiveData() {
  //https://stackoverflow.com/questions/61755518/is-it-possible-to-have-a-node-js-websocket-client
}

function modelTraining() {
  
}
