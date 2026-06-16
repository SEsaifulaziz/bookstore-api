package com.bookstore.api.service;

import com.bookstore.api.dto.request.UserRequestDTO;
import com.bookstore.api.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    Page<UserResponseDTO> getAllUsers(int page, int size);

    UserResponseDTO addBookToUser(String userId, String bookId);
}