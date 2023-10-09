import React, { useState, useEffect } from 'react';
import KakaoLogin from "react-kakao-login";

const SocialKakao = () => {
  const kakaoClientId = 'f2156d142c51785dc9597e7d98b0a0bd'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보를 저장할 상태 변수

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt_token');
    if (jwtToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const kakaoOnSuccess = async (data) => {
    const access_token = data.response.access_token;
    console.log(data);

    const serverURL = 'http://kimminseok.pythonanywhere.com/user';
    const queryParams = `token=${access_token}`;

    try {
      const response = await fetch(`${serverURL}?${queryParams}`, {
        method: 'GET',
      });

      if (response.ok) {
        const json_token = await response.json();
        const jwt_token = json_token["jwt_token"];
        console.log(jwt_token);
        localStorage.setItem('jwt_token', jwt_token);
        setIsLoggedIn(true);

        // 사용자 정보를 요청
        const userInfoResponse = await fetch(
          `https://kimminseok.pythonanywhere.com/userInfo?client_jwt_token=${jwt_token}`
        );
        if (userInfoResponse.ok) {
          const userInfoData = await userInfoResponse.json();
          setUserInfo(userInfoData);
        }
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
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    setUserInfo(null); // 로그아웃 시 사용자 정보 초기화
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>로그아웃</button>
          {userInfo && <div>사용자 이메일: {userInfo.user_email}</div>}
        </>
      ) : (
        <KakaoLogin
          token={kakaoClientId}
          onSuccess={kakaoOnSuccess}
          onFail={kakaoOnFailure}
        />
      )}
    </>
  );
}

export default SocialKakao;
