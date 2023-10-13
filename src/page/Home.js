import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-size: 17px;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 8px;
  text-align: center;
`;

const Ad = styled.div`
  margin-top: 20px;
`;

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const json_url = 'https://public-piece-web.s3.amazonaws.com/json/price.json?{%22srchDt%22%20:%20%22TODAY%22,%22type%20:%20%22Au%22}';
    fetch(json_url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      })
      .then((jsonData) => {
        setData(jsonData.lineUpVal[0]);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <Wrapper>
      <Header>금시세케이알 소개입니다</Header>
      <Table className="main_market_table">
        <thead>
          <tr>
            <Th>3.75g</Th>
            <Th>살 때</Th>
            <Th>팔 때</Th>
          </tr>
        </thead>
        <tbody className="default">
          <tr>
            <th>순금</th>
            <Td id="spure">{data && data.spure.toLocaleString() + '원'}</Td>
            <Td id="ppure">{data && data.ppure.toLocaleString() + '원'}</Td>
          </tr>
          <tr>
            <th>18K</th>
            <Td>제품시세</Td>
            <Td id="p18k">{data && data.p18k.toLocaleString() + '원'}</Td>
          </tr>
          <tr>
            <th>14K</th>
            <Td>제품시세</Td>
            <Td id="p14k">{data && data.p14k.toLocaleString() + '원'}</Td>
          </tr>
          <tr>
            <th>백금</th>
            <Td id="swhite">{data && data.swhite.toLocaleString() + '원'}</Td>
            <Td id="pwhite">{data && data.pwhite.toLocaleString() + '원'}</Td>
          </tr>
          <tr>
            <th>은</th>
            <Td id="ssilver">{data && data.ssilver.toLocaleString() + '원'}</Td>
            <Td id="psilver">{data && data.psilver.toLocaleString() + '원'}</Td>
          </tr>
        </tbody>
      </Table>
      <Ad>광고</Ad>
      <div>제품소개</div>
    </Wrapper>
  );
}

export default Home;