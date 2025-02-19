// app/components/LogoutButton.tsx
'use client';

import React from 'react';
import { Button } from '@mui/material';

type LogoutButtonProps = {
  onLogout: () => void;
};

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = () => {
    // ログイン時に保存した認証トークンやユーザーIDを削除する
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    // ログアウト状態にするためのコールバックを呼ぶ
    onLogout();
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
