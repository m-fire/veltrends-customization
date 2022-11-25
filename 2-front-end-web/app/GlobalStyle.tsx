import { createGlobalStyle } from 'styled-components'

// 글로벌 스타일링
const GlobalStyle = createGlobalStyle`
	// 일반적으로 reset.css 같은 CSS초기화 LIB 를 통해 기본브라우저 CSS를 초기화 한다.
	// CSS초기화 LIB 사용의 이유는 특정 브라우저에서 스타일링 문제 여지를 제거하려고 사용한다. 
	// 그러나 styled-components 를 통한 초기화 방법도 알아두자.
	html {
		box-sizing: border-box;
	}
	* {
		box-sizing: inherit;
	}
	body {
		/* Pretendard 폰트 가져오기 & font-family 설정 */
		@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable.css");
		font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		margin: 0;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	button, input {
		font-family: inherit;
	}

	/* 컨탠츠 Full-height 설정 방법 2가지 */

	// 1. 전역 스타일 제어.
	//html, body {
	//	height: 100vh;
	//}

	// Todo: 2. 특정 컴포넌트 마운트 시점에 스타일 적용. better!
	// Desktop 까지 고려해야 하기 때문에, 컴포넌트 마운트방식 채택!
	// 이유: 전체영역이 필요없는 곳에 Full-height toggle 이 쉬워야 한다는 조건.
`

export default GlobalStyle
