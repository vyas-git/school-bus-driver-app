import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button } from 'native-base';
import { Icon } from "galio-framework";
import { StyleSheet } from "react-native";
import theme from '../constants/Theme';
import { observer, inject } from "mobx-react";

class FooterTabs extends Component {
	render() {
		const { navigation, StudentStore } = this.props;
		return (

			<Footer style={[{ backgroundColor: theme.COLORS.PRIMARY, height: 50 }]}>
				<FooterTab style={styles.FooterTab}>
					<Button onPress={() => navigation.navigate("Home")}>
						<Icon name="home" color={theme.COLORS.WHITE} size={15} family="simple-line-icon" />
					</Button>
				</FooterTab>

				<FooterTab style={styles.FooterTab}>
					<Button onPress={() => navigation.navigate("LocationTracking", {
						StudentStore: { StudentsList: StudentStore.StudentsList }

					})}>
						<Icon name="location-pin" color={theme.COLORS.WHITE} size={15} family="simple-line-icon" />
					</Button>
				</FooterTab>
				<FooterTab style={styles.FooterTab}>
					<Button onPress={() => navigation.navigate("SendNotification")}>
						<Icon name="envelope" color={theme.COLORS.WHITE} size={15} family="simple-line-icon" />
					</Button>
				</FooterTab>
				<FooterTab style={styles.FooterTab}>
					<Button onPress={() => navigation.navigate("AccountSettings")}>
						<Icon name="user" color={theme.COLORS.WHITE} size={15} family="simple-line-icon" />
					</Button>
				</FooterTab>

			</Footer>
		);
	}
}
export default inject(["StudentStore"])(observer(FooterTabs));

const styles = StyleSheet.create({
	FooterTab: {
		borderRightWidth: 1,
		borderColor: theme.COLORS.WHITE,
		backgroundColor: theme.COLORS.PRIMARY
	}
})