// com/example/todo/service/FolderService.java
package com.example.todo.service;

import com.example.todo.entity.Folder;
import com.example.todo.repository.FolderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FolderService {

    private final FolderRepository folderRepository;

    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    public Folder createFolder(String name, Long userId) {
        Folder folder = new Folder(name, userId);
        return folderRepository.save(folder);
    }

    public List<Folder> getFoldersByUserId(Long userId) {
        return folderRepository.findByUserId(userId);
    }

    public Folder updateFolder(Long folderId, String newName) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found with id: " + folderId));
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    public void deleteFolder(Long folderId) {
        folderRepository.deleteById(folderId);
    }
    
    public Folder getFolderById(Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with id: " + folderId));
    }
}
