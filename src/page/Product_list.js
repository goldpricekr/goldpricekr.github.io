import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

// 스타일드 컴포넌트 정의
const ProductList = styled.ul`
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
  max-width: 100%;
  height: auto;
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

const AddToCartButton = styled.button`
background: deeppink;
color: #fff;
border: none;
padding: 10px;
border-radius: 5px;
cursor: pointer;
width: 100%;
margin-top: 10px;
font-size: 16px;
`;

function Product_list() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const karat = searchParams.get("karat");

    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          let retries = 0;
          const maxRetries = 5; // 최대 재시도 횟수 설정
          while (retries < maxRetries) {
            try {
              const response = await fetch(
                `https://minvis.eu.pythonanywhere.com/show_product?karat=${karat}`
              );
              if (response.ok) {
                const productData = await response.json();
                setProductData(productData);
                break;
              } else {
                console.error('오류 발생');
              }
            } catch (error) {
              console.error('오류 발생:', error);
            }
            retries += 1;
            // 일시 중지를 통해 재시도 간의 지연을 추가할 수 있습니다.
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        };
        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
      }, [karat]);

    // 장바구니에 상품 추가하는 함수
    const addCart = async (product_id) => {
        const jwtToken = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(
                `https://minvis.eu.pythonanywhere.com/add_cart?client_jwt_token=${jwtToken}&product_id=${product_id}`,
                { method: 'GET' } // GET 요청으로 백엔드 API 호출
            );
            if (response.ok) {
                const result = await response.json();
                alert(result.message); // 백엔드에서 반환된 메시지를 알림으로 표시
                // 장바구니 정보를 다시 불러와서 화면 갱신
                // 이 부분은 장바구니를 표시하는 컴포넌트에서 구현해야 합니다.
            } else {
                alert('상품 추가 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    return (
        <ProductList>
          {productData.map((product) => {
            const priceData = product.price;
            // 문자열을 JSON으로 파싱
            const jsonString = priceData.replace(/'/g, '"');
            const price_json = JSON.parse(jsonString);
            const priceList = price_json.price_list;
            const maxPrice = priceList.reduce((max, item) => (item > max ? item : max), priceList[0]);
            const price = priceList[priceList.length - 1];
            const price_percent = (((maxPrice - price) / maxPrice) * 100).toFixed(1);
            return (
              <ProductItem key={product.product_id}>
                <Link to={`/product?id=${product.product_id}`} style={{ textDecoration: 'none' }}> {/* Link로 변경 */}
                  <ProductImage src={product.img_src} alt={product.title} />
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductPrice>
                    <PriceChangeBadge>-{price_percent}%</PriceChangeBadge>
                    {price.toLocaleString()}원
                  </ProductPrice>
                  <MoreInfo>더 알아보기</MoreInfo>
                </Link>
                <AddToCartButton onClick={() => addCart(product.product_id)}>
                  장바구니 담기
                </AddToCartButton>
              </ProductItem>
            );
          })}
        </ProductList>
      );
}

export default Product_list;