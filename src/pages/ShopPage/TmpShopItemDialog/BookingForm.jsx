import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { getAllMapper } from '../../../base/redux/dispatch'
import { Form, Input, Icon, notification, Button } from 'antd'
import uniqueId from 'lodash/uniqueId';

import {
  setBuyProductDialog_Data,
  sagaSendBookingForm
} from './TmpShopItemDialog.redux';

import IconInput from '../../../components/AntForm/IconInput/IconInput';
import ProductPreview from './Product/ProductPreview';
import CommonStyles from '../../../components/Styles/Styles.module.scss';
import Styles from './TmpShopItemDialog.module.scss';

const FormItem = Form.Item;


@connect(
  state => ({
    loading: state.tmpShopItemDialog.loading,
    error: state.tmpShopItemDialog.error,
    product: state.tmpShopItemDialog.product,
    data: state.tmpShopItemDialog.data,
  }),
  getAllMapper({
    sagaSendBookingForm,
  }, {
    setBuyProductDialog_Data,
  })
)
@Form.create()
export default class BookingForm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.string,
    product: PropTypes.object,
    data: PropTypes.object,
    setBuyProductDialog_Data: PropTypes.func,
    sagaSendBookingForm: PropTypes.func,
  }
  
  formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  }
  
  /**
   * For more validation rule:
   * https://ant.design/components/form/#Validation-Rules
   */
  antRule_TextRequired = {type: 'string', required: true, message: 'Trường này bắt buộc phải điền'};
  formValidationConf = {
    date: {
      rules: [{type: 'object', required: true, message: 'Trường này bắt buộc phải điền'}],
    },
    product_id: {
      rules: [{type: 'string', required: true, message: 'Không nhận biết được sản phẩm mà bạn đặt mua, vui lòng đặt mua lại. Nếu lỗi vẫn xảy ra, liên hệ trục tiếp hotline để đặt hàng.'}],
    },
    name: {
      initialValue: this.props.data.name,
      rules: [this.antRule_TextRequired],
    },
    phone: {
      initialValue: this.props.data.phone,
      rules: [
        this.antRule_TextRequired,
        {pattern: /^(0)[0-9]{0,10}$/, message: 'Vui lòng nhập đúng số điện thoại của bạn'},
        
        // Custom validator
        //{
        //  validator: (rule, value, callback) => {
        //    var errors = [];
        //
        //    if (value && value.length > 5) {
        //      errors.push('Dài quá ông ơi');
        //    }
        //
        //    callback(errors);
        //  }
        //}
        
      ],
    },
  };
  
  componentDidUpdate(prevProps) {
    const sagaSendBookingFormFinished = (prevProps.loading && !this.props.loading);
    if (sagaSendBookingFormFinished) {
      this.handleSubmitFinish();
    }
  }
  
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    this.props.form.validateFields((err, fieldsValue) => {
      /* err value are:
       err = HAS_ERROR : {
         "name": {"errors": [{"message": "Trường này bắt buộc phải điền", "field": "name"}]},
         "phone": {"errors": [{"message": "Trường này bắt buộc phải điền", "field": "phone"}]}
       } : null;
       */
      if (err) {
        //console.log("Error", err);
      } else {
        // If all are ok
        //console.log("Validate success no error --> Do submit form");
        const payload = {
          campaign_id: this.props.form.getFieldValue('product_id'),
          name: this.props.form.getFieldValue('name'),
          phone: this.props.form.getFieldValue('phone'),
          note: this.props.form.getFieldValue('note'),
        };
        this.props.sagaSendBookingForm.trigger(payload);
      }
    })
  }

  handleSubmitFinish = () => {
    const sagaSendBookingFormWasError = this.props.error.length;
    if (sagaSendBookingFormWasError) {
      notification.error({
        key: uniqueId('book_item_success'),
        message: 'Lỗi đặt mua sản phẩm',
        description: this.props.error,
        duration: 6,
        className: CommonStyles.errorNotification
      });
    } else {
      // SUCCESS
      this.hideParentModal();
      
      notification.success({
        key: uniqueId('book_item_success'),
        message: 'Đặt mua sản phẩm thành công',
        description: 'Campus sẽ tiếp nhận thông tin đặt hàng và liên lạc với bạn để xác nhận và giao hàng trong vòng 24h kể từ thời điểm đặt hàng. Cảm ơn đã sử dụng dịch vụ.',
        duration: 20,
        className: CommonStyles.successNotification
      });
    }
  }
  
  handleBackBtnClick = () => {
    this.hideParentModal();
  }
  
  hideParentModal = () => {
    this.props.setBuyProductDialog_Data({
      visible: false,
      product: null,
    });
  }
  
  render() {
    //console.log("BookingForm render");
    
    const formLayout = 'vertical';
    const formItemLayout = (formLayout === 'horizontal') ? this.formItemLayout : null;
    const {getFieldDecorator, setFieldsValue} = this.props.form; // Binding this value to field validator state
    const {product} = this.props;
    
    const fieldOption = {
      product_id: {
        initialValue: product ? product.id.toString() : ''
      }
    }
    const {loading} = this.props;

    return (
      <Form layout={formLayout} className={Styles.form}>
        
        <FormItem {...formItemLayout} label="Sản phẩm">
          <div>
            {getFieldDecorator('product_id', {
              ...this.formValidationConf.product_id,
              ...fieldOption.product_id
            })(
              <Input placeholder="Sản phẩm" type="hidden"/>
              //<Input placeholder="Sản phẩm" type="hidden" value={product ? product.id: ''}/>
            )}
          </div>
          
          <div>
            <ProductPreview product={product}/>
          </div>
        </FormItem>
  
        <FormItem label="Họ tên" {...formItemLayout}>
          {getFieldDecorator('name', this.formValidationConf.name)(
            <IconInput name="name" placeholder="Nguyễn Văn A" prefix={<Icon type="user"/>} setFieldsValue={setFieldsValue}/>
          )}
        </FormItem>
  
        <FormItem label="Số điện thoại" {...formItemLayout}>
          {getFieldDecorator('phone', this.formValidationConf.phone)(
            <IconInput name="phone" placeholder="01678123456" prefix={<Icon type="mobile"/>} setFieldsValue={setFieldsValue}/>
          )}
        </FormItem>
  
        <FormItem label="Ghi chú (yêu cầu bổ sung)" {...formItemLayout}>
          {getFieldDecorator('note')(
            <Input.TextArea rows={4} placeholder="Ghi chú"/>
          )}
        </FormItem>
        
        <div>
          <hr style={{marginBottom: '12px'}}/>
        </div>
        
        <FormItem {...{span: 14, offset: 5}} style={{textAlign: 'right', margin: '30px 0 12px 0'}}>
          <Button key="back" onClick={this.handleBackBtnClick} size="large" style={{marginRight: '8px'}}>Trở lại</Button>
          <Button key="submit" onClick={this.handleSubmit} type="primary" size="large" loading={loading}>Đặt hàng</Button>
        </FormItem>
        
      </Form>
    );
  }
}
