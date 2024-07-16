package jvbz.boot.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.HiddenHttpMethodFilter;

@Configuration
public class FilterConfig {
	@Bean
	FilterRegistrationBean<CharacterEncodingFilter> characterEncodingFilter() {
//다이아몬드(< >) 연산자를 사용하면 제네릭 타입을 추론할 수 있다.
		FilterRegistrationBean<CharacterEncodingFilter> filterRegistrationBean = new FilterRegistrationBean<>();
		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
//필터의 인코딩을 UTF-8로 설정한다.
		characterEncodingFilter.setEncoding("UTF-8");
//인코딩 설정을 강제한다.
		characterEncodingFilter.setForceEncoding(true);
//등록 빈에 필터를 설정한다.
		filterRegistrationBean.setFilter(characterEncodingFilter);
//필터를 모든 URL 패턴에 대해 적용하도록 설정한다.
		filterRegistrationBean.addUrlPatterns("/*");
		return filterRegistrationBean;
	}

	@Bean
	FilterRegistrationBean<HiddenHttpMethodFilter> hiddenHttpMethodFilter() {
		FilterRegistrationBean<HiddenHttpMethodFilter> filterRegistrationBean = new FilterRegistrationBean<>();
// HTTP의 PUT 메서드, DELETE 메서드 등 RESTful에서 적용되는 모든 메서드를 지원한다.
		HiddenHttpMethodFilter hiddenHttpMethodFilter = new HiddenHttpMethodFilter();
		filterRegistrationBean.setFilter(hiddenHttpMethodFilter);
		filterRegistrationBean.addUrlPatterns("/*");
		return filterRegistrationBean;
	}
}