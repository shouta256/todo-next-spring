// com/example/todo/entity/Folder.java
package com.example.todo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // フォルダは特定のユーザーに紐づくと仮定（ユーザーIDを保存）
    private Long userId;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> todos;

    public Folder() { }

    public Folder(String name, Long userId) {
        this.name = name;
        this.userId = userId;
    }

    // Getter/Setter
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<Todo> getTodos() { return todos; }
    public void setTodos(List<Todo> todos) { this.todos = todos; }
}
