// com/example/todo/entity/Todo.java
package com.example.todo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private boolean completed = false;
    private LocalDateTime createdAt;
    
    private Long userId;
    
    private String taskType;
    private String priority;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String frequency;
    private String context;
    private Integer actualCompletionTime;
    private Integer predictedCompletionTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    public Todo() {}

    public Todo(String title, Long userId, String taskType, String priority, LocalDateTime startTime, String frequency, String context) {
        this.title = title;
        this.userId = userId;
        this.taskType = taskType;
        this.priority = priority;
        this.startTime = startTime;
        this.frequency = frequency;
        this.context = context;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public Integer getActualCompletionTime() { return actualCompletionTime; }
    public void setActualCompletionTime(Integer actualCompletionTime) { this.actualCompletionTime = actualCompletionTime; }
    public Integer getPredictedCompletionTime() { return predictedCompletionTime; }
    public void setPredictedCompletionTime(Integer predictedCompletionTime) { this.predictedCompletionTime = predictedCompletionTime; }
    public Folder getFolder() { return folder; }
    public void setFolder(Folder folder) { this.folder = folder; }
}
