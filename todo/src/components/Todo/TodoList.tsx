import React from 'react';

import { Category } from '../../context/category-context';
import './TodoList.css';

type TodoListProps = {
	category: Category;
};

// {
// 	id: 1,
// 	title: 'Frontend uygulamalari',
// 	status: [
// 		{ id: idGenerator(), title: 'In Progress', color: '#ecb341' },
// 		{ id: idGenerator(), title: 'Urgent', color: '#ed562c' },
// 	],
// 	todo: [
// 		{ id: idGenerator(), title: 'Academic Vocabulary', statusId: 25257 },
// 		{ id: idGenerator(), title: 'Read Articles', statusId: 29582058 },
// 	],
// },

export const TodoList = ({ category }: TodoListProps) => {
	return (
		<div className='todo-list'>
			{category.todo.map((todo) => {
				const status = category.status.find((s) => s.id === todo.statusId);

				return (
					<div className='todo-list-item' key={todo.id}>
						<div
							className='todo-list-status'
							style={{
								backgroundColor: `${status?.color}`,
								borderColor: `${getContrastYIQ(status?.color)}`,
							}}
						></div>
						<div className='todo-list-todo'>
							<p>{todo.title}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// helper function to calculate contrast and decide on 'black' or 'white' borderColor
const getContrastYIQ = (hexcolor: string | undefined) => {
	if (hexcolor) {
		hexcolor = hexcolor.replace('#', '');
		let r = parseInt(hexcolor.substr(0, 2), 16);
		let g = parseInt(hexcolor.substr(2, 2), 16);
		let b = parseInt(hexcolor.substr(4, 2), 16);
		let yiq = (r * 299 + g * 587 + b * 114) / 1000;

		return yiq >= 128 ? '#33333382' : '#eeeeee5a';
	}
};
