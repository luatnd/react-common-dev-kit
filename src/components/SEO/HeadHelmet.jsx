import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"
import moment from 'moment';

import { HOST as host } from "../../siteConfig"
import { getRoutineMapper } from '../../base/redux/utils';
import { sagaFetchSeoConf, initialState, reader as seoReader} from '../../components/SEO/Seo.redux';

const SEO_CONF_CACHING_TIME = 86400; // caching for 1 days


@connect(
  state => {
    const seo = seoReader.getState(state);
  
    const maxAge = notThenNext(seo['maxAge'], 0);
    const expired = maxAge + SEO_CONF_CACHING_TIME < parseInt(moment().format('X'));
    
    return {
      seo,
      expired
    }
  },
  getRoutineMapper({sagaFetchSeoConf})
)
export default class HeadHelmet extends React.PureComponent {
  static propTypes = {
    // See the /public/seo.conf.json for the `page` value
    page: PropTypes.string,
    seo: PropTypes.object,
    sagaFetchSeoConf: PropTypes.func,
  }
  
  componentWillMount() {
    const seoLoaded = Object.keys(this.props.seo).length > Object.keys(initialState).length;
    
    if (!seoLoaded || this.props.expired) {
      this.props.sagaFetchSeoConf.trigger();
    }
  }
  
  applyData = (attrName, currentValue) => {
    const data = this.props.data ? this.props.data[attrName] : null;
    
    return data ? currentValue.replacePair(data) : currentValue;
  }
  
  render() {
    //console.log('HeadHelmet render: ');
    
    /**
     * page is the base slug from: src/base/router/rootRoutes.js
     * example: /shop/test --> page = "shopPage"
     * example: /checkout/toup --> page = "checkoutPage"
     */
    const page = this.props.page;
    const defaultConf = this.props.seo.defaultConf;
    const pageHelmetProps = this.props.seo[page] ? this.props.seo[page] : {};
    
    let {
      type = 'website', // or article, product ...
      title = 'Campus+ Kết nối sinh viên Việt Nam',
      description = 'Mạng xã hội Kết nối sinh viên Việt Nam, mua sắm giảm giá, ...',
      headline = "Campus+ Kết nối sinh viên Việt Nam",
      siteName = "Campp.vn - Campus+ Kết nối sinh viên Việt Nam",
      canonical = host,
      keywords = ['campus cộng', 'hỗ trợ', 'mạng xã hội', 'sinh viên', 'hàng giảm giá'],
      lang = 'vi',
      generator = 'Powered by React',
      copyright = '2017 by Campp.vn',
      publisher = 'Nguyễn Phương Ngọc',
      author = 'Nguyễn Phương Ngọc', // is creator
    } = {
      ...defaultConf,
      ...pageHelmetProps,
    };
    const canonicalUrl = (canonical === host) ? this.applyData('canonical', canonical) : this.applyData('canonical', host + canonical);
    
    title = this.applyData('title', title);
    description = this.applyData('description', description);
    headline = this.applyData('headline', headline);

    
    // TODO: Support article spec
    // TODO: Support product spec
  
    return !defaultConf ? null : <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} itemprop="url"/>
      <meta name="title" content={title}/>
      <meta name="description" content={description}/>
      <meta name="keywords" content={keywords.join(', ')}/>
      <meta name="generator" content={generator}/>
      <meta name="copyright" content={copyright}/>
      <meta name="author" content={author}/>
      <link rel="publisher" href={publisher}/>
      <meta http-equiv="audience" content="General"/>
      <meta name="resource-type" content="Document"/>
      <meta name="distribution" content="Global"/>
      <meta name="revisit-after" content="1 days"/>
      <meta http-equiv="REFRESH" content="1800"/>
      <link type="image/x-icon" rel="icon" href="https://www.campp.vn/uploads/logo-campp.png"/>
      <link rel="shortcut icon" href="https://www.campp.vn/uploads/logo-campp.png"/>
      <link rel="icon" type="image/png" href="https://www.campp.vn/uploads/logo-campp.png"/>
      <link rel="profile" href="#"/>
      <base href={canonicalUrl}></base>
      <meta name="robots" content="index,follow,all"/>
      
      <meta name="geo.position" content="11"/>
      <meta name="geo.placename" content="Hà Nội"/>
      <meta name="geo.region" content="Việt Nam"/>
      
      <meta name="DC.Title" content={title}/>
      <meta name="DC.Creator" content={author}/>
      <meta name="DC.Subject" content={headline}/>
      <meta name="DC.Description" content={description}/>
      <meta name="DC.Publisher" content={publisher}/>
      <meta name="DC.Language" content={lang}/>
      
      <meta itemprop="name" content={title}/>
      <meta itemprop="description" content={description}/>
      <meta itemprop="image" content="https://www.campp.vn/uploads/campp-logo-1.png"/>
      
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content={publisher}/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:creator" content={author}/>
      <meta name="twitter:image:src" content="https://www.campp.vn/uploads/campp-logo-1.png"/>
  
      {/*<!-- Open Graph data -->*/}
      <meta property="og:title" content={title}/>
      <meta property="og:headline" content={headline}/>
      <meta property="og:type" content={type}/>
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://www.campp.vn/uploads/campp-logo-1.png"/>
      <meta property="og:description" content={description}/>
      <meta property="og:site_name" content={siteName}/>
      <meta property="og:locale" content="vi_VN"/>
    </Helmet>
  }
}
