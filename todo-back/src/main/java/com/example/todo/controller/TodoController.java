package com.example.todo.controller;

import com.example.todo.entity.Folder;
import com.example.todo.entity.Todo;
import com.example.todo.service.TodoService;
import com.example.todo.service.FolderService;
import com.example.todo.repository.TodoRepository;
import com.example.todo.dto.TodoRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoService todoService;
    private final FolderService folderService;
    private final TodoRepository todoRepository;
    
    public TodoController(TodoService todoService, FolderService folderService, TodoRepository todoRepository) {
        this.todoService = todoService;
        this.folderService = folderService;
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getTodos(@RequestParam Long userId, @RequestParam(required = false) Long folderId, @RequestParam(required = false) Boolean all) {
    if (Boolean.TRUE.equals(all)) {
        return todoService.getTodosByUserId(userId);  // ユーザーの全タスクを返す
    } else if (folderId != null) {
        return todoService.getTodosByUserIdAndFolderId(userId, folderId);
    }
    return todoService.getUnassignedTodosByUserId(userId);
}

    @PostMapping
public Todo addTodo(@RequestBody @Valid TodoRequest request) {
    // "yyyy-MM-dd'T'HH:mm" 形式でパースするフォーマッターを定義
    DateTimeFormatter formatter = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")  // 分までは必須
            .optionalStart()
            .appendPattern(":ss")                 // 秒はオプション
            .optionalEnd()
            .toFormatter();

    LocalDateTime startTime;
    try {
        startTime = LocalDateTime.parse(request.getStartTime(), formatter);
    } catch (Exception ex) {
        throw new RuntimeException("Invalid startTime format: " + request.getStartTime(), ex);
    }
    
    Todo todo = todoService.createTodo(
        request.getTitle(),
        request.getUserId(),
        request.getTaskType(),
        request.getPriority(),
        startTime,
        request.getFrequency(),
        request.getContext()
    );
    
    if (request.getFolderId() != null) {
        Folder folder = folderService.getFolderById(request.getFolderId());
        todo.setFolder(folder);
        todo = todoRepository.save(todo);
    }
    return todo;
}


    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody @Valid TodoRequest request) {
        return todoService.updateTodo(id, request.getTitle());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    public Todo completeTodo(@PathVariable Long id) {
        return todoService.updateCompletion(id, true);
    }

    @PutMapping("/{id}/incomplete")
    public Todo incompleteTodo(@PathVariable Long id) {
        return todoService.updateCompletion(id, false);
    }
}
