import React, { useState, useEffect, useContext } from 'react';
import { Category } from '../../context/category-context';
import { getToken } from '../../utils/getToken';
import { useHistory } from 'react-router-dom';
import { Loader } from '../Loader/Loader';
import { idGenerator } from '../../utils/idGenerator';
import { colorGenerator } from '../../utils/colorGenerator';
import { POST_CATEGORY } from '../../api/category/post-category';
import { DELETE_CATEGORY } from '../../api/category/delete-category';
import { CategoryContext } from '../../context/category-context';
import './AddCategoryForm.css';

type EditCategoryFormProps = {
	isEditCategoryFormOpen: boolean;
	setIsEditCategoryFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
	categoryId: null | number;
};

export const EditCategoryForm = ({
	isEditCategoryFormOpen,
	setIsEditCategoryFormOpen,
	categoryId,
}: EditCategoryFormProps) => {
	const history = useHistory();

	const { id } = getToken();
	if (!id) {
		history.push('/auth');
	}

	const { addCategory, removeCategory, categories } =
		useContext(CategoryContext);

	const [disable, setDisable] = useState(true);
	const [loading, setLoading] = useState(false);

	const [singleCategory, setSingleCategory] = useState<Category>({
		id: 1,
		title: 'Frontend',
		status: [
			{ id: idGenerator(), title: 'In Progress', color: '#ecb341' },
			{ id: idGenerator(), title: 'Urgent', color: '#ed562c' },
		],
		todo: [
			{ id: idGenerator(), title: 'Academic Vocabulary', statusId: 25257 },
			{ id: idGenerator(), title: 'Read Articles', statusId: 29582058 },
		],
	});

	useEffect(() => {
		const categoryToBeEdited = categories.find((c) => c.id === categoryId);

		if (categoryToBeEdited) {
			setSingleCategory(categoryToBeEdited);
		}
	}, [categoryId]);

	// Form validation
	useEffect(() => {
		if (!singleCategory.title.length) {
			setDisable(true);
		} else if (singleCategory.status.some((s) => !s.title.length)) {
			setDisable(true);
		} else if (
			singleCategory.todo.some((t) => !t.title.length || !t.statusId)
		) {
			setDisable(true);
		} else {
			setDisable(false);
		}
	}, [singleCategory.title, singleCategory.status, singleCategory.todo]);

	const handlePostCategory = async (category: Category, userId: number) => {
		console.log('in post');
		setLoading(true);

		try {
			// extract and post category to DB -- SERVER STATE
			await DELETE_CATEGORY(category.id);
			removeCategory?.(category.id);

			const newCategories = await POST_CATEGORY(category, userId);

			//append to state -- UI STATE
			addCategory?.(newCategories);

			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// numify statusId
		const finalState = {
			...singleCategory,
			todo: singleCategory.todo.map((t) => ({
				...t,
				statusId: Number(t.statusId),
			})),
		};

		handlePostCategory(finalState, id);

		// setSingleCategory(reset);
		setIsEditCategoryFormOpen(false);
	};

	// DYNAMIC FORM HANDLERS

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSingleCategory({
			...singleCategory,
			[e.target.name]: e.target.value,
		});
	};

	const handleStatusChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		i: number
	) => {
		setSingleCategory((prev) => {
			const newStatus = prev.status.map((s, idx) => {
				if (idx === i) {
					return {
						...s,
						[e.target.name]: e.target.value,
					};
				} else {
					return s;
				}
			});

			return {
				...prev,
				status: newStatus,
			};
		});
	};

	const handleAddStatus = () => {
		const newStatus = {
			id: idGenerator(),
			title: '',
			color: colorGenerator(),
		};

		setSingleCategory((prev) => {
			return {
				...prev,
				status: [...prev.status, newStatus],
			};
		});
	};

	const handleRemoveStatus = (i: number) => {
		if (singleCategory.status.length === 1) {
			return;
		}

		setSingleCategory((prev) => {
			return {
				...prev,
				status: prev.status.filter((_, idx) => idx !== i),
			};
		});
	};

	const handleAddTodo = () => {
		const newTodo = {
			id: idGenerator(),
			title: '',
			statusId: 0,
		};

		setSingleCategory((prev) => {
			return {
				...prev,
				todo: [...prev.todo, newTodo],
			};
		});
	};

	const handleTodoChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>,
		i: number
	) => {
		setSingleCategory((prev) => {
			const newTodo = prev.todo.map((t, idx) => {
				if (idx === i) {
					return {
						...t,
						[e.target.name]: e.target.value,
					};
				} else {
					return t;
				}
			});
			return {
				...prev,
				todo: newTodo,
			};
		});
	};

	const handleRemoveTodo = (i: number) => {
		if (singleCategory.todo.length === 1) {
			return;
		}

		setSingleCategory((prev) => {
			return {
				...prev,
				todo: prev.todo.filter((_, idx) => idx !== i),
			};
		});
	};

	// END OF DYNAMIC FORM HANDLERS

	if (loading) {
		return <Loader />;
	}

	return (
		<form
			onSubmit={(e) => handleCategorySubmit(e)}
			className={`form form-add ${isEditCategoryFormOpen && 'active'}`}
		>
			<h1 className='form__title'>Edit Category</h1>

			<button
				className='form-add__btn-delete'
				type='button'
				onClick={() => {
					setIsEditCategoryFormOpen(false);
				}}
			>
				x
			</button>

			<div className='form__block'>
				<label htmlFor='email' className='form__block-label'>
					Category Title
				</label>
				<input
					className='form__block-input'
					type='text'
					name='title'
					value={singleCategory.title}
					onChange={(e) => handleTitleChange(e)}
					id='title'
					placeholder='Category Title'
				/>
			</div>
			<div className='form__block'>
				<label
					className='form__block-label form__block-label-cta'
					htmlFor='password'
				>
					Status
					<button onClick={handleAddStatus} type='button'>
						+
					</button>
				</label>
				<div className='form-separator'></div>

				{singleCategory.status?.map((status, i) => (
					<div className='form__block-inline' key={status.id}>
						<input
							className='form__block-input'
							type='text'
							name='title'
							value={status.title}
							onChange={(e) => handleStatusChange(e, i)}
							id='status-name'
							placeholder='Status Title'
						/>
						<input
							className='form__block-input'
							type='color'
							value={status.color}
							onChange={(e) => handleStatusChange(e, i)}
							name='color'
							id='status-color'
							placeholder='Status Color'
						/>
						<button
							className='form__remove-field'
							type='button'
							onClick={() => handleRemoveStatus(i)}
						>
							x
						</button>
					</div>
				))}
			</div>

			<div className='form__block'>
				<label
					className='form__block-label form__block-label-cta'
					htmlFor='password'
				>
					Todo
					<button onClick={handleAddTodo} type='button'>
						+
					</button>
				</label>
				<div className='form-separator'></div>

				{singleCategory.todo.map((todo, i) => (
					<div className='form__block-inline' key={todo.id}>
						<input
							className='form__block-input'
							type='text'
							name='title'
							value={todo.title}
							onChange={(e) => handleTodoChange(e, i)}
							id='status-name'
							placeholder='Todo Title'
						/>

						<select
							name='statusId'
							className='form__block-input'
							defaultValue={'--Select Status--'}
							onChange={(e) => handleTodoChange(e, i)}
						>
							<option value='' className='form__status-options'>
								Select Status
							</option>
							{singleCategory.status
								.filter((s) => Boolean(s.title))
								.map((status, idx) => (
									<option
										className='form__status-options'
										value={status.id}
										key={status.id}
									>
										{status.title}
									</option>
								))}
						</select>

						<button
							type='button'
							className='form__remove-field'
							onClick={() => handleRemoveTodo(i)}
						>
							x
						</button>
					</div>
				))}
			</div>

			<button
				type='submit'
				className='btn form__btn form__btn-submit'
				disabled={disable}
			>
				SAVE
			</button>
		</form>
	);
};
