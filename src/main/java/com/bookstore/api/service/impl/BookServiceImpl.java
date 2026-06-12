package com.bookstore.api.service.impl;

import com.bookstore.api.Repository.BookRepository;
import com.bookstore.api.dto.BookRequestDTO;
import com.bookstore.api.dto.BookResponseDTO;
import com.bookstore.api.exception.DuplicateResourceException;
import com.bookstore.api.mapper.BookMapper;
import com.bookstore.api.model.Book;
import com.bookstore.api.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepo;
    private final BookMapper bookMapper;

    @Override
    public BookResponseDTO createBook(BookRequestDTO dto) {

        if (bookRepo.existsByIsbn(dto.isbn())) {
            throw new DuplicateResourceException("A book with ISBN " + dto.isbn() + " already exists.");
        }

        Book book = bookMapper.toEntity(dto);
        Book savedBook = bookRepo.save(book);
        return bookMapper.toResponseDTO(savedBook);
    }

    @Override
    public List<BookResponseDTO> getAllBooks() {
        return List.of();
    }

    @Override
    public BookResponseDTO getBookById(String id) {
        return null;
    }

    @Override
    public BookResponseDTO updateBook(String id, BookRequestDTO dto) {
        return null;
    }

    @Override
    public void deleteBook(String id) {

    }
}
