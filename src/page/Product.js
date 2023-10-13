import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';

// 스타일드 컴포넌트 정의
const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px;
`;

const ProductInfo = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
  margin: auto;
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 8px;
  max-width: 640px;
  margin: auto;
`;

const ProductTitle = styled.h2`
    margin: 10px 0;
    line-height: 1.2;
    border: solid 1px gainsboro;
    padding: 10px;
    border-radius: 10px;
    text-align: left;
`;

const ProductPrice = styled.h3`
  font-weight: bold;
  color: #007bff;
  margin-top: 10px;
`;

const PriceChangeBadge = styled.span`
  background: deeppink;
  color: pink;
  padding: 0 4px;
  border-radius: 4px;
  margin-right: 8px;
`;

const CoupangBtn = styled.button`
    background: #007bff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
    font-size: 16px;
`;

const CoupangLink = styled.a`
  color: #fff;
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

const Coupang_text = styled.p`
    margin-top: 20px;
    color: gray;
    font-size: 14px;
    text-align: center;
`;

function Product() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const product_id = searchParams.get("id");
    const apiBaseUrl = 'https://minvis.eu.pythonanywhere.com';

    const [product, setProduct] = useState({
        product_id: '',
        title: '',
        price: '',
        price_json: '',
        price_percent: '',
        img_src: '',
        coupang_url: '',
        karat: ''
    });

    // canvas 요소를 useRef를 통해 참조
    const canvasRef = useRef(null);
    const chartRef = useRef(null); // 차트 참조 추가

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`${apiBaseUrl}/find_product?cart=${product_id}`);
                if (response.ok) {
                    const productData = await response.json();
                    const productItem = productData[0];

                    // 이전 차트 파괴
                    if (productItem) {
                        let price;
                        let price_json;
                        let maxPrice;
                        let price_percent;
                        if (productItem.karat !== 1) {
                            const priceData = productItem.price;
                            const jsonString = priceData.replace(/'/g, '"');
                            price_json = JSON.parse(jsonString);
                            maxPrice = price_json.price_list.reduce((max, item) => (item > max ? item : max), price_json.price_list[0]);
                            price = price_json.price_list[price_json.price_list.length - 1];
                            price_percent = (((maxPrice - price) / maxPrice) * 100).toFixed(1);
                        } else {
                            price = productItem.price;
                            price_json = null;
                            price_percent = null;
                         }           

                        setProduct({
                            product_id: productItem.product_id,
                            title: productItem.title,
                            price: price,
                            price_json: price_json,
                            price_percent: price_percent,
                            img_src: productItem.img_src,
                            coupang_url: productItem.coupang_url,
                            karat: productItem.karat
                        });
                    } else {
                        alert('상품 가격 정보가 없습니다.');
                    }
                } else {
                    alert('오류 발생.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('오류 발생:', error);
                alert('오류 발생.');
            }
        }

        fetchProduct();
    }, [apiBaseUrl, product_id]);

    useEffect(() => {
        // 이전 차트 파괴 코드 추가
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (canvasRef.current) {
            const chart_info = product.price_json;
            const ctx = canvasRef.current;
            const labels = chart_info['date_list'];
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: '가격',
                        data: chart_info['price_list'],
                        borderColor: 'hotpink',
                        backgroundColor: '#F56666',
                        pointRadius: 0,
                        borderWidth: 2,
                        borderJoinStyle: 'round',
                    },
                ]
            };
            const config = {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    stacked: false,
                    plugins: {
                        title: {
                            display: false,
                            text: '가격 그래프'
                        },
                        legend: {
                            position: 'top',
                            align: 'end',
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        y1: {
                            type: 'linear',
                            display: false,
                            position: 'right',
                            grid: {
                                drawOnChartArea: true,
                            },
                        }
                    }
                },
            };

            // 새로운 차트 생성
            chartRef.current = new Chart(ctx, config);
        }
    }, [product.price_json]);
    const addCart = async (product_id) => {
        const jwtToken = localStorage.getItem('jwt_token');
        try {
          const response = await fetch(
            `${apiBaseUrl}/add_cart?client_jwt_token=${jwtToken}&product_id=${product_id}`,
            { method: 'GET' }
          );
          if (response.ok) {
            const result = await response.json();
            alert(result.message);
          } else {
            alert('상품 추가 중 오류가 발생했습니다.');
          }
        } catch (error) {
          console.error('오류 발생:', error);
        }
      };
    return (
        <ProductContainer>
          <ProductImage src={product.img_src} alt={product.title} />
          <ProductInfo>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductPrice>
              {product.price_percent && (
                <PriceChangeBadge>-{product.price_percent}%</PriceChangeBadge>
              )}
              <span style={{color: 'deeppink'}}>{product.price.toLocaleString()}원</span>
            </ProductPrice>
            <canvas ref={canvasRef} id="priceChart"></canvas>
            <CoupangBtn>
                <CoupangLink href={product.coupang_url}>쿠팡에서 보기</CoupangLink>
            </CoupangBtn>
            <AddToCartButton onClick={() => addCart(product.product_id)}>
              장바구니 담기
            </AddToCartButton>
            <Coupang_text>쿠팡파트너스 활동의 일환으로 일정액의 수수료를 지급 받을 수 있습니다.</Coupang_text>
          </ProductInfo>
        </ProductContainer>
      );
    }
    
    export default Product;
