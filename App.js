import Navigation from './Navigation';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreLogs([
    'Warning: FirebaseRecaptcha: Support for defaultProps will be removed from function components',
  ]);
  return (
    <>
    
      <Navigation />
    </>

  );
}
    