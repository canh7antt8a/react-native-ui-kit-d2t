import _pt from "prop-types";
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Typography } from '../../style';
import { asBaseComponent } from '../../commons/new';
import Image from '../image';
import TouchableOpacity from '../touchableOpacity';
import View from '../view';
import Text from '../text'; // @ts-ignore

import Badge from '../badge';
const INDICATOR_BG_COLOR = Colors.blue30;
const INDICATOR_HEIGHT = 2;
const INDICATOR_SPACINGS = 16;
/**
 * @description: TabBar.Item, inner component of TabBar for configuring the tabs
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/TabBarScreen.js
 * @extends: TouchableOpacity
 * @extendsLink: https://facebook.github.io/react-native/docs/touchableopacity
 */

class TabBarItem extends PureComponent {
  static propTypes = {
    /**
       * icon of the tab
       */
    icon: _pt.number,

    /**
       * icon tint color
       */
    iconColor: _pt.string,

    /**
       * icon selected tint color
       */
    iconSelectedColor: _pt.string,

    /**
       * label of the tab
       */
    label: _pt.string,

    /**
       * maximum number of lines the label can break
       */
    maxLines: _pt.number,

    /**
       * whether the tab is selected or not
       */
    selected: _pt.bool,

    /**
       * whether the tab will have a divider on its right
       */
    showDivider: _pt.bool,

    /**
       * A fixed width for the item
       */
    width: _pt.number,

    /**
       * ignore of the tab
       */
    ignore: _pt.bool,

    /**
       * callback for when pressing a tab
       */
    onPress: _pt.func,

    /**
       * whether to change the text to uppercase
       */
    uppercase: _pt.bool,

    /**
       * Apply background color on press for TouchableOpacity
       */
    activeBackgroundColor: _pt.string,
    testID: _pt.string
  };
  static displayName = 'TabBar.Item';
  static defaultProps = {
    test: true,
    // this will enable by the new tab bar design
    maxLines: 1
  };

  constructor(props) {
    super(props);
    this.state = {
      indicatorOpacity: props.selected ? new Animated.Value(1) : new Animated.Value(0)
    };
  }

  styles = createStyles();
  layout = undefined;

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.animate(this.props.selected);
    }
  }

  animate(newValue) {
    if (this.state.indicatorOpacity) {
      Animated.timing(this.state.indicatorOpacity, {
        toValue: newValue ? 1 : 0,
        easing: Easing.ease,
        duration: 150,
        useNativeDriver: true
      }).start();
    }
  }

  getFlattenStyle(style) {
    return StyleSheet.flatten(style);
  }

  getStylePropValue(flattenStyle, propName) {
    let prop;

    if (flattenStyle) {
      const propObject = _.pick(flattenStyle, [propName]);

      prop = propObject[propName];
    }

    return prop;
  }

  getColorFromStyle(style) {
    const flattenStyle = this.getFlattenStyle(style);
    return this.getStylePropValue(flattenStyle, 'color');
  }

  getLayout() {
    return this.layout;
  }

  onLayout = event => {
    this.layout = event.nativeEvent.layout;
  };

  render() {
    const {
      indicatorOpacity
    } = this.state;
    const {
      children,
      indicatorStyle,
      icon,
      iconColor,
      iconSelectedColor,
      label,
      labelStyle,
      badge,
      uppercase,
      maxLines,
      selected,
      selectedLabelStyle,
      showDivider,
      width,
      onPress,
      activeBackgroundColor,
      style,
      testID
    } = this.props;
    const iconTint = iconColor || this.getColorFromStyle(labelStyle) || this.getColorFromStyle(this.styles.label);
    const iconSelectedTint = iconSelectedColor || this.getColorFromStyle(selectedLabelStyle) || this.getColorFromStyle(this.styles.selectedLabel);
    return <TouchableOpacity activeOpacity={1} onPress={onPress} style={[style, width ? {
      width
    } : {
      flex: 1
    }]} testID={testID} activeBackgroundColor={activeBackgroundColor} onLayout={this.onLayout} accessibilityStates={selected ? ['selected'] : []}>
        <View row flex center style={[showDivider && this.styles.divider, {
        paddingHorizontal: 16
      }]}>
          {icon && <Image style={!_.isEmpty(label) && {
          marginRight: 6
        }} source={icon} tintColor={selected ? iconSelectedTint : iconTint} />}
          {!_.isEmpty(label) && <Text numberOfLines={maxLines} uppercase={uppercase} style={[labelStyle || this.styles.label, selected && (selectedLabelStyle || this.styles.selectedLabel)]} accessibilityLabel={`${label} tab`}>
              {label}
            </Text>}
          {children}
          {badge && <Badge backgroundColor={Colors.red30} // @ts-ignore
        size={'small'} {...badge} containerStyle={[this.styles.badge, badge.containerStyle]} />}
        </View>
        <Animated.View style={[{
        opacity: indicatorOpacity
      }, this.styles.indicator, indicatorStyle]} />
      </TouchableOpacity>;
  }

}

function createStyles() {
  return StyleSheet.create({
    label: {
      color: Colors.dark30,
      ...Typography.text80
    },
    selectedLabel: {
      color: Colors.blue30,
      ...Typography.text80,
      fontWeight: 'bold'
    },
    divider: {
      borderRightWidth: 1,
      borderRightColor: Colors.dark70,
      marginVertical: 14 // NOTE: will not cut long text at the top and bottom in iOS if TabBar not high enough

    },
    indicator: {
      backgroundColor: INDICATOR_BG_COLOR,
      height: INDICATOR_HEIGHT,
      marginHorizontal: INDICATOR_SPACINGS
    },
    badge: {
      marginLeft: 4
    }
  });
}

export default asBaseComponent(TabBarItem);