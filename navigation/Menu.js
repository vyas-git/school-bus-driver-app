import React from "react";
import { DrawerItems } from 'react-navigation';
import { AsyncStorage, ScrollView, StyleSheet, Dimensions, Image, I18nManager } from 'react-native';
import { Block, Text } from "galio-framework";
import theme from '../constants/Theme';

import { Icon, Button } from '../components/';
import { Images, materialTheme } from "../constants/";

const { width } = Dimensions.get('screen');
// import codePush from "react-native-code-push";
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const Drawer = (props) => (
	<Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
		<Block flex={0.6} style={styles.header}>
			<Block style={{ marginTop: 60 }}></Block>
			<Image style={{}} source={require("../assets/images/Image_6.png")} />
			<Block style={{ marginTop: 60 }}></Block>

			<Text bold style={{ fontSize: 40, color: theme.COLORS.PRIMARY }}>{props.screenProps.localization.organisation_name}</Text>
			<Block style={{ marginBottom: 30 }}></Block>

		</Block>
		<Block flex>
			<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
				<DrawerItems {...props} />
				{/* <Button onPress={() => onButtonPress()}></Button> */}
			</ScrollView>
		</Block>
	</Block>
);

const profile = {
	avatar: 'https://images.unsplash.com/photo-1512529920731-e8abaea917a5?fit=crop&w=840&q=80',
	name: 'Rachel Brown',
	type: 'Seller',
	plan: 'Pro',
	rating: 4.8
};
const isRTLAndroid = I18nManager.isRTL;

const Menu = {

	contentComponent: props => <Drawer {...props} profile={profile} />,
	drawerPosition: isRTLAndroid ? "right" : "left",
	drawerBackgroundColor: 'white',
	drawerWidth: width * 0.8,
	contentOptions: {
		activeTintColor: 'white',
		inactiveTintColor: '#000',
		activeBackgroundColor: 'transparent',
		itemStyle: {
			width: width * 0.75,
			backgroundColor: 'transparent',
		},
		labelStyle: {
			fontSize: 18,
			marginLeft: 12,
			fontWeight: 'normal',
		},
		itemsContainerStyle: {
			paddingVertical: 16,
			paddingHorizonal: 12,
			justifyContent: 'center',
			alignContent: 'center',
			alignItems: 'center',
			overflow: 'hidden',
		},
	},
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		backgroundColor: theme.COLORS.WHITE,
		paddingHorizontal: 28,
		paddingBottom: theme.SIZES.BASE,
		paddingTop: theme.SIZES.BASE * 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderBottomWidth: 1,
		borderColor: theme.COLORS.PRIMARY
	},
	footer: {
		paddingHorizontal: 28,
		justifyContent: 'flex-end'
	},
	profile: {
		marginBottom: theme.SIZES.BASE / 2,
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius: 20,
		marginBottom: theme.SIZES.BASE,
	},
	pro: {
		backgroundColor: materialTheme.COLORS.LABEL,
		paddingHorizontal: 6,
		marginRight: 8,
		borderRadius: 4,
		height: 19,
		width: 38,
	},
	seller: {
		marginRight: 16,
	}
});

export default Menu;
