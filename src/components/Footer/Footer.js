import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  background-color: #333;
  color: white;
  padding: 20px 0;
  text-align: center;
`;

const FooterHeading = styled.h3`
  font-size: 24px;
  margin: 0;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const ContactItem = styled.li`
  font-size: 16px;
  margin: 5px 0;
`;

function Footer() {
  return (
    <FooterWrapper>
      <FooterHeading>금시세케이알</FooterHeading>
      <ContactList>
        <ContactItem>제휴문의: goldpricekr@gmail.com</ContactItem>
      </ContactList>
    </FooterWrapper>
  );
}

export default Footer;