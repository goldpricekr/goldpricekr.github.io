// Routing.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter 제거
import Home from './page/Home';
import MyPage from './page/MyPage';
import NotFound from './page/Error';
import ProductList from './page/Product_list';
import Gift from './page/Gift';
import Product from './page/Product';

function Routing() {
  return (
    <Routes> {/* Routes로 감싸기 */}
      <Route path="/" element={<Home key="home" />} />
      <Route path="/mypage" element={<MyPage key="mypage" />} />
      <Route path="/product_list" element={<ProductList key="product_list" />} />
      <Route path="/gift" element={<Gift key="gift" />} />
      <Route path="/product" element={<Product key="product" />} />
      <Route path="*" element={<NotFound key="notfound" />} />
    </Routes>
  );
}

export default Routing;
