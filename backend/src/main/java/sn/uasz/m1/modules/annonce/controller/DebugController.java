package sn.uasz.m1.modules.annonce.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/test-security")
    public ResponseEntity<String> testSecurity() {
        return ResponseEntity.ok("✅ Security OK - Endpoint accessible");
    }

    @GetMapping("/test-file/{filename}")
    public ResponseEntity<String> testFile(@PathVariable String filename) {
        Path filePath = Paths.get(uploadDir, "annonces", filename);
        
        Map<String, Object> info = new HashMap<>();
        info.put("filename", filename);
        info.put("fullPath", filePath.toString());
        info.put("exists", Files.exists(filePath));
        info.put("readable", Files.isReadable(filePath));
        info.put("size", Files.exists(filePath) ? filePath.toFile().length() : 0);
        
        return ResponseEntity.ok(info.toString());
    }

    @GetMapping("/serve-direct/{filename}")
    public ResponseEntity<byte[]> serveDirect(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "annonces", filename);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] bytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}