/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persister,store } from './src/Component/ThemeRedux/Store';
import  TrackPlayer from 'react-native-track-player'
const AppRedux = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App/>
      </PersistGate>
    </Provider>
  );
  };

TrackPlayer.registerPlaybackService(() => require('./src/service'));
AppRegistry.registerComponent(appName, () => AppRedux);
