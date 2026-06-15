package com.bookstore.api.service;

import com.bookstore.api.dto.request.UserRequestDTO;
import com.bookstore.api.dto.response.UserResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO addBookToUser(String userId, String bookId);
}