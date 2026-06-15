package com.bookstore.api.mapper;
import com.bookstore.api.dto.request.UserRequestDTO;
import com.bookstore.api.dto.response.UserResponseDTO;
import com.bookstore.api.model.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class UserMapper {

    /**
     * Translates a registration request DTO into a fresh User entity document.
     */
    public User toEntity(UserRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return User.builder()
                .name(dto.name())
                .email(dto.email())
                .ownedBookIds(new ArrayList<>()) // Initializes an empty book array for new users
                .build();
    }

    /**
     * Translates a User entity document into a clean response DTO layer.
     */
    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getOwnedBookIds()
        );
    }
}