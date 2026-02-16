/**
 * @format
 */

import {ScriptManager, Script} from '@callstack/repack/client';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const APPA_DEV_SERVER = Platform.OS === 'android'
  ? 'http://10.0.2.2:8081'
  : 'http://localhost:8081';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // MFv2 runtime handles SharedComponents resolution internally
  if (caller === 'SharedComponents') {
    return undefined;
  }

  // Resolve AppA's own chunks (local lazy imports)
  if (__DEV__) {
    return {
      url: `${APPA_DEV_SERVER}/${scriptId}.chunk.bundle?platform=${Platform.OS}`,
      cache: false,
    };
  }
});

AppRegistry.registerComponent(appName, () => App);
