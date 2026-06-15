package com.bookstore.api.dto;

import java.util.List;

public record UserResponseDTO(
        String id,
        String name,
        String email,
        List<String> ownedBookIds // Shows the associated book IDs belonging to this user profile
) {}