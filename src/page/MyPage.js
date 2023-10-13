import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledMyPage = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const UserInfo = styled.p`
  font-size: 20px;
`;

const PointInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const GoldBarImage = styled.img`
  width: 100px;
`;

const GoldPoint = styled.p`
  margin-top: 10px;
  width: 100%;
  font-weight: bold;
  font-size: 24px;
`;

const GoldText = styled.p`
  margin-top: 10px;
  width: 100%;
`;

const CheckInButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px;
  margin: 10px 0;
`;

const CartList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`;

const ProductItem = styled.li`
  width: 250px;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const ProductTitle = styled.h3`
  margin: 10px 0;
  line-height: 1.2;
  border: solid 1px gainsboro;
  padding: 10px;
  border-radius: 10px;
  text-align: left;
`;

const ProductPrice = styled.p`
font-weight: bold;
text-align: left;
color: deeppink;
`;

const PriceChangeBadge = styled.span`
background: deeppink;
color: pink;
padding: 0 4px;
border-radius: 4px;
margin-right: 8px;
`;

const MoreInfo = styled.button`
background: #007bff;
border: none;
padding: 10px;
border-radius: 5px;
cursor: pointer;
width: 100%;
margin-top: 20px;
font-size: 16px;
color: white;
    `;

function MyPage() {
  const [user, setUser] = useState(null);
  const [phoneNum, setPhoneNum] = useState('');
  const [productList, setProductList] = useState([]);
  const [cartEmpty, setCartEmpty] = useState(false);

  const jwtToken = localStorage.getItem('jwt_token');
  const apiBaseUrl = 'https://minvis.eu.pythonanywhere.com';

  useEffect(() => {
    if (jwtToken) {
      fetchUserInfo();
    } else {
      redirectToHomePage();
    }
  }, [jwtToken]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/userInfo?client_jwt_token=${jwtToken}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        if (userData.cart && userData.cart.length > 0) {
          fetchCartProducts(userData.cart);
        } else {
          setCartEmpty(true);
        }
      } else {
        handleRequestError(response);
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const fetchCartProducts = async (cart) => {
    try {
      const response = await fetch(`${apiBaseUrl}/find_product?cart=${cart}`);
      if (response.ok) {
        const productRes = await response.json();
        setProductList(productRes);
      } else {
        alert('장바구니 내역 오류 발생.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const handleRequestError = (response) => {
    console.error('서버 요청 실패:', response.status, response.statusText);
  };

  const redirectToHomePage = () => {
    alert('로그인이 필요한 서비스입니다.');
    window.location.href = '/';
  };

  const checkIn = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/point_today?client_jwt_token=${jwtToken}`);
      if (response.ok) {
        const pointRes = await response.json();
        handleCheckInResponse(pointRes);
      } else {
        handleRequestError(response);
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const handleCheckInResponse = (pointRes) => {
    if ('okay' in pointRes) {
      alert('20p 적립되었습니다!');
      window.location.href = 'https://naver.com';
    } else if ('already' in pointRes) {
      alert('이미 출석체크를 완료하셨습니다.');
      window.location.href = 'https://naver.com';
    } else {
      alert('잠시 오류가 생겼습니다.');
      window.location.href = 'https://naver.com';
    }
  };

  const userPointFormatted = () => {
    if (user && user.point) {
      const detailPoint = user.point.reduce((acc, one_point) => {
        const pointValue = parseFloat(one_point.split('&')[0]);
        return acc + pointValue;
      }, 0);

      const formattedAmount = detailPoint.toLocaleString();
      return `${formattedAmount}mg`;
    }
    return '';
  };

  const submitPhoneNum = async (e) => {
    e.preventDefault();

    if (!phoneNum) {
      alert('전화번호를 입력하세요.');
      return;
    }

    try {
      const phoneNum_res = await fetch(`${apiBaseUrl}/phone?client_jwt_token=${jwtToken}&phone=${phoneNum}`);
      if (phoneNum_res.ok) {
        const phone_res = await phoneNum_res.json();
        phone_resCheckInResponse(phone_res);
      } else {
        alert('잘못 입력하셨습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  }

  const phone_resCheckInResponse = (phone_res) => {
    if ('okay' in phone_res) {
      alert('번호입력에 성공했습니다!');
    } else {
      alert('잘못 입력하셨습니다.');
    }
  };

  const Delete_cart = async (e, product_id) => {
    e.preventDefault();
    await fetch(`${apiBaseUrl}/delete_cart?client_jwt_token=${jwtToken}&product_id=${product_id}`);
    alert('장바구니 상품이 제거되었습니다.');
  }

  return (
    <StyledMyPage>
      {user ? (
        <>
          {user.phone_num > 8 ? (
            <div>
              <h3>
                <p>안녕하세요!</p>
                <p>
                  <UserInfo>{user.email}</UserInfo>
                </p>
              </h3>
              <div style={{ marginTop: '20px' }}>
                <p>
                  등록된 전화번호는{' '}
                  <span style={{ fontWeight: 'bold' }}>{user.phone_num}</span>입니다.
                </p>
                <p>
                  <a href='' target='_blank'>
                    번호변경문의
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submitPhoneNum}>
              <p>기프티콘 수령할 번호</p>
              <p>번호변경이 어려우니 정확하게 기입 해주세요!</p>
              <input
                type='number'
                name='phone'
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
              <button type='submit'>제출</button>
            </form>
          )}
          <PointInfo>
          <GoldText><GoldBarImage src='img/gold_point.png' /></GoldText>
            <GoldPoint>{userPointFormatted()}</GoldPoint>
            <GoldText>모은 골드바</GoldText>
          </PointInfo>
          <CheckInButton onClick={checkIn}>쿠팡 특가 확인하고 금1mg 받기</CheckInButton>

          {productList.length > 0 ? (
            <div style={{marginTop: '30px'}}>
              <h4>내 장바구니 목록</h4>
              <CartList>
                {productList.map((product) => {
                  let price;
                  let price_percent;

                  try {
                    const priceData = product.price;
                    // 문자열을 JSON으로 파싱
                    const jsonString = priceData.replace(/'/g, '"');
                    const price_json = JSON.parse(jsonString);
                    price = price_json.price_list[price_json.price_list.length - 1];
                    const maxPrice = price_json.price_list.reduce((max, item) => (item > max ? item : max), price_json.price_list[0]);
                    price_percent = (((maxPrice - price) / maxPrice) * 100).toFixed(1);
                  } catch (error) {
                    price = product.price;
                  }
                  return (
                    <ProductItem key={product.product_id}>
                      <Link to={`/product?id=${product.product_id}`} style={{ textDecoration: 'none' }}>
                        <ProductImage src={product.img_src} alt={product.title} />
                        <ProductTitle>{product.title}</ProductTitle>
                        <ProductPrice>
                          {price_percent && (
                            <PriceChangeBadge>-{price_percent}%</PriceChangeBadge>
                          )}
                          {price.toLocaleString()}원
                        </ProductPrice>
                        <MoreInfo>더 알아보기</MoreInfo>
                      </Link>
                      <form onSubmit={(e) => Delete_cart(e, product.product_id)}>
                        <button type='submit' style={{
                        background: 'deeppink',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '16px',
                        marginTop: '10px'}}>장바구니 삭제</button>
                      </form>
                    </ProductItem>
                  );
                })}
              </CartList>
            </div>
          ) : (
            cartEmpty ? (
              <p>장바구니가 비어 있습니다.</p>
            ) : (
              <p>장바구니 내역을 불러오는 중...</p>
            )
          )}
        </>
      ) : null}
    </StyledMyPage>
  );
}

export default MyPage;