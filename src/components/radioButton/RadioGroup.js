import _pt from "prop-types";
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { asBaseComponent, forwardRef } from '../../commons/new';
import View from '../view';
import RadioGroupContext from './RadioGroupContext';

/**
 * Wrap a group of Radio Buttons to automatically control their selection
 */
class RadioGroup extends PureComponent {
  static propTypes = {
    /**
       * The initial value of the selected radio button
       */
    initialValue: _pt.oneOfType([_pt.string, _pt.number, _pt.bool]),

    /**
       * Invoked once when value changes, by selecting one of the radio buttons in the group
       */
    onValueChange: _pt.oneOfType([_pt.func, _pt.func, _pt.func])
  };
  static displayName = 'RadioGroup';

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

  static getUpdatedState = (nextProps, prevState) => {
    const {
      value
    } = prevState;
    const {
      initialValue
    } = nextProps;

    if (_.isUndefined(nextProps.initialValue) || value === initialValue) {
      return null;
    }

    return {
      value: initialValue
    };
  };
  static getDerivedStateFromProps = (props, state) => {
    return RadioGroup.getUpdatedState(props, state);
  };

  getContextProviderValue() {
    const {
      value
    } = this.state;
    return {
      value,
      onValueChange: this.onValueChange
    };
  }

  onValueChange = value => {
    this.setState({
      value
    });

    _.invoke(this.props, 'onValueChange', value);
  };

  render() {
    return <View {...this.props}>
        <RadioGroupContext.Provider value={this.getContextProviderValue()}>
          {this.props.children}
        </RadioGroupContext.Provider>
      </View>;
  }

}

export { RadioGroup }; // For tests

export default asBaseComponent(forwardRef(RadioGroup));