package com.bookstore.api.service.impl;

import com.bookstore.api.Repository.BookRepository;
import com.bookstore.api.dto.BookRequestDTO;
import com.bookstore.api.dto.BookResponseDTO;
import com.bookstore.api.exception.DuplicateResourceException;
import com.bookstore.api.exception.ResourceNotFoundException;
import com.bookstore.api.mapper.BookMapper;
import com.bookstore.api.model.Book;
import com.bookstore.api.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepo;
    private final BookMapper bookMapper;
    private final MongoTemplate mongoTemplate;

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
    public Page<BookResponseDTO> getAllBooks(int page, int size, String sortBy, String title) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Query query = new Query().with(pageable);

        if(title != null && title.trim().isEmpty()) {
            query.addCriteria(Criteria.where("title").regex(".*" + title.trim() + ".*" + ".*" + "i"));
        }

        List<Book> books = mongoTemplate.find(query, Book.class);

        // Map documents to DTOs
        List<BookResponseDTO> dtos = books.stream()
                .map(bookMapper::toResponseDTO)
                .collect(Collectors.toList());

        // Standard Spring Data Page generation wrapper that preserves total counts flawlessly
        return PageableExecutionUtils.getPage(
                dtos,
                pageable,
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Book.class)
        );
    }

    @Override
    public BookResponseDTO getBookById(String id) {
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        return bookMapper.toResponseDTO(book);
    }

    @Override
    public BookResponseDTO updateBook(String id, BookRequestDTO dto) {
        Book existingBook = bookRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        // 🎯 Guard Clause: If ISBN is changing, make sure the new one isn't taken
        if (!existingBook.getIsbn().equals(dto.isbn()) && bookRepo.existsByIsbn(dto.isbn())) {
            throw new DuplicateResourceException("Cannot update. ISBN '" + dto.isbn() + "' belongs to another book.");
        }

        // Apply modifications
        existingBook.setTitle(dto.title());
        existingBook.setAuthor(dto.author());
        existingBook.setPrice(dto.price());
        existingBook.setIsbn(dto.isbn());
        existingBook.setPublishedDate(dto.publishedDate());

        Book updatedBook = bookRepo.save(existingBook);
        return bookMapper.toResponseDTO(updatedBook);
    }

    @Override
    public void deleteBook(String id) {
        if (!bookRepo.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Book not found with ID: " + id);
        }
        bookRepo.deleteById(id);
    }
}
