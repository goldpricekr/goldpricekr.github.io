import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

// 스타일드 컴포넌트 정의
const ProductList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`;

const ProductItem = styled.li`
  width: 250px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const ProductTitle = styled.h3`
  font-size: 1.2em;
  margin: 10px 0;
`;

const ProductPrice = styled.p`
  font-size: 1.1em;
  color: #007acc;
`;

const PriceChangeBadge = styled.span`
  color: red;
  font-weight: bold;
  margin-right: 4px;
`;

const AddToCartButton = styled.button`
  background: #007acc;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

function Gift() {

    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://minvis.eu.pythonanywhere.com/show_gift`);
                if (response.ok) {
                    const productData = await response.json();
                    setProductData(productData);
                } else {
                    alert('잠시 오류가 발생했습니다.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('오류 발생:', error);
                window.location.reload();
            }
        };

        fetchData();
    }, []);

    const addCart = async (product_id) => {
        const jwtToken = localStorage.getItem('jwt_token');
        
        // 알림 다이얼로그를 띄움
        const isConfirmed = window.confirm("구매 전에 전화번호를 등록하셨습니까? 구매를 원하시면 확인을 눌러주세요!");
    
        if (isConfirmed) {
            try {
                const response = await fetch(
                    `https://minvis.eu.pythonanywhere.com/purchase?client_jwt_token=${jwtToken}&product_id=${product_id}`,
                    { method: 'GET' }
                );
                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    // 장바구니 정보를 다시 불러와서 화면 갱신
                    // 이 부분은 장바구니를 표시하는 컴포넌트에서 구현해야 합니다.
                } else {
                    alert('상품 구매 중 오류가 발생했습니다.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('오류 발생:', error);
                window.location.reload();
            }
        }
    };

    return (
        <ProductList>
            {productData.map((product) => {
                return (
                    <ProductItem key={product.product_id}>
                            <ProductImage src={product.img_src} alt={product.title} />
                            <ProductTitle>{product.title}</ProductTitle>
                            <ProductPrice>
                                {product.price.toLocaleString()}원
                            </ProductPrice>
                        <AddToCartButton onClick={() => addCart(product.product_id)}>
                            구매하기
                        </AddToCartButton>
                    </ProductItem>
                );
            })}
        </ProductList>
    );
}

export default Gift;