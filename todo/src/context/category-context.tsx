import React, { createContext, useEffect, useState } from 'react';
import { idGenerator } from '../utils/idGenerator';
import { FilterType } from '../components/Filter/Filter';

export type Status = {
	id: number;
	title: string;
	color: string;
	flag?: number;
};

export type Todo = {
	id: number;
	title: string;
	statusId: Status['id'];
	categoryId?: number;
	userId?: number;
};

export type Category = {
	updatedAt?: string;
	userId?: number;
	id: number;
	title: string;
	status: Status[];
	todo: Todo[];
};

type CategoryContextType = {
	categories: Category[];
	setCategories?: React.Dispatch<React.SetStateAction<Category[]>>;
	addCategory?: (newCategory: Category) => void;
	removeCategory?: (id: number) => void;
	categoryToBeEdited?: Category;
	setCategoryToBeEdited?: React.Dispatch<React.SetStateAction<Category>>;
	setFilters?: React.Dispatch<React.SetStateAction<FilterType>>;
	filters?: FilterType;
};

//filter, set filter -> manipulate with useEffect

export const CategoryContext = createContext<CategoryContextType>({
	categories: [],
});

export const CategoryProvider: React.FC = ({ children }) => {
	const [categories, setCategories] = useState<Category[]>([] as Category[]);

	const [categoryToBeEdited, setCategoryToBeEdited] = useState({} as Category);

	const [filters, setFilters] = useState({} as FilterType);

	const addCategory = (newCategory: Category) => {
		setCategories((prev) => [newCategory, ...prev]);
	};

	const removeCategory = (categoryId: number) => {
		setCategories(categories.filter((c) => c.id !== categoryId));
	};

	return (
		<CategoryContext.Provider
			value={{
				categories,
				addCategory,
				removeCategory,
				setCategories,
				categoryToBeEdited,
				setCategoryToBeEdited,
				setFilters,
				filters,
			}}
		>
			{children}
		</CategoryContext.Provider>
	);
};
