import React, { useContext, useState } from 'react';
import { Category } from '../../context/category-context';
import './Category.css';
import { CategoryContext } from '../../context/category-context';
import { TodoList } from '../Todo/TodoList';
import { Loader } from '../Loader/Loader';
import { DELETE_CATEGORY } from '../../api/category/delete-category';
import { FaRegEdit } from 'react-icons/fa';

type SingleCategoryProps = {
	category: Category;
	handleEditCategory: (id: number) => void;
};

export const SingleCategory = ({
	category,
	handleEditCategory,
}: SingleCategoryProps) => {
	// need to setup a link -> singlecategory page -> /category/:categoryId

	const { removeCategory } = useContext(CategoryContext);
	const [loading, setLoading] = useState(false);

	const handleDelete = async (categoryId: number) => {
		setLoading(true);
		try {
			await DELETE_CATEGORY(categoryId);
		} catch (error) {
			console.error(error);
		}
	};

	const handleRemoveCategory = (categoryId: number) => {
		handleDelete(categoryId);
		removeCategory?.(categoryId);
		setLoading(false);
	};

	return (
		<>
			<div className='single-category' key={category.id}>
				{loading ? (
					<span className='single-category__title'>
						<Loader />
					</span>
				) : (
					<span className='single-category__title capitalize'>
						{category.title}{' '}
						<span className='single-category__status'>
							{category.status.map((s) => (
								<span
									key={s.id}
									className='single-category__status-color'
									style={{ backgroundColor: `${s.color}` }}
								></span>
							))}
						</span>
					</span>
				)}

				<div className='single-category__cta'>
					<button
						type='button'
						className='btn single-category__btn-delete'
						onClick={() => handleEditCategory(category.id)}
					>
						<FaRegEdit />
					</button>
					<button
						type='button'
						className='btn single-category__btn-delete'
						onClick={() => handleRemoveCategory(category.id)}
					>
						x
					</button>
				</div>
			</div>
			<TodoList category={category} />
		</>
	);
};
