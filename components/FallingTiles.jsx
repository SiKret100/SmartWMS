import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

const FallingTiles = (props) => {
  const fallAnim = useRef(new Animated.Value(0)).current; // Początkowa wartość pozycji Y
  const fadeAnim = useRef(new Animated.Value(0)).current; // Początkowa wartość przezroczystości

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fallAnim, {
        toValue: 1, // Kafelki spadają do określonego miejsca
        duration: 380, // Czas animacji
        easing: Easing.bezier(0.42, 0, 0.58, 1), // Użycie niestandardowej funkcji easing
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Przezroczystość przechodzi do 1
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fallAnim, fadeAnim]);

  const fallingStyle = {
    transform: [
      {
        translateY: fallAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0], // Kafelki spadają z -20 na 0
        }),
      },
    ],
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={[styles.tile, fallingStyle, props.style]}>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
   
  },
});

export default FallingTiles;
