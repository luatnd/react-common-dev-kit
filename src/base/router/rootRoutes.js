/*
 All route was defined here
 For export default: require('../../App').default,
 For export multi : require('../../App').needed_name,
 */
export default [
  {
    path: '/',
    component: require('../../pages/HomePage/HomePage').default,
    exact: true,
  },
  {
    path: '/page-not-found',
    component: require('../../pages/Page404/Page404').default,
  },
  {
    // example: /shop
    path: '/shop',
    component: require('../../pages/ShopPage/ShopPage').default,
    exact: true,
  },
  {
    // example: /shop
    path: '/category/:id/*',
    component: require('../../pages/ProductCategoryPage/ProductCategoryPage').default,
  },
  {
    // example: /product/126a89/Sản+phẩm+tên+dài
    path: '/product/:id/:productName/:categoryName',
    component: require('../../pages/ProductDetailPage/ProductDetailPage').default,
  },
  {
    // example: /san-pham/126a89/Sản+phẩm+tên+dài
    path: '/san-pham/:id/:productName/:categoryName',
    component: require('../../pages/ProductDetailPage/ProductDetailPage').default,
  },
  {
    // example: /checkout/topup/chon-phuong-thuc-thanh-toan
    // example: /checkout/topup/thanh-toan-thanh-cong
    // example: /checkout/cart/
    path: '/checkout/:checkoutTarget/:stepSlug',
    component: require('../../pages/CheckoutPage/CheckoutPage').default,
  },
  {
    // example: /example-page
    path: '/example-page',
    component: require('../../pages/ExamplePage/ExamplePage').default,
  },
];

