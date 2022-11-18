import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text, theme } from 'galio-framework';
const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';

export default class GaButton extends React.Component {
	render() {
		const { gradient, children, style, textcolor, gradColors, borderRadius, fontSize, ...props } = this.props;

		if (gradient) {
			return (
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					locations={[0.2, 1]}
					style={[styles.gradient, { borderRadius: borderRadius ? borderRadius : 25 }]}
					colors={gradColors}
				>
					<Button color="transparent" style={[styles.gradient, style]} {...props}>
						<Text color={textcolor} size={fontSize}>{children}</Text>

					</Button>
				</LinearGradient>
			);
		}

		return (
			<Button style={[styles.gradient]}
				{...props}>
				<Text color={textcolor} size={fontSize}>{children}</Text>

			</Button>
		);
	}
}

const styles = StyleSheet.create({
	gradient: {
		borderWidth: 0,
		borderRadius: 25,
	},
});