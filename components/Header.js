import React from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Input, Text, theme, Switch } from 'galio-framework';

import Icon from './Icon';
import materialTheme from '../constants/Theme';
import { observer, inject } from "mobx-react";

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const ChatButton = ({ isWhite, style, navigation }) => (
	<TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Messages')}>
		<Icon
			family="GalioExtra"
			size={16}
			name="chat-33"
			color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
		/>
		<Block middle style={styles.notify} />
	</TouchableOpacity>
);

const HeartButton = ({ isWhite, style, navigation }) => (
	<TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('MatchList')}>
		<Icon
			family="Galio"
			size={16}
			name="heart-2"
			color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
		/>
		<Block middle style={styles.notify} />
	</TouchableOpacity>
);
const BellButton = ({ isWhite, style, navigation }) => (
	<TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Alerts')}>
		<Icon
			family="font-awesome"
			size={16}
			name="bell-o"
			color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
		/>
		<Block middle style={styles.notify} />
	</TouchableOpacity>
);
const ArrowRight = ({ isWhite, style, navigation, navigationLabel }) => (
	<TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate(navigationLabel)}>
		<Icon
			family="ionicon"
			size={20}
			name="md-arrow-forward"
			color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
		/>
	</TouchableOpacity>
);
const ArrowLeft = ({ isWhite, style, navigation, navigationLabel }) => (
	<TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate(navigationLabel)}>
		<Icon
			family="ionicon"
			size={20}
			name="md-arrow-back"
			color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
		/>
	</TouchableOpacity>
);

class Header extends React.Component {
	constructor(props) {
		super(props);
		const { DriverStore } = this.props;

		this.state = {
			flagTracking: DriverStore.flagTracking
		}
	}
	handleLeftPress = () => {
		const { back, navigation } = this.props;
		return (back ? navigation.goBack() : navigation.openDrawer());
	}
	async startStopTracking() {
		const { DriverStore } = this.props;
		await this.setState({ flagTracking: this.state.flagTracking == 'true' ? 'false' : 'true' });

		if (this.state.flagTracking === 'true') {
			DriverStore.StartLocationTracking();
			DriverStore.changeValues(this.state.flagTracking, 'flagTracking')


		} else {
			DriverStore.StopLocationTracking();
			DriverStore.changeValues(this.state.flagTracking, 'flagTracking')


		}



	}
	renderRight = () => {
		const { white, title, navigation } = this.props;
		const { routeName } = navigation.state;

		if (title === 'Title') {
			return [
				<ChatButton key='chat-title' navigation={navigation} isWhite={white} />,
				<HeartButton key='basket-title' navigation={navigation} isWhite={white} />
			]
		}

		switch (routeName) {
			case 'Home':
				return ([
					// <BellButton key='chat-home' navigation={navigation} isWhite={white} />,
					<Switch
						key={1}
						value={this.state.flagTracking == 'true' ? true : false}
						onValueChange={() => this.startStopTracking()}
						//ios_backgroundColor="#fff"
						color="#04963c"
					/>
				]);
			case 'UsersSwiper':
				return ([
					<ChatButton key='chat-home' navigation={navigation} isWhite={white} />,
					<HeartButton key='basket-home' navigation={navigation} isWhite={white} />
				]);
			case 'Alerts':
				return ([

					<ArrowRight style={{ marginLeft: 20 }} key='arrow-right-icon' navigation={navigation} navigationLabel={'LocationTracking'} isWhite={white} />
				])
			case 'LocationTracking':
				return ([

					<ArrowRight style={{ marginLeft: 20 }} key='arrow-right-icon' navigation={navigation} navigationLabel={'SendNotification'} isWhite={white} />
				])

			case 'SendNotification':
				return ([

					<ArrowRight style={{ marginLeft: 20 }} key='arrow-right-icon' navigation={navigation} navigationLabel={'Home'} isWhite={white} />
				])
			case 'AccountSettings':
				return ([

					<ArrowRight style={{ marginLeft: 20 }} key='arrow-right-icon' navigation={navigation} navigationLabel={'EditAccount'} isWhite={white} />
				])
			case 'EditAccount':
				return ([

					<ArrowLeft style={{ marginLeft: 20 }} key='arrow-right-icon' navigation={navigation} navigationLabel={'AccountSettings'} isWhite={white} />
				])
			default:
				break;
		}

	}

	renderSearch = () => {
		const { navigation } = this.props;
		return (
			<Input
				right
				color="black"
				style={styles.search}
				placeholder="What are you looking for?"
				onFocus={() => navigation.navigate('Pro')}
				iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="zoom-split" family="Galio" />}
			/>
		)
	}

	renderTabs = () => {
		const { navigation, tabTitleLeft, tabTitleRight } = this.props;

		return (
			<Block row style={styles.tabs}>
				<Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
					<Block row middle>
						<Icon name="grid-square" family="Galio" style={{ paddingRight: 8 }} />
						<Text size={16} style={styles.tabTitle}>{tabTitleLeft || 'Categories'}</Text>
					</Block>
				</Button>
				<Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
					<Block row middle>
						<Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
						<Text size={16} style={styles.tabTitle}>{tabTitleRight || 'Best Deals'}</Text>
					</Block>
				</Button>
			</Block>
		)
	}

	renderHeader = () => {
		const { search, tabs } = this.props;
		if (search || tabs) {
			return (
				<Block center>
					{search ? this.renderSearch() : null}
					{tabs ? this.renderTabs() : null}
				</Block>
			)
		}
		return null;
	}

	render() {
		const { back, title, white, transparent, navigation, left, } = this.props;
		const { routeName } = navigation.state;
		const noShadow = ["Search", "Categories", "Deals", "Pro", "Profile"].includes(routeName);
		const headerStyles = [
			!noShadow ? styles.shadow : null,
			transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
		];

		return (
			<Block style={headerStyles}>
				<NavBar
					back={back}
					title={title}
					style={[styles.header]}
					transparent={transparent}
					right={this.renderRight()}
					rightStyle={{ alignItems: 'center' }}
					leftStyle={{ paddingVertical: 12, flex: 0.3 }}
					leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
					titleStyle={[
						styles.title,
						{ color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
					]}
					onLeftPress={this.handleLeftPress}
					left={left}
				/>
				{//this.renderHeader()
				}
			</Block>
		);
	}
}

export default inject(["DriverStore"], ["StudentStore"])(observer(withNavigation(Header)));


const styles = StyleSheet.create({
	button: {
		padding: 12,
		position: 'relative',
	},
	title: {
		//width: '100%',
		fontSize: 16,
		fontWeight: 'bold',
		color: materialTheme.COLORS.WHITE,


	},
	navbar: {
		paddingVertical: 0,
		paddingBottom: theme.SIZES.BASE * 1.5,
		paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : 30,
		zIndex: 5,
	},
	shadow: {
		backgroundColor: theme.COLORS.WHITE,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.2,
		elevation: 3,
	},
	notify: {
		backgroundColor: materialTheme.COLORS.LABEL,
		borderRadius: 4,
		height: theme.SIZES.BASE / 2,
		width: theme.SIZES.BASE / 2,
		position: 'absolute',
		top: 8,
		right: 8,
	},
	header: {
		backgroundColor: materialTheme.COLORS.PRIMARY,
		alignItems: "center",
		height: 60,
		paddingTop: 30

	},
	divider: {
		borderRightWidth: 0.3,
		borderRightColor: theme.COLORS.MUTED,
	},
	search: {
		height: 48,
		width: width - 32,
		marginHorizontal: 16,
		borderWidth: 1,
		borderRadius: 3,
	},
	tabs: {
		marginBottom: 24,
		marginTop: 10,
		elevation: 4,
	},
	tab: {
		backgroundColor: theme.COLORS.TRANSPARENT,
		width: width * 0.50,
		borderRadius: 0,
		borderWidth: 0,
		height: 24,
		elevation: 0,
	},
	tabTitle: {
		lineHeight: 19,
		fontWeight: '300'
	},
})