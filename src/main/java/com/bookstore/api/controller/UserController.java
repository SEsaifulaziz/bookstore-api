package com.bookstore.api.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.api.dto.request.UserRequestDTO;
import com.bookstore.api.dto.response.UserResponseDTO;
import com.bookstore.api.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 🎯 POST /api/v1/users -> Register a brand new User profile
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO savedUser = userService.createUser(userRequestDTO);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // 🎯 GET /api/v1/users?page=0&size=10 -> Fetch User profiles using safe pagination structures
    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserResponseDTO> users = userService.getAllUsers(page, size);
        return ResponseEntity.ok(users);
    }

    // 🎯 PUT /api/v1/users/{userId}/books/{bookId} -> Establish the Cross-Model Association
    @PutMapping("/{userId}/books/{bookId}")
    public ResponseEntity<UserResponseDTO> addBookToUser(
            @PathVariable String userId,
            @PathVariable String bookId) {
        UserResponseDTO updatedUser = userService.addBookToUser(userId, bookId);
        return ResponseEntity.ok(updatedUser);
    }
}