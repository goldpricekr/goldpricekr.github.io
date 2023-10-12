import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Header from './components/Nav/Header';
import Footer from './components/Footer/Footer';
import Home from './page/Home';
import MyPage from './page/MyPage';
import Product_list from './page/Product_list';
import Gift from './page/Gift';
import Product from './page/Product';
import NotFound from './page/Error';

const AppContainer = styled.div`
  margin: 60px auto;
`;

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/product_list" element={<Product_list />} />
          <Route path="/gift" element={<Gift />} />
          <Route path="/product" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppContainer>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
