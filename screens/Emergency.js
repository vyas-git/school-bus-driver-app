import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Block, Text, Icon, Input } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import { observer, inject } from "mobx-react";
import theme from '../constants/Theme';
import { Textarea } from "native-base";
import { Button as GaButton } from "../components/";
import FooterTabs from "./Footer";
import { Header } from 'react-navigation';

class Emergency extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subject: "",
			description: "",
			location: ""
		}
	}


	_saveDetails = async () => {
		const { screenProps, DriverStore } = this.props;
		await DriverStore.emergency({ name: DriverStore.driverObj.name, mobile: DriverStore.driverObj.mobile, message: this.state.description, subject: this.state.subject });
		alert(screenProps.localization.success);
		this.setState({ subject: "", description: "" })
	}
	sendEmergencyNotifications() {
		const { StudentStore, screenProps } = this.props;
		let pushIds = [];

		StudentStore.StudentsList.forEach(element => {
			pushIds.push(element.pushId)


		});
		DriverStore.SendPushNotifications({
			"include_player_ids": pushIds,
			"data": { "foo": "bar" },
			"ios_sound": "notification",
			"android_sound": "notification",
			"contents": { "en": "Emergency:" + this.state.subject + " - " + this.state.description }
		});
	}
	render() {
		const { navigation, screenProps, ParentStore } = this.props;
		console.log("this.state.location" + this.state.location)
		return (
			<Block flex={1}>

				<KeyboardAvoidingView
					keyboardVerticalOffset={Header.HEIGHT + 50}
					style={{ flex: 1 }}
					behavior="position">
					<ScrollView>

						<Block style={{ paddingLeft: 10, paddingRight: 10, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
							<Block style={[styles.card, styles.shadow]}>
								<Block style={{ flexDirection: "row", marginBottom: 20 }}>
									<Icon name="phone" size={20} color={theme.COLORS.PRIMARY} family="font-awesome" style={{ marginRight: 50, alignSelf: 'flex-start' }}></Icon>
									<Text>{"  "}{ParentStore.schoolObj ?.mobile }</Text>

								</Block>
								<Block style={{ flexDirection: "row", marginBottom: 20 }}>

									<Icon name="envelope" size={20} color={theme.COLORS.PRIMARY} family="font-awesome" style={{ marginRight: 50, alignSelf: 'flex-start' }}></Icon>
									<Text>{"  "}{ParentStore.schoolObj ?.email}</Text>
								</Block>
								<Block style={{ flexDirection: "row", marginBottom: 20 }}>
									<Icon name="map-marker" size={20} color={theme.COLORS.PRIMARY} family="font-awesome" style={{ marginRight: 50, alignSelf: 'flex-start' }}></Icon>
									<Text>{ParentStore.schoolObj ?.location} </Text>

								</Block>
							</Block >
							<Block>
								<Text size={15}>OR</Text>
							</Block>
							<Block style={{ flexDirection: "row", marginBottom: 20, marginTop: 20 }}>
								<Block style={{ width: "20%", borderBottomWidth: 1, borderBottomColor: theme.COLORS.PRIMARY }}>

								</Block>

								<Text size={15} style={{ position: "relative", top: 8 }}>
									{" "}	{screenProps.localization.contact_us_directly} {" "}
								</Text>

								<Block style={{ width: "20%", borderBottomWidth: 1, borderBottomColor: theme.COLORS.PRIMARY }}>

								</Block>
							</Block>
							<Input
								placeholder={screenProps.localization.subject}
								style={[styles.shadow, {
									width: width - theme.SIZES.BASE * 2,
								}]}
								bgColor={theme.COLORS.INPUT}
								placeholderTextColor={theme.COLORS.PRIMARY}
								color={theme.COLORS.BLACK}
								onChangeText={(text) => this.setState({ subject: text })}
								value={this.state.subject}


							/>
							<Textarea
								onChangeText={(text) => this.setState({ description: text })}
								placeholderTextColor={theme.COLORS.PRIMARY}
								rowSpan={5} style={[styles.shadow, styles.textArea]} bordered placeholder={screenProps.localization.write_here}
								value={this.state.description}

							/>
							<GaButton
								onPress={() => this._saveDetails()}
								disabled={(this.state.subject == "" || this.state.description == "") ? true : false}

								gradColors={
									(this.state.subject == "" || this.state.description == "") ?
										[theme.COLORS.MUTED, theme.COLORS.MUTED] :
										[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
								textcolor={theme.COLORS.WHITE}
								fontSize={20}
								style={styles.button}
								round
								gradient
								children={screenProps.localization.send} />
						</Block>

					</ScrollView>
				</KeyboardAvoidingView>

				<FooterTabs navigation={navigation}></FooterTabs>

			</Block >

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
	textArea: {
		width: width - theme.SIZES.BASE * 2,
		backgroundColor: theme.COLORS.INPUT,
		borderRadius: 5,
		marginBottom: 10

	},
	card: {
		height: 180,
		borderWidth: 0,
		padding: 10,
		backgroundColor: theme.COLORS.INPUT,
		width: width - theme.SIZES.BASE * 2,
		marginVertical: theme.SIZES.BASE * 0.875,
		borderRadius: 15,
		alignItems: "flex-start",
		paddingLeft: 30,
		justifyContent: "center"
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.53,
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
	},
	button: {
		width: width - theme.SIZES.BASE * 6,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
});

export default inject(["DriverStore"], ["StudentStore"])(observer(Emergency));
