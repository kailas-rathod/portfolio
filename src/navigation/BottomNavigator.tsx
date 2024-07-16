import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Example, Invoice} from '../screens';
import {Programs} from '../screens';
import {
  ActiveHome,
  InActiveHome,
  InvoiceActive,
  InvoiceInactive,
  MoreActive,
  MoreInactive,
  ProgramActive,
  ProgramInactive,
} from '@/theme/assets/images';
import MoreNavigator from './MoreNavigator';
import {
  colors,
  fontSizes,
  scales,
} from '@/components/Styles/AppStyles/appStyles';
import {globalStyles} from '@/components/Styles/GlobalStyle/global.style';
import {useDispatch} from 'react-redux';
import {setActiveBottomTab} from '@/store/app';

const Tab = createBottomTabNavigator();
interface Props {
  title: String;
  focused: Boolean;
  activeIcon: any;
  inActiveIcon: any;
}
const Lable: React.FC<Props> = ({title, focused, activeIcon, inActiveIcon}) => {
  const {centerContainer} = globalStyles;
  return (
    <View style={[centerContainer]}>
      {focused ? activeIcon : inActiveIcon}
      <Text
        style={[
          styles.tabBarLabelStyle,
          {color: focused ? colors.darkBlue : colors.darkGray},
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};
const BottomBar = (props: any) => {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const dispatch = useDispatch();

  const onTabPress = (tabName: any) => {
    dispatch(setActiveBottomTab(tabName));
    setShowBottomMenu(false);
  };
  useEffect(() => {
    dispatch(setActiveBottomTab('Home'));
  }, []);

  return (
    <View>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
        initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={Example}
          listeners={{
            tabPress: () => {
              onTabPress('Home');
            },
          }}
          options={() => ({
            tabBarIcon: ({focused}) => (
              <Lable
                title={'Home'}
                activeIcon={
                  <ActiveHome width={scales(30)} height={scales(30)} />
                }
                inActiveIcon={
                  <InActiveHome width={scales(30)} height={scales(30)} />
                }
                focused={focused && !showBottomMenu}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Program"
          component={Programs}
          listeners={{
            tabPress: () => {
              onTabPress('Program');
            },
          }}
          options={() => ({
            tabBarIcon: ({focused}) => (
              <Lable
                title={'Programs'}
                activeIcon={
                  <ProgramActive width={scales(30)} height={scales(30)} />
                }
                inActiveIcon={
                  <ProgramInactive width={scales(30)} height={scales(30)} />
                }
                focused={focused && !showBottomMenu}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Invoice"
          component={Invoice}
          listeners={{
            tabPress: () => {
              onTabPress('Invoice');
            },
          }}
          options={() => ({
            tabBarIcon: ({focused}) => (
              <Lable
                title={'Invoices'}
                activeIcon={
                  <InvoiceActive width={scales(30)} height={scales(30)} />
                }
                inActiveIcon={
                  <InvoiceInactive width={scales(30)} height={scales(30)} />
                }
                focused={focused && !showBottomMenu}
              />
            ),
          })}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white,
    height: scales(70),
    alignItems: 'center',
    padding: 2,
    justifyContent: 'center',
    borderTopWidth: scales(3),
    borderTopColor: colors.lightGray,
    zIndex: 9,
  },
  bottomBarIconStyle: {marginTop: scales(7)},
  tabBarLabelStyle: {
    fontSize: fontSizes.h5,
    width: scales(100),
    textAlign: 'center',
  },
});

export default BottomBar;
