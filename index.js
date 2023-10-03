/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persister,store } from './src/Component/ThemeRedux/Store';
const AppRedux = () => {
  console.log(store)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App/>
      </PersistGate>
    </Provider>
  );
  };
AppRegistry.registerComponent(appName, () => AppRedux);
