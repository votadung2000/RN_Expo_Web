import React from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Home from './src/modules/Home'

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Home />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default App