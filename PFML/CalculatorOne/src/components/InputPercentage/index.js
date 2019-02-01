// note that this is a hacky way to make InputNumber updates on defaultValue change. It is a temporary solution until we switch to FormContext
import React from 'react';
import { InputNumber } from '@massds/mayflower-react';

class InputPercentage extends React.Component {
  constructor(props) {
    super(props);
    const {
      defaultValue, ...otherProps
    } = props;
    this.otherProps = otherProps;
    this.state = {
      defaultValue
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ defaultValue: nextProps.defaultValue });
  }

  render() {
    console.log(this.state.defaultValue)
    const inputNumberProps = {
      defaultValue: this.state.defaultValue,
      ...this.otherProps
    };
    return<InputNumber {...inputNumberProps} key={Math.random()}/>;
  }
}

export default InputPercentage;
