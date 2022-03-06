import React from 'react';

import { Category } from '../../context/category-context';
import { SingleCategory } from './SingleCategory';
import './Category.css';

type CategoryListProps = {
	categories: Category[];
	handleEditCategory: (id: number) => void;
};

export const CategoryList = ({
	categories,
	handleEditCategory,
}: CategoryListProps) => {
	return (
		<article className='category-list'>
			{categories.map((category) => (
				<SingleCategory
					category={category}
					key={category.id}
					handleEditCategory={handleEditCategory}
				/>
			))}
		</article>
	);
};
