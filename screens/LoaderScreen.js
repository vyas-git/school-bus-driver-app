import React from 'react';
import { ActivityIndicator } from "react-native";
import { Block, Text } from 'galio-framework';
import theme from '../constants/Theme';

export default class LoaderScreen extends React.Component {
	componentDidMount() {
		const { navigation } = this.props;
		setTimeout(function () {
			navigation.navigate(navigation.state.params.route_name);
		}, 5000)
	}
	render() {
		const { navigation } = this.props;
		return (
			<Block style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />

				<Text style={{ color: theme.COLORS.PRIMARY }}>{navigation.state.params.text} </Text>

			</Block>
		)
	}
}