import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Block, Text, Icon } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import theme from '../constants/Theme';
import { Button as GaButton } from "../components/";
import FooterTabs from "./Footer";
import { observer, inject } from "mobx-react";
import DraggableFlatList from 'react-native-draggable-flatlist'



class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refresh: false,
			tempAssignNumbers: []
		}
	}
	assignNumber(text) {
	}
	renderCard = ({ item, index, move, moveEnd, isActive }) => {
		const { navigation, screenProps, DriverStore, StudentStore } = this.props;
		return (
			<TouchableOpacity
				onLongPress={move}
				onPressOut={moveEnd}
			>

				<Block style={[styles.card, { borderWidth: 1, backgroundColor: item.absent ? theme.COLORS.MUTED : item.nameAr == "StudentDelivered" ? theme.COLORS.DARK_GREEN : item.nameAr == "StudentRecieved" ? theme.COLORS.FACEBOOK : theme.COLORS.WHITE, opacity: item.absent ? 0.5 : 1 }]}>

					<Block style={{ flexDirection: 'row', width: '100%' }}>
						<Text
							onChangeText={(text) => this.assignNumber(text)}
							style={{ color: item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK, fontSize: 35 }}> {item.id}
						</Text>
						<TouchableOpacity
							style={{ position: 'absolute', right: 10, flexDirection: 'row', paddingRight: 10 }}
							onPress={() =>
								navigation.navigate('LocationTracking', { StudentStore: { StudentsList: [item] } }
								)}>
							<Block style={{ height: 100, flexDirection: "row" }}
							>
								<Text style={{}} color={item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK}>{" "}{screenProps.localization.location_text} {" "} </Text>
								<Icon style={{}} name="map-marker" family="font-awesome" color={theme.COLORS.PRIMARY} size={20} />

							</Block>

						</TouchableOpacity>

					</Block>

					<Block style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
						{
							item.image == null || item.image == "" || item.image == "string" ?
								<Block style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
									<Icon color={theme.COLORS.PRIMARY} size={40} name='photo' family="font-awesome"></Icon>
								</Block> :
								<Image style={{ width: 80, height: 80, borderRadius: 40, borderColor: theme.COLORS.PRIMARY, borderWidth: 1 }} source={{ uri: 'data:image/png;base64,' + item.image }} />
						}

						<Block style={{ paddingTop: 20, paddingLeft: 10 }}>
							<Block style={{ flexDirection: 'row' }}>
								<Text style={{ color: item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK }} >{screenProps.localization.student_name} </Text>

								<Text style={{ color: item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK }} > : </Text>

								<Text style={{ color: theme.COLORS.PRIMARY }}>{item.name} </Text>

							</Block>

							<Block style={{ flexDirection: 'row' }}>
								<Text style={{ color: item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK }}>{screenProps.localization.class_division} </Text>

								<Text style={{ color: item.nameAr == "StudentDelivered" || item.nameAr == "StudentRecieved" ? theme.COLORS.WHITE : theme.COLORS.BLACK }} > : </Text>

								<Text style={{ color: theme.COLORS.PRIMARY }}>{item.division} </Text>

							</Block>

						</Block>
					</Block>
					<Block style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
						{/*<Icon name="angle-down" family="font-awesome" color={theme.COLORS.PRIMARY} size={20} />*/}
						<Block style={{ marginLeft: 50 }}>

						</Block>
						<GaButton
							gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
							textcolor={theme.COLORS.WHITE}
							fontSize={12}
							borderRadius={10}
							round
							style={styles.button}
							gradient
							onPress={() => {
								StudentStore.StudentsList[index].nameAr = "StudentDelivered";
								StudentStore.changeValues("StudentsList", StudentStore.StudentsList)
								DriverStore.SendPushNotifications(
									{
										"include_player_ids": [item.pushId],
										"data": { "foo": "bar" },
										"ios_sound": "notification",
										"android_sound": "notification",
										"contents": { "en": item.name + ", " + screenProps.localization.student_delivery_push_msg, }
									}
								);

								StudentStore.updatestudent({ id: item.id, nameAr: "StudentDelivered" });
								alert(screenProps.localization.success);
							}
							}
							children={screenProps.localization.student_delivery} />
						<Block style={{ marginLeft: 10 }}>

						</Block>
						<GaButton
							gradColors={[theme.COLORS.GRADIENT_START, theme.COLORS.GRADIENT_END]}
							textcolor={theme.COLORS.WHITE}
							fontSize={12}
							borderRadius={10}
							onPress={() => {
								StudentStore.StudentsList[index].nameAr = "StudentRecieved";
								StudentStore.changeValues("StudentsList", StudentStore.StudentsList)

								DriverStore.SendPushNotifications(
									{
										"include_player_ids": [item.pushId],
										"data": { "foo": "bar" },
										"ios_sound": "notification",
										"android_sound": "notification",
										"contents": { "en": item.name + ", " + screenProps.localization.student_reciept_push_msg, }
									})
								StudentStore.updatestudent({ id: item.id, nameAr: "StudentRecieved" });
								alert(screenProps.localization.success);

							}
							}
							round
							style={styles.button}
							gradient
							children={screenProps.localization.student_receipt} />
					</Block>

				</Block >
			</TouchableOpacity>

		)

	}
	componentDidMount() {
		const { StudentStore } = this.props;
		StudentStore.FetchStudents();
	}

	render() {
		const { navigation, screenProps, StudentStore, DriverStore } = this.props;
		if (StudentStore.isLoading) {
			return (
				<Block style={styles.spinnerContainer}>
					<ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
					<Text style={{ marginTop: 10 }}>{screenProps.localization.loading_students}</Text>
				</Block>
			)
		}
		return (
			<Block flex={1}>

				<Block style={styles.container}>
					{
						DriverStore.flagTracking === 'true' || DriverStore.flagTracking == true ?
							StudentStore.StudentsList.length == 0 ?
								<FlatList
									data={[0]}
									renderItem={({ item, index }) =>
										<Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
											<Text>{screenProps.localization.no_students}</Text>
										</Block>
									}
									keyExtractor={(item, index) => index.toString()
									}
									onRefresh={() => StudentStore.FetchStudents()}
									refreshing={StudentStore.isLoading}

								/>
								:
								<Block style={{ flex: 1 }}>
									<Block style={{ flexDirection: 'row', justifyContent: 'center' }}>
										<Block style={{ flexDirection: 'row' }}>
											<Block style={{ backgroundColor: theme.COLORS.MUTED, height: 15, width: 15, borderRadius: 7.5 }} />
											<Text size={15}>

												{" "}{screenProps.localization.absent}	{" "}
											</Text>

										</Block>
										<Block style={{ flexDirection: 'row' }}>
											<Block style={{ backgroundColor: theme.COLORS.DARK_GREEN, height: 15, width: 15, borderRadius: 7.5 }} />
											<Text size={15}>

												{" "}{screenProps.localization.delivered}	{" "}
											</Text>

										</Block>
										<Block style={{ flexDirection: 'row' }}>
											<Block style={{ backgroundColor: theme.COLORS.FACEBOOK, height: 15, width: 15, borderRadius: 7.5 }} />
											<Text size={15}>

												{" "}{screenProps.localization.received}	{" "}
											</Text>

										</Block>
									</Block>
									<DraggableFlatList
										data={StudentStore.StudentsList}
										DriverStore={DriverStore}

										renderItem={this.renderCard}

										keyExtractor={(item, index) => `draggable-item-${index}`}

										onRefresh={() => StudentStore.FetchStudents()}
										refreshing={StudentStore.isLoading}

										scrollPercent={5}
										onMoveEnd={({ data }) => StudentStore.changeValues(data, 'StudentsList')}

									/>
								</Block>



							: <Block style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<Text>{screenProps.localization.location_off_no_students}</Text>
							</Block>
					}

				</Block>
				<FooterTabs navigation={navigation}></FooterTabs>

			</Block>
		);
	}
}
export default inject(["StudentStore"], ["DriverStore"])(observer(Home));


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14,
		justifyContent: 'flex-start',
		backgroundColor: theme.COLORS.WHITE,

	},
	padded: {
		paddingHorizontal: theme.SIZES.BASE * 1,

	},
	shadow: {
		shadowRadius: 3,
		shadowColor: theme.COLORS.BLACK,
		shadowOpacity: 0.5,
		shadowOffset: { width: 0, height: 3 },

	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 40,
		marginBottom: theme.SIZES.BASE * 2,



	},
	button: {
		width: 120,
		height: 30,
		shadowRadius: 0,
		shadowOpacity: 0,
	},
	cards: {
		flex: 1,
		backgroundColor: theme.COLORS.WHITE,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	card: {
		borderWidth: 0,
		paddingLeft: 10,
		paddingTop: 20,
		paddingBottom: 10,
		backgroundColor: theme.COLORS.WHITE,
		width: width - theme.SIZES.BASE * 2,
		marginVertical: theme.SIZES.BASE * 0.875,
		borderRadius: 15,
		borderColor: theme.COLORS.PRIMARY

	},
	cardFooter: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: theme.SIZES.BASE / 2,
		paddingHorizontal: theme.SIZES.BASE,
		paddingVertical: theme.SIZES.BASE / 2,
		backgroundColor: theme.COLORS.TRANSPARENT,
	},
	cardNoRadius: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	cardAvatar: {
		width: theme.SIZES.BASE * 2.5,
		height: theme.SIZES.BASE * 2.5,
		borderRadius: theme.SIZES.BASE * 1.25,
	},
	cardTitle: {
		justifyContent: 'center',
		paddingLeft: theme.SIZES.BASE / 2,
	},
	cardImageContainer: {
		borderWidth: 0,
		overflow: 'hidden',
	},
	cardImageRadius: {
		borderRadius: theme.SIZES.BASE * 0.1875,
	},
	cardImage: {
		width: 'auto',
		height: theme.SIZES.BASE * 12.5,
	},
	cardRounded: {
		borderRadius: theme.SIZES.BASE * 0.5,
	},
	cardFull: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
	},
	cardGradient: {
		bottom: 0,
		left: 0,
		right: 0,
		height: 90,
		position: 'absolute',
		overflow: 'hidden',
		borderBottomRightRadius: theme.SIZES.BASE * 0.5,
		borderBottomLeftRadius: theme.SIZES.BASE * 0.5,
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
