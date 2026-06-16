package com.bookstore.api.service.impl;

import com.bookstore.api.Repository.BookRepository;
import com.bookstore.api.Repository.UserRepository;
import com.bookstore.api.dto.request.UserRequestDTO;
import com.bookstore.api.dto.response.UserResponseDTO;
import com.bookstore.api.exception.DuplicateResourceException;
import com.bookstore.api.mapper.UserMapper;
import com.bookstore.api.model.User;
import com.bookstore.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final BookRepository bookRepo;
    private final UserMapper userMapper;

    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if(userRepo.existsByEmail(userRequestDTO.email())){
            throw new DuplicateResourceException("A user with this email already exists");
        }

        User user = userMapper.toEntity(userRequestDTO);
        User savedUser = userRepo.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<User>  users = userRepo.findAll(pageable);

        return users.map(userMapper::toResponseDTO);
    }

    @Override
    public UserResponseDTO addBookToUser(String userId, String bookId) {
        return null;
    }


}
