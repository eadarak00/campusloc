package sn.uasz.m1.modules.auth.security;

import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;

import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m1.modules.user.entity.Utilisateur;

@Component
@Slf4j
public class JwtUtil {

    private final Key signingKey;
    // private final Duration expiration;

    // public JwtUtil(@Value("${jwt.secret}") String base64Secret,
    // @Value("${jwt.expiration}") long expirationMillis) {
    // byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
    // this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    // this.expiration = Duration.ofMillis(expirationMillis);
    // }

    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String base64Secret,
            @Value("${jwt.access.expiration}") long accessMillis,
            @Value("${jwt.refresh.expiration}") long refreshMillis) {
        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiration = Duration.ofMillis(accessMillis);
        this.refreshTokenExpiration = Duration.ofMillis(refreshMillis);
    }

    // public String genererToken(Utilisateur utilisateur) {
    // Instant now = Instant.now();
    // Instant expiry = now.plus(expiration);

    // return Jwts.builder()
    // .setSubject(utilisateur.getEmail())
    // .claim("role", utilisateur.getRole().getNom())
    // .setIssuedAt(Date.from(now))
    // .setExpiration(Date.from(expiry))
    // .signWith(signingKey, SignatureAlgorithm.HS512)
    // .compact();
    // }

    public String genererAccessToken(Utilisateur utilisateur) {
        return genererToken(utilisateur, accessTokenExpiration);
    }

    public String genererRefreshToken(Utilisateur utilisateur) {
        return genererToken(utilisateur, refreshTokenExpiration);
    }

    private String genererToken(Utilisateur utilisateur, Duration expiration) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expiration);

        return Jwts.builder()
                .setSubject(utilisateur.getEmail())
                .claim("role", utilisateur.getRole().getNom())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extraireEmail(String token) {
        return getParser()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean estValide(String token, UserDetails userDetails) {
        try {
            final String email = extraireEmail(token);
            return email.equals(userDetails.getUsername()) && !estExpire(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token invalide : {}", e.getMessage());
            return false;
        }
    }

    public boolean estExpire(String token) {
        Date expiration = getParser()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

    private JwtParser getParser() {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build();
    }
}
