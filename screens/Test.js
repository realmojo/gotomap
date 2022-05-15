import React, {useRef} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';

export const Test = () => {
  // Needed in order to use .show()
  const bottomSheet = useRef();

  return (
    <View style={styles.container}>
      <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
        <Text style={{color: 'black'}}>123</Text>
      </BottomSheet>
      <TouchableOpacity
        style={styles.button}
        onPress={() => bottomSheet.current.show()}>
        <Text style={styles.text}>Open modal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
