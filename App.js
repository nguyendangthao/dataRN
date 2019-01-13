import { createAppContainer, createStackNavigator } from 'react-navigation';
import  Home  from './components/home';
import  Detail  from './components/detail';

const AppNavigator = createStackNavigator({
  home: {
    screen: Home,
  },
  detail: {
    screen: Detail,
  },
}, {
    initialRouteName: 'home',
  });

export default createAppContainer(AppNavigator);