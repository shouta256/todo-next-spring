package com.example.todo.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private Key key;
    private final long expirationInMs = 86400000L; // 24 hours

    @PostConstruct
    public void init() {
        // 実際は環境変数などから秘密鍵を取得することを推奨
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    public String generateToken(String username, Long userId) {
        return Jwts.builder()
                   .setSubject(username)
                   .claim("userId", userId)
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() + expirationInMs))
                   .signWith(key)
                   .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                       .setSigningKey(key)
                       .build()
                       .parseClaimsJws(token)
                       .getBody();
        } catch (JwtException ex) {
            throw new RuntimeException("Invalid JWT token", ex);
        }
    }
}

