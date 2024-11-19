package com.e203.jwt;

import com.e203.user.entity.User;
import com.e203.user.response.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            return;
        }

        //Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];

        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {

            filterChain.doFilter(request, response);

            return;
        }

        //토큰에서 username과 role 획득
        int userId = jwtUtil.getUserId(token);
        String role = jwtUtil.getRole(token);

        //user를 생성하여 값 set
        User user = User.builder()
                .userPw("temppassword")
                .userRole(role.equals("ROLE_ADMIN") ? 10 : 0)
                .build();
        user.setUserId(userId);


        //UserDetails에 회원 정보 객체 담기
        UserDetailsImpl userDetailsImpl = new UserDetailsImpl(user);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetailsImpl, null, userDetailsImpl.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}