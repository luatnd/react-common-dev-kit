/*
 
 This IconInput component show the input with prefix icon, and suffix icon is clear icon.
 Allow you to click clear Icon to clear form
 NOTE:
    IconInput is used for Ant form decorated with getFieldDecorator() of @Form.create()
    IconInputPure is used for standalone IconInput, no dependency usage.
 
 <IconInput
 name='htmlInputName'
 setFieldsValue={this.props.form.setFieldsValue}
 className={}
 placeholder="Enter your userName"
 prefix={<Icon type="user" />}
 value={userName}
 onChange={this.onChangeUserName}
 />
 
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Input, Icon } from 'antd'
import omit from 'lodash/omit'
import Styles from './IconInput.module.scss'

export default class IconInputPure extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
  }
  
  state = {
    inputVal: '',
  };
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.inputVal) {
      this.setInputVal(nextProps.value);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.inputVal !== nextState.inputVal);
  }
  
  emitEmpty = () => {
    this.inputEle.focus();
    this.setInputVal('');
    this.props.onChange({target: {value: ''}});
  }
  
  setInputVal = (value) => {
    this.setState({inputVal: value});
  }
  
  render() {
    //console.log("IconInput render");
    
    const props = omit(this.props, ['className', 'ref', 'suffix', 'setFieldsValue']);
    const suffix = this.props.value ? <Icon className={Styles.closeBtn} type="close-circle" onClick={this.emitEmpty}/> : null;
    
    return (
      <Input {...props}
             className={Styles.iconInput + ' ' + undefinedThenNext(this.props.className, '')}
             suffix={suffix}
             ref={node => this.inputEle = node}
             value={this.state.inputVal}
      />
    );
  }
}