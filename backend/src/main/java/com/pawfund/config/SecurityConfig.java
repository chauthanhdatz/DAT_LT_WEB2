package com.pawfund.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - không cần đăng nhập
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/v3/api-docs", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()

                // Public GET endpoints
                .requestMatchers(HttpMethod.GET, "/api/pets/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/shelters/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lost-pets/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/stats/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/campaigns/**").permitAll()

                // ADMIN: full quyền trên tất cả resource
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/shelters/*/approve").hasRole("ADMIN")
                .requestMatchers("/api/shelters/*/ban").hasRole("ADMIN")
                .requestMatchers("/api/reports/**").hasAnyRole("ADMIN")

                // SHELTER: CRUD trên pets, campaigns thuộc station của mình
                .requestMatchers(HttpMethod.POST, "/api/pets/**").hasAnyRole("SHELTER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/pets/**").hasAnyRole("SHELTER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/pets/**").hasAnyRole("SHELTER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/campaigns/**").hasAnyRole("SHELTER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/campaigns/**").hasAnyRole("SHELTER", "ADMIN")

                // USER + SHELTER: adoption requests, donations, lost pets, reports
                .requestMatchers("/api/adoptions/**").authenticated()
                .requestMatchers("/api/donations/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/lost-pets/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/lost-pets/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/reports/**").authenticated()

                // Tất cả các request khác cần đăng nhập
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

