package com.finance.tracker.controller;

import com.finance.tracker.model.User;
import com.finance.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("email", user.getEmail());
                    response.put("fullName", user.getFullName());
                    response.put("avatarUrl", user.getAvatarUrl());
                    response.put("phoneNumber", user.getPhoneNumber());
                    response.put("phoneCountryCode", user.getPhoneCountryCode());
                    response.put("gender", user.getGender());
                    response.put("idNumber", user.getIdNumber());
                    response.put("taxIdNumber", user.getTaxIdNumber());
                    response.put("taxCountryCode", user.getTaxCountryCode());
                    response.put("residentialAddress", user.getResidentialAddress());
                    response.put("baseCurrencyCode", user.getBaseCurrencyCode());
                    response.put("timezone", user.getTimezone());
                    response.put("locale", user.getLocale());
                    response.put("status", user.getStatus());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestParam String email, @RequestBody Map<String, Object> updates) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    if (updates.containsKey("fullName")) user.setFullName((String) updates.get("fullName"));
                    if (updates.containsKey("avatarUrl")) user.setAvatarUrl((String) updates.get("avatarUrl"));
                    if (updates.containsKey("phoneNumber")) user.setPhoneNumber((String) updates.get("phoneNumber"));
                    if (updates.containsKey("phoneCountryCode")) user.setPhoneCountryCode((String) updates.get("phoneCountryCode"));
                    if (updates.containsKey("gender")) user.setGender((String) updates.get("gender"));
                    if (updates.containsKey("taxIdNumber")) user.setTaxIdNumber((String) updates.get("taxIdNumber"));
                    if (updates.containsKey("taxCountryCode")) user.setTaxCountryCode((String) updates.get("taxCountryCode"));
                    if (updates.containsKey("residentialAddress")) user.setResidentialAddress((String) updates.get("residentialAddress"));
                    if (updates.containsKey("baseCurrencyCode")) user.setBaseCurrencyCode((String) updates.get("baseCurrencyCode"));
                    if (updates.containsKey("timezone")) user.setTimezone((String) updates.get("timezone"));

                    User saved = userRepository.save(user);
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", saved.getId());
                    response.put("email", saved.getEmail());
                    response.put("fullName", saved.getFullName());
                    response.put("avatarUrl", saved.getAvatarUrl());
                    response.put("phoneNumber", saved.getPhoneNumber());
                    response.put("phoneCountryCode", saved.getPhoneCountryCode());
                    response.put("gender", saved.getGender());
                    response.put("taxIdNumber", saved.getTaxIdNumber());
                    response.put("taxCountryCode", saved.getTaxCountryCode());
                    response.put("residentialAddress", saved.getResidentialAddress());
                    response.put("baseCurrencyCode", saved.getBaseCurrencyCode());
                    response.put("timezone", saved.getTimezone());
                    response.put("locale", saved.getLocale());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestParam String email, @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current and new password required"));
        }

        return userRepository.findByEmail(email)
                .map(user -> {
                    // Note: In production, use password encoder to verify
                    if (!currentPassword.equals(user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Current password is incorrect"));
                    }
                    user.setPassword(newPassword);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam String email, @RequestParam("avatar") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select a file"));
        }

        return userRepository.findByEmail(email)
                .map(user -> {
                    try {
                        // Create upload directory if it doesn't exist
                        String uploadDir = "uploads/avatars/";
                        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                        if (!java.nio.file.Files.exists(uploadPath)) {
                            java.nio.file.Files.createDirectories(uploadPath);
                        }

                        // Generate unique filename
                        String filename = user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        java.nio.file.Path filePath = uploadPath.resolve(filename);

                        // Save file
                        java.nio.file.Files.copy(file.getInputStream(), filePath);

                        // Update user avatar URL
                        String avatarUrl = "/uploads/avatars/" + filename;
                        user.setAvatarUrl(avatarUrl);
                        userRepository.save(user);

                        return ResponseEntity.ok(Map.of(
                                "message", "Avatar uploaded successfully",
                                "avatarUrl", avatarUrl
                        ));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }
}
