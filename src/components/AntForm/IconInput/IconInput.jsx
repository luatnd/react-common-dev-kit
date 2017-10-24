/*
 
 This IconInput component show the input with prefix icon, and suffix icon is clear icon.
 Allow you to click clear Icon to clear form
 Compatible with Ant getFieldDecorator() and validation rule
 
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

export default class IconInput extends React.Component {
  static propTypes = {
    setFieldsValue: PropTypes.func.isRequired,
  }
  
  state = {
    inputVal: '',
  };
  
  emitEmpty = () => {
    this.inputEle.focus();
    this.setInputVal('');
  }
  
  setInputVal = (value) => {
    /**
     * NOTE: Do not set state directly because Ant form decorator will overwrite via props, use parent.props.form.setFieldsValue() instead
     */
    //this.setState({inputVal: ''});
    
    this.props.setFieldsValue({
      [this.props.id]: value
    });
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
      />
    );
  }
}