import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import ThemeReducer from '../../Component/ThemeRedux/Reducer'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const config = {
    key: 'root',
    storage: AsyncStorage
}
const persistReduce = persistReducer(config, ThemeReducer)

  
const store = configureStore({
    reducer: persistReduce,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
           
          },
          // Add other middleware options as needed
        });
      },
})
const persister = persistStore(store)
export {store, persister}