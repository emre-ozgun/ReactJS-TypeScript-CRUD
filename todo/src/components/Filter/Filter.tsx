import React, { useEffect, useState, useContext } from 'react';
import { CategoryContext } from '../../context/category-context';
import './Filter.css';

type FilterProps = {
	isFilterOpen: boolean;
	setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FilterType = {
	category: string;
	status: number[];
	todo: string;
};

const initialFilters: FilterType = {
	category: '',
	status: [],
	todo: '',
};

export const Filter = ({ isFilterOpen, setIsFilterOpen }: FilterProps) => {
	const { categories, setFilters } = useContext(CategoryContext);
	const [filterState, setFilterState] = useState<FilterType>(initialFilters);

	useEffect(() => {
		setFilters?.(filterState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterState]);

	const handleStatusChange = (e: any) => {
		if (!e.target.id) {
			console.log('not found');
			return;
		} else {
			console.log(e.target.id);
		}
	};

	return (
		<div className={`filter-form ${isFilterOpen && 'active'}`}>
			<div className='filter-form__title'>
				<h1>Filter</h1>
				<button onClick={() => setIsFilterOpen(false)}>x</button>
			</div>

			<div className='filter-form__block'>
				<label>By Category Title</label>
				<input
					type='text'
					name='category'
					value={filterState.category}
					placeholder='Search by category title'
					onChange={(e) =>
						setFilterState({
							...filterState,
							[e.target.name]: e.target.value,
						})
					}
				/>
			</div>

			<div className='filter-form__block'>
				<label>Select Status</label>
				<div
					className='filter-form__status-list'
					onClick={(e) => handleStatusChange}
				>
					{categories.map((category) =>
						category.status.map((status) => (
							<span
								className='filter-form__status-list-item'
								style={{ backgroundColor: `${status.color}` }}
								id={String(status.id)}
								key={status.id}
							>
								{status.title}
							</span>
						))
					)}
				</div>
			</div>

			<div className='filter-form__block'>
				<label>By Todo Title</label>
				<input
					type='text'
					value={filterState.todo}
					name='todo'
					placeholder='Search by todo title'
					onChange={(e) =>
						setFilterState({
							...filterState,
							[e.target.name]: e.target.value,
						})
					}
				/>
			</div>

			<div className='filter-form__cta'>
				<button
					type='button'
					onClick={() => {
						setFilterState(initialFilters);
						setIsFilterOpen(false);
					}}
				>
					DONE
				</button>
				<button
					type='button'
					onClick={() => {
						setFilterState(initialFilters);
					}}
				>
					RESET
				</button>
			</div>
		</div>
	);
};
