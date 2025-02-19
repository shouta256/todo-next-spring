package com.example.todo.service;

import com.example.todo.entity.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }
    
    // 指定されたユーザーの全タスク取得
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }
    
    // 指定ユーザーのタスクをすべて取得
    public List<Todo> getTodosByUserId(Long userId) {
        return todoRepository.findByUserId(userId);
    }
    
    // ユーザーID とフォルダID によるタスク取得
    public List<Todo> getTodosByUserIdAndFolderId(Long userId, Long folderId) {
        return todoRepository.findByUserIdAndFolderId(userId, folderId);
    }
    
    // ユーザーID で、かつフォルダに属していないタスク取得（「All」項目用）
    public List<Todo> getUnassignedTodosByUserId(Long userId) {
        return todoRepository.findByUserIdAndFolderIsNull(userId);
    }
    
    
    public Todo createTodo(String title, Long userId, String taskType, String priority, 
                           java.time.LocalDateTime startTime, String frequency, String context) {
        //ダミー実装
        Integer predictedTime = predictCompletionTime(title, taskType, priority, startTime, frequency, context);
        Todo todo = new Todo(title, userId, taskType, priority, startTime, frequency, context);
        todo.setPredictedCompletionTime(predictedTime);
        return todoRepository.save(todo);
    }
    
    private Integer predictCompletionTime(String title, String taskType, String priority, 
                                          java.time.LocalDateTime startTime, String frequency, String context) {
        int baseTime = title.length() * 2;
        if ("coding".equalsIgnoreCase(taskType)) {
            baseTime += 20;
        } else if ("study".equalsIgnoreCase(taskType)) {
            baseTime += 15;
        } else if ("shopping".equalsIgnoreCase(taskType)) {
            baseTime += 10;
        } else if ("exercise".equalsIgnoreCase(taskType)) {
            baseTime += 5;
        }
        if ("high".equalsIgnoreCase(priority)) {
            baseTime += 15;
        } else if ("medium".equalsIgnoreCase(priority)) {
            baseTime += 10;
        } else if ("low".equalsIgnoreCase(priority)) {
            baseTime += 5;
        }
        if ("daily".equalsIgnoreCase(frequency)) {
            baseTime -= 5;
        } else if ("weekly".equalsIgnoreCase(frequency)) {
            baseTime += 5;
        }
        if ("office".equalsIgnoreCase(context)) {
            baseTime -= 5;
        } else if ("home".equalsIgnoreCase(context)) {
            baseTime += 5;
        }
        if (startTime != null) {
            int hour = startTime.getHour();
            if (hour < 8) {
                baseTime += 10;
            }
            if (hour >= 19) {
                baseTime += 5;
            }
        }
        return baseTime;
    }
    
    public Todo updateTodo(Long id, String newText) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        todo.setTitle(newText);
        todo.setPredictedCompletionTime(predictCompletionTime(newText, todo.getTaskType(), 
            todo.getPriority(), todo.getStartTime(), todo.getFrequency(), todo.getContext()));
        return todoRepository.save(todo);
    }
    
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
    
    public Todo updateCompletion(Long id, boolean completed) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        todo.setCompleted(completed);
        return todoRepository.save(todo);
    }

}
