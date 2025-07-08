package sn.uasz.m1.core.configuration;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String fileLocation = "file:" + uploadPath.toString() + "/";
        
        // Configuration des ressources statiques
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileLocation)
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(false); // Important pour éviter les conflits
        
        System.out.println("Static resources configured:");
        System.out.println("Location: " + fileLocation);
        System.out.println("URL Pattern: /uploads/**");
        System.out.println("Full URL: /api/uploads/**");
    }
}