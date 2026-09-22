package com.relaxit.backend.diagnostic;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * TEMPORARY DIAGNOSTIC FILTER — remove after CORS root cause is confirmed.
 *
 * Purpose: Determine whether HTTP OPTIONS requests reach Spring Boot at all,
 * or are intercepted upstream by the Zoho Catalyst ZGS proxy.
 *
 * Logs ONLY: method, URI, Origin header, and CORS response headers.
 * Does NOT log: cookies, Authorization, JWTs, passwords, or request bodies.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsDiagnosticFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(CorsDiagnosticFilter.class);
    private static final String PREFIX = "RELAXIT_CORS_DIAGNOSTIC";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // ── REQUEST SIDE ──────────────────────────────────────────────────
        String method = request.getMethod();
        String uri    = request.getRequestURI();
        String origin = request.getHeader("Origin");

        log.info("{} method={} uri={} origin={}", PREFIX, method, uri, origin);

        // Continue the filter chain
        filterChain.doFilter(request, response);

        // ── RESPONSE SIDE (after chain completes) ────────────────────────
        String allowOrigin      = response.getHeader("Access-Control-Allow-Origin");
        String allowMethods     = response.getHeader("Access-Control-Allow-Methods");
        String allowHeaders     = response.getHeader("Access-Control-Allow-Headers");
        String allowCredentials = response.getHeader("Access-Control-Allow-Credentials");

        log.info("RELAXIT_CORS_RESPONSE allowOrigin={} allowMethods={} allowHeaders={} allowCredentials={}",
                allowOrigin, allowMethods, allowHeaders, allowCredentials);
    }
}
