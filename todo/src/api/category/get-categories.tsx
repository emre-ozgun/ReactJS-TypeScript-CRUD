import axios from 'axios';
import { Status, Todo, Category } from '../../context/category-context';

export const GET_CATEGORIES = async (userId: number) => {
	const baseUrl = process.env.REACT_APP_URL;

	let compositeState: Category[] = [];

	const response = await axios.get(`${baseUrl}/category`);

	// pull out corresponding categories (filter by userId)
	const categories = response.data.filter((category: Category) => {
		return category.userId === userId;
	});

	// for each category, insert stasuses
	for (let category of categories) {
		const stateInstance: Category = {
			updatedAt: category.updatedAt,
			id: category.id,
			title: category.title,
			status: [],
			todo: [],
		};

		const stasuses = await axios.get(
			`${baseUrl}/status?categoryId=${category.id}`
		);

		for (let stasus of stasuses.data) {
			const stasusObj: Status = {
				id: stasus.id,
				title: stasus.title,
				color: stasus.color,
			};
			stateInstance.status.push(stasusObj);
		}

		compositeState.push(stateInstance);
	}

	// // map todos by category and userId
	// const todoResponse = await axios.get(`${baseUrl}/todo`);
	// const todos = todoResponse.data.filter(
	// 	(todo: Todo) => todo.userId === userId
	// );

	// const mapTodosByCategory = todos.reduce((acc: any, todo: Todo) => {
	// 	const category = String(todo.categoryId);

	// 	return {
	// 		...acc,
	// 		[category]: acc[category] ? [...acc[category], todo] : [todo],
	// 	};
	// }, {});

	// console.log({ mapTodosByCategory });

	// for(let i = 0; i < compositeState.length; i++) {

	// }

	// PRE REFACTOR

	// insert todos into corresponding categories
	for (let i = 0; i < compositeState.length; i++) {
		const categoryId = compositeState[i].id;

		const todoResponse = await axios.get(`${baseUrl}/todo`);
		let todo = todoResponse.data;
		todo = todo
			.filter(
				(todo: Todo) => todo.categoryId === categoryId && todo.userId === userId
			)
			.map((todo: Todo) => {
				return {
					id: todo.id,
					title: todo.title,
					statusId: todo.statusId,
				};
			});

		compositeState[i] = {
			...compositeState[i],
			todo,
		};
	}

	return compositeState;
};
