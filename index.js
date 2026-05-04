import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';
import { notifeeBackgroundHandler } from './src/services/notification';

notifee.onBackgroundEvent(notifeeBackgroundHandler);

AppRegistry.registerComponent(appName, () => App);
