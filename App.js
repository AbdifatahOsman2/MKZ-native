import Navigation from './Navigation';
import { LogBox } from 'react-native';
export default function App() {
  LogBox.ignoreLogs([
    'Warning: FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.', // Suppress specific warning
  ]);
  return (
    <>
      <Navigation />
    </>

  );
}
