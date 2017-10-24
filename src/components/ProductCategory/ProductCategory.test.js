import React from 'react';
import { shallow } from 'enzyme';
import ProductCategory from './ProductCategory';

it('renders without crashing', () => {
  shallow(<ProductCategory />);
});
