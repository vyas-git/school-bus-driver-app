import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList, ActivityIndicator } from 'react-native';
import { Block, Text, Icon, Card } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import { observer, inject } from "mobx-react";
import theme from '../constants/Theme';

import FooterTabs from "./Footer";

class Alerts extends React.Component {
	componentWillMount() {
		const { DriverStore } = this.props;
		DriverStore.getAlerts();
	}
	renderCard = (item, index) => {
		const { navigation, screenProps, DriverStore } = this.props;
		return (
			<Block key={index} style={[styles.card, styles.shadow]}>
				<Text h6 color={theme.COLORS.PRIMARY} numberOfLines={5} style={{
					flexDirection: 'column',
					flex: 0.8
				}}>{item.name}</Text>
				<Text p style={{ fontSize: 8, marginTop: 10 }}>{screenProps.language == "ar" ? new Date(item.updatedAt).toLocaleDateString("ar-SA") : new Date(item.updatedAt).toDateString()}</Text>
				<TouchableOpacity
					style={screenProps.language === "ar" ? { position: "absolute", left: 20, top: 20 } : { position: "absolute", right: 20, top: 20 }}
					onPress={() => {
						Alert.alert(
							screenProps.localization.are_you_sure,
							screenProps.localization.perform_action,
							[
								{
									text: screenProps.localization.cancel,
									onPress: () => console.log("Presses Ok"),
									style: 'cancel',
								},
								{
									text: screenProps.localization.confirm, onPress: async () => {
										await DriverStore.deleteAlert(item.id);
										alert(screenProps.localization.success);

									}
								},
							],
							{ cancelable: false },
						);
					}}>
					<Icon name="delete" family="AntDesign" size={20} />

				</TouchableOpacity>
			</Block >

		)

	}
	render() {
		const { navigation, screenProps, DriverStore } = this.props;
		return (
			<Block style={[styles.container]}>

				<Block

					style={{ paddingLeft: 10, paddingRight: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{
						DriverStore.alerts.length == 0 ?
							<FlatList
								data={[0]}
								renderItem={({ item, index }) =>
									<Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
										<Text>{screenProps.localization.no_alerts}</Text>
									</Block>
								}
								keyExtractor={(item, index) => index.toString()
								}
								onRefresh={() => DriverStore.getAlerts()}
								refreshing={DriverStore.isLoading}

							/>
							:
							<Block flex >
								<FlatList
									data={DriverStore.alerts.reverse()}
									renderItem={({ item, index }) =>
										this.renderCard(item, index)
									}
									keyExtractor={(item, index) => index.toString()
									}
									onRefresh={() => DriverStore.getAlerts()}
									refreshing={DriverStore.isLoading}
									style={{ padding: 5 }}
								/>



							</Block>
					}
				</Block>

				<FooterTabs navigation={navigation}></FooterTabs>

			</Block>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.COLORS.WHITE,

	},
	card: {
		//height: 50,
		borderWidth: 0,
		padding: 10,
		backgroundColor: theme.COLORS.WHITE,
		width: width - theme.SIZES.BASE * 2,
		marginVertical: theme.SIZES.BASE * 0.875,
		borderRadius: 5,
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,

	},
	padded: {
		paddingHorizontal: theme.SIZES.BASE * 2,
		position: 'relative',
		bottom: theme.SIZES.BASE,
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});

export default inject("DriverStore")(observer(Alerts));
