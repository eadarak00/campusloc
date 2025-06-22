package sn.uasz.m1.modules.auth.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sn.uasz.m1.modules.user.entity.Utilisateur;
import sn.uasz.m1.modules.user.repository.UtilisateurRepository;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Cas : pas de token → on continue le filtre sans authentifier
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // Supprimer "Bearer "

        String email;
        try {
            email = jwtUtil.extraireEmail(token);
        } catch (Exception e) {
            filterChain.doFilter(request, response); // Token invalide
            return;
        }

        // Si utilisateur déjà authentifié, ne rien faire
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Utilisateur utilisateur = utilisateurRepo.findByEmail(email).orElse(null);

            if (utilisateur != null && jwtUtil.estValide(token, utilisateur)) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        utilisateur,
                        null,
                        utilisateur.getAuthorities()
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // On injecte l'utilisateur dans le contexte de sécurité
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Poursuivre la chaîne des filtres
        filterChain.doFilter(request, response);
    }
}
