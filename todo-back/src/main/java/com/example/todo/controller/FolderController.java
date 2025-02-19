// com/example/todo/controller/FolderController.java
package com.example.todo.controller;

import com.example.todo.entity.Folder;
import com.example.todo.service.FolderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:3000")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<Folder> getFolders(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return folderService.getFoldersByUserId(userId);
        }
        return folderService.getFoldersByUserId(null);
    }

    @PostMapping
    public Folder createFolder(@RequestBody FolderRequest request) {
        return folderService.createFolder(request.getName(), request.getUserId());
    }

    @PutMapping("/{id}")
    public Folder updateFolder(@PathVariable Long id, @RequestBody FolderRequest request) {
        return folderService.updateFolder(id, request.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }

    public static class FolderRequest {
        private String name;
        private Long userId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}
