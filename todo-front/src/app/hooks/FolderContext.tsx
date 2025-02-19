"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

/** コンテキストに保持したい値の型 */
type FolderContextValue = {
	selectedFolderId: number | null;
	setSelectedFolderId: (id: number | null) => void;
};

/** コンテキストを作成する。
 *  初期値は `undefined` にして、Provider外で使われたらエラーを投げるようにする。
 */
const FolderContext = createContext<FolderContextValue | undefined>(undefined);

/** Providerコンポーネント */
export function FolderProvider({ children }: { children: React.ReactNode }) {
	const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

	return (
		<FolderContext.Provider value={{ selectedFolderId, setSelectedFolderId }}>
			{children}
		</FolderContext.Provider>
	);
}

/** カスタムフック: FolderContext を取得する */
export function useFolder() {
	const context = useContext(FolderContext);
	if (!context) {
		throw new Error("useFolder must be used within a <FolderProvider>");
	}
	return context;
}
