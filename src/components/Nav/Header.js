import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // BrowserRouter 제거
import Login from './Login';

const HeaderWrapper = styled.header`
  background-color: #333;
  color: white;
  padding: 10px 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled.h3`
  font-size: 24px;
  margin: 0;
`;

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Menu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? '0' : '-100%')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  background-color: #333;
  width: 70%;
  height: 100%;
  transition: right 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 60px 20px;
  max-width: 300px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
      <HeaderWrapper className='Header'>
        <InnerWrapper>
          <Logo><Link to="/"><img className='Logo' src="img/logo.jpg" alt='logo'/></Link></Logo>
          <MenuButton onClick={toggleMenu}>=</MenuButton>
        </InnerWrapper>
        <Menu open={menuOpen}>
          <CloseButton onClick={closeMenu}>X</CloseButton>
          <Link to="/"><img className='Logo' src='img/logo.jpg' /></Link>
          <ul>
            <li><Link to="/product_list?karat=24">순금</Link></li>
            <li><Link to="/product_list?karat=18">18K</Link></li>
            <li><Link to="/product_list?karat=14">14K</Link></li>
            <li><Link to="/gift">기프티콘</Link></li>
          </ul>
          <Login />
        </Menu>
      </HeaderWrapper>
  );
}

export default Header;