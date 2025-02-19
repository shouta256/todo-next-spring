package com.example.todo.service;

import com.example.todo.entity.User;
import com.example.todo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User register(String username, String password) {
        if(userRepository.findByUsername(username) != null) {
            logger.warn("Attempted registration with existing username: {}", username);
            throw new RuntimeException("Username already exists");
        }
        // パスワードのハッシュ化
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(username, hashedPassword);
        logger.info("Registering user: {}", username);
        return userRepository.save(user);
    }
    
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid login attempt for username: {}", username);
            throw new RuntimeException("Invalid credentials");
        }
        logger.info("User logged in: {}", username);
        return user;
    }
}
