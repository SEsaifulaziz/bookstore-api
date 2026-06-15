package com.bookstore.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(
        @NotBlank(message = "User name cannot be blank")
        @Size(max = 50, message = "Name cannot exceed 50 characters")
        String name,

        @NotBlank(message = "Email address cannot be blank")
        @Email(message = "Please provide a valid email format")
        String email
) {}