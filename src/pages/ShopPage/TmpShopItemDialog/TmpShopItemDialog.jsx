import React from 'react'
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getDispatchMapper } from '../../../base/redux/dispatch';
import { Modal, Button } from 'antd'

import { setBuyProductDialog_Data } from './TmpShopItemDialog.redux';
import { priceType as productType } from '../../../components/Product/ProductConstant';

import BookingForm from './BookingForm';
import ProductPreview from './Product/ProductPreview';
import DownloadApp from '../../../components/DownloadApp/DownloadApp';

@connect(
  state => ({
    visible: state.tmpShopItemDialog.visible,
    product: state.tmpShopItemDialog.product,
  }),
  getDispatchMapper({
    setBuyProductDialog_Data,
  })
)
export default class TmpShopItemDialog extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    product: PropTypes.object,
    setBuyProductDialog_Data: PropTypes.func,
  }
  
  shouldComponentUpdate(nextProps) {
    return (
      this.props.visible
      || nextProps.visible !== this.props.visible
    );
  }
  
  hideModal = () => {
    this.props.setBuyProductDialog_Data({
      visible: false,
      product: null,
    });
  }
  
  get modal() {
    let modal = null;
    
    const {visible, product} = this.props;
    
    if (!product) {
      return modal;
    }
    
    switch (product.price_type) {
      case productType.fixed:
        modal = <Modal
          title="Đặt mua sản phẩm"
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <p className="help-block">
            Để đặt hàng, bạn hãy điền thông tin cá nhân và bấm <b>Mua hàng</b>.
            Campus sẽ liên lạc và giao hàng cho bạn. <br/>
            Thanh toán bằng hình thức COD (thanh toán cho người giao hàng)
          </p>
          
          <BookingForm/>
        </Modal>;
        break;
      
      case productType.voucher:
        modal = <Modal
          title="Thông tin ưu đãi"
          visible={visible}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" size="large" onClick={this.hideModal}>Trở lại</Button>,
          ]}
        >
          <ProductPreview product={product}/>

          <DownloadApp>
            <span>Để sử dụng voucher, bạn cần sử dụng qua mobile app <b>Campus Cộng</b>.</span>
          </DownloadApp>
        </Modal>;
        break;
  
      case productType.card:
        modal = <Modal
          title="Thông tin ưu đãi"
          visible={visible}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" size="large" onClick={this.hideModal}>Trở lại</Button>,
          ]}
        >
          <ProductPreview product={product}/>

          <div className="action">
            <DownloadApp>
              <span>Để sử dụng thẻ Campus, bạn cần sử dụng qua mobile app <b>Campus Cộng</b>.</span>
            </DownloadApp>
          </div>
        </Modal>;
        break;
      
      default:
        modal = <Modal
          title="Thông tin ưu đãi"
          visible={visible}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" size="large" onClick={this.hideModal}>Trở lại</Button>,
          ]}
        >
          <ProductPreview product={product}/>
    
          <div className="action">
            <DownloadApp>
              <span>Để sử dụng ưu đãi {product.price_type.toString().toUpperCase()}, bạn cần sử dụng qua mobile app <b>Campus Cộng</b>.</span>
            </DownloadApp>
          </div>
        </Modal>;
    }
    
    return modal;
  }
  
  render() {
    //console.log("TmpShopItemDialog render");
    
    return (
      <div>
        {this.modal}
      </div>
    );
  }
}
