
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import { Button, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { callApi } from './util';
import { io } from 'socket.io-client';
import * as tf from '@tensorflow/tfjs';
// import { usb } from 'usb';
const token = "token";

const custFetch = async (url) => {
  const out = await fetch(url, {
    method: 'GET',
    headers: {'Authorization': `Bearer ${token}`}
  });
  return out;
}

const createSock = async (ip, setLoading) => {
  const socket = io(`ws://${ip}:3001`, {extraHeaders : {"Authorization" : "Bearer token"}});
  socket.on("connect", () =>{
    setLoading(true);
    console.log("connection established");
  });
  socket.on('message', () => {
    alert('Connection established. Please leave phone plugged in and idle while training')
    console.log("Client-Edge Server connection established");
  })

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on('disconnect', () =>{
    setLoading(false);
    console.log("disconnected message");
  });

  socket.on('download', async (message) =>{
    console.log("Received model from Edge Server!");
    const TFRequest = {fetchFunc: custFetch};
    const model = await tf.loadLayersModel(message.model, TFRequest);
    const trainEpochs = message.iterations;
    const data = new MnistData();
    await data.load(message.data.start, message.data.size);
    const {trImages, trLabels} = data.getTrainData();

    console.log("Begin client training!");
    const startTime = performance.now() // start training time

    await model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    await model.fit(trImages, trLabels, {
        epochs: trainEpochs,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`  Epoch ${epoch+1}/${trainEpochs}`);
            }
        }
    });

    const endTime = performance.now() // end training time
    console.log("End client training!");

    let weights = [];
    let shape = [];
    let trainingTime = endTime - startTime;
    for (let i = 0; i < model.getWeights().length; i++) {
        weights.push(await model.getWeights()[i].data());
        shape.push(weights[i].length);
    }

    let weightsT = new Float32Array(shape.reduce((a, b) => a + b, 0));
    let ind = 0;
    for (let i = 0; i < shape.length; i++){
        weightsT.set(weights[i], ind);
        ind += shape[i];
    }

    const shapeT = new Uint32Array(shape);
    const weightBlob = new Blob([new Uint8Array(weightsT.buffer)]);
    const form = new FormData();

    form.append('weights', weightBlob);
    form.append('shape', new Blob([new Uint8Array(shapeT.buffer)]));
    form.append('sid', socket.id);
    form.append('training time', trainingTime);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", message.callback, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(form);

    console.log("Trained Model Uploaded to Edge Server!");
});
}

export default function App() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const appState = useRef(AppState.currentState);
  
  useEffect(() => {
    // const appStateListen = AppState.addEventListener('change', nextAppState => {
    //     if(nextAppState != 'active') {
    //       socket.disconnect();
    //       console.log("client disconnected - app left")
    //     }
    //   })
  })

  const handleOnSubmit = async (e) => {
    try {
      createSock(ip, setLoading);
    } catch (error) {
      console.warn(error);
    } finally{
      setLoading(false)

      
        // use expo start
          //https://socket.io/docs/v4/emitting-events

      // whatever tag is used in server to send model/data needs to be same and replace message
     
          // startTime = performance.now()
          // insert training code here
          // endTime = performance.now()

      //socket.emit("model training finished and data sent",);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Enter the address of the edge server you want to connect to</Text>
      <TextInput 
      style={styles.input}
      onChange={e=>setIp(e.nativeEvent.text)}
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


