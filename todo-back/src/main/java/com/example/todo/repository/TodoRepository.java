package com.example.todo.repository;

import com.example.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // ユーザーIDのみでの取得
    List<Todo> findByUserId(Long userId);
    
    // ユーザーID とフォルダID での取得
    List<Todo> findByUserIdAndFolderId(Long userId, Long folderId);
    
    // ユーザーID で、かつフォルダに属さないタスクの取得
    List<Todo> findByUserIdAndFolderIsNull(Long userId);
}
