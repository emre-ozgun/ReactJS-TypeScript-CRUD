import { useContext, useState, useEffect } from 'react';
import { Category, CategoryContext, Todo } from '../context/category-context';

import { CategoryList } from '../components/Category/CategoryList';
import { AddCategoryForm } from '../components/Category/AddCategoryForm';
import { getToken } from '../utils/getToken';
import { useHistory } from 'react-router-dom';
import { Loader } from '../components/Loader/Loader';
import { FormOverlay } from '../components/Category/FormOverlay';
import { EditCategoryForm } from '../components/Category/EditCategoryForm';
import { Filter } from '../components/Filter/Filter';
import { GET_CATEGORIES } from '../api/category/get-categories';

export const CategoryPage = () => {
	const history = useHistory();
	const { categories, setCategories, filters } = useContext(CategoryContext);
	const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);
	const [isEditCategoryFormOpen, setIsEditCategoryFormOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [categoryId, setCategoryId] = useState<null | number>(null);

	const [loading, setLoading] = useState(true);

	const { id } = getToken();
	if (!id) {
		history.push('/auth');
	}

	const fetchCategories = async (userId: number) => {
		setLoading(true);
		try {
			const result = await GET_CATEGORIES(userId);

			setLoading(false);
			setCategories?.(result);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories(id);
	}, []);

	const handleEditCategory = (id: number) => {
		setCategoryId(id);
		setIsEditCategoryFormOpen(true);
	};

	if (loading) {
		return <Loader />;
	}

	// if (filters?.category) {
	// 	console.log(true);
	// 	categories.filter((category) =>
	// 		category.title.startsWith(filters.category)
	// 	);
	// } else {
	// 	console.log(false);
	// }

	categories.sort((a, b): number => {
		if (a.updatedAt && b.updatedAt) {
			if (a.updatedAt < b.updatedAt) {
				return 1;
			}
			if (a.updatedAt > b.updatedAt) {
				return -1;
			}
			return 0;
		} else {
			return 0;
		}
	});

	const applyFilters = (categories: Category[]) => {
		let filteredCategories = categories;

		if (filters?.category) {
			filteredCategories = categories.filter((c) =>
				c.title.includes(filters.category)
			);
		}

		if (filters?.status) {
			// filter status
		}

		if (filters?.todo) {
			filteredCategories = filteredCategories
				.map((category) => ({
					...category,
					todo: category.todo.filter(
						(todo) =>
							todo.title.includes(filters.todo) &&
							filters?.status.length &&
							filters?.status.includes(todo.statusId)
					),
				}))
				.filter((c) => c.todo.length);
		}

		return filteredCategories;
	};

	return (
		<main className='container'>
			<section className='section section-categories'>
				<article className='categories-title'>
					<h1>Category List</h1>
					<div className='categories-title__cta'>
						<button
							style={{ backgroundColor: '#444' }}
							className='btn btn__category-add'
							onClick={() => setIsFilterOpen(true)}
						>
							filter
						</button>
						<button
							style={{ marginLeft: '0.25rem' }}
							className='btn btn__category-add'
							onClick={() => setIsAddCategoryFormOpen(true)}
						>
							add
						</button>
					</div>
				</article>
				<div className='separator'></div>
				{categories.length < 1 ? (
					<p>Your category list is currently empty, try adding one.</p>
				) : (
					<CategoryList
						categories={applyFilters(categories)}
						handleEditCategory={handleEditCategory}
					/>
				)}

				<AddCategoryForm
					isAddCategoryFormOpen={isAddCategoryFormOpen}
					setIsAddCategoryFormOpen={setIsAddCategoryFormOpen}
				/>

				<EditCategoryForm
					isEditCategoryFormOpen={isEditCategoryFormOpen}
					setIsEditCategoryFormOpen={setIsEditCategoryFormOpen}
					categoryId={categoryId}
				/>
				<Filter isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

				<FormOverlay isAddCategoryFormOpen={isAddCategoryFormOpen} />
			</section>
		</main>
	);
};
