import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Fonts} from '../Color';
import {Image} from 'react-native';

const LoadingScreen = () => {
  const winners = [
    {quots: 'The worst thing I can be is same as everybody else, I HATE THAT.'},
    {quots: 'Be yourself; everyone else is already taken.'},
    {
      quots:
        'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.',
    },
    {
      quots:
        'I think the reward for conformity is that everyone likes you except yourself.',
    },
    {quots: 'Follow your inner moonlight; don’t hide the madness.'},
    {
      quots:
        'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.',
    },
  ];
  const [currentQuote, setCurrentQuote] = useState(winners[0].quots);
  useEffect(() => {
    let timeoutId;
    const showRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * winners.length);
      setCurrentQuote(winners[randomIndex].quots);
      const randomInterval = Math.floor(Math.random() * 3000) + 1000;
      timeoutId = setTimeout(showRandomQuote, randomInterval);
    };
    showRandomQuote();
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#E9E9E9',
          borderRadius: 60,
          marginVertical: 10,
          justifyContent:'center',
          alignItems:'center'
        }}>
        <Image
          source={require('../../Icon/Images/NewHome/img.png')}
          style={{width: 30, height: 30, marginVertical: 10}}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.quote}>{currentQuote}</Text>
      <Image
        source={require('../../Icon/Images/NewHome/snak.png')}
        style={{width: 25, height: 25, marginVertical: 10}}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  quote: {
    fontSize: 15,
    fontFamily: Fonts.HELVETICA_REGULAR,
    color: '#707070',
    lineHeight: 25,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
export default LoadingScreen;
