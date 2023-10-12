import React, { useEffect, useState } from 'react';
import KakaoLogin from "react-kakao-login";
import styled from 'styled-components';
import jwt_decode from 'jwt-decode'; // jwt-decode 라이브러리 추가

const StyledSocialKakao = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
`;

const UserInfo = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const LogoutButton = styled.button`
  background-color: #ff5722;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const MyPageLink = styled.a`
  font-size: 16px;
  text-decoration: none;
  color: #007bff;
  margin-bottom: 10px;
`;

const SocialKakao = () => {
  const kakaoClientId = 'f2156d142c51785dc9597e7d98b0a0bd';
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태 변수

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt_token'); // localStorage에서 jwt_token 가져오기
    // jwt 토큰이 있는 경우에만 사용자 정보를 가져와 화면에 표시
    if (localStorage.getItem('jwt_token')) {
      const decodedToken = jwt_decode(jwtToken); // jwt 토큰 디코딩
      if (decodedToken) {
        const userEmail = decodedToken.user_email; // 사용자 이메일 추출
        setUserInfo({ user_email: userEmail });

        // JWT 토큰의 만료 시간을 확인
        const expirationTime = decodedToken.exp * 1000; // 초 단위로 설정되어 있으므로 밀리초로 변환
        const currentTime = Date.now();
        if (expirationTime < currentTime) {
          // 토큰이 만료되었으면 로그아웃 처리
          localStorage.removeItem('jwt_token');
          setUserInfo(null);
        }
      }
    }
  }, []); // jwtToken이 변경될 때만 실행

  const kakaoOnSuccess = async (data) => {
    const access_token = data.response.access_token;

    const serverURL = 'https://minvis.eu.pythonanywhere.com/user';
    const queryParams = `token=${access_token}`;

    try {
      const response = await fetch(`${serverURL}?${queryParams}`, {
        method: 'GET',
      });

      if (response.ok) {
        const json_token = await response.json();
        const jwt_token = json_token["jwt_token"];
        const decodedToken = jwt_decode(jwt_token); // jwt 토큰 디코딩
        if (decodedToken) {
          const userEmail = decodedToken.user_email; // 사용자 이메일 추출
          setUserInfo({ user_email: userEmail });
        }
        localStorage.setItem('jwt_token', jwt_token); // localStorage에 토큰 저장
        // 이미 로그인 상태이므로 중복 호출을 피하기 위해 사용자 정보 업데이트 생략합니다.
      } else {
        console.error('서버 요청 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  }

  const kakaoOnFailure = (error) => {
    console.log(error);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo(null); // 사용자 정보 초기화
  };

  return (
    <StyledSocialKakao>
      {userInfo ? (
        <>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          {userInfo && <UserInfo>{userInfo.user_email}</UserInfo>}
          <MyPageLink href="/mypage">마이페이지</MyPageLink>
        </>
      ) : (
        <KakaoLogin
          token={kakaoClientId}
          onSuccess={kakaoOnSuccess}
          onFail={kakaoOnFailure}
        />
      )}
    </StyledSocialKakao>
  );
}

export default SocialKakao;
