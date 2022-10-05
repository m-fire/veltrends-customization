import { createGlobalStyle } from "styled-components";

// 글로벌 스타일링
const GlobalStyle = createGlobalStyle`
	// 일반적으로 reset.css 같은 CSS초기화 LIB 를 통해 기본브라우저 CSS를 초기화 한다.
	// CSS초기화 LIB 사용의 이유는 특정 브라우저에서 스타일링 문제 여지를 제거하려고 사용한다. 
	// 그러나 styled-components 를 통한 초기화 방법도 알아두자.
	body {
		margin: 0;
	}
`;

export default GlobalStyle;
