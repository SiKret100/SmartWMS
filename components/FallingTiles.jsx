import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const FallingTiles = (props) => {
  const fallAnim = useRef(new Animated.Value(0)).current; // Początkowa wartość pozycji Y
  const fadeAnim = useRef(new Animated.Value(0)).current; // Początkowa wartość przezroczystości

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fallAnim, {
        toValue: 1, // Kafelki spadają do określonego miejsca
        friction: 4, // Większa wartość = mniejszy efekt sprężystości
        tension: 20, // Im większa wartość, tym bardziej dynamiczny ruch
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Przezroczystość przechodzi do 1
        duration: 500, // Czas zanikania
        useNativeDriver: true,
      }),
    ]).start();
  }, [fallAnim, fadeAnim]);

  const fallingStyle = {
    transform: [
      {
        translateY: fallAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0], // Kafelki spadają z -50 na 0 (można dostosować)
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
