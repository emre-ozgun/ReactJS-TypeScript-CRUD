import { Category } from '../../context/category-context';
import axios from 'axios';

// LOGIC : visit necessary endpoints, post necessary data, construct UI state

export const POST_CATEGORY = async (category: Category, userId: number) => {
	const baseUrl = process.env.REACT_APP_URL;

	//state to be constructed for UI State.
	let newCategoryState: Category = {
		id: 0,
		title: '',
		status: [],
		todo: [],
	};

	// after handling POST,  construct newCategoryState from responses.
	const categoryToBeCreated = {
		title: category.title,
	};
	const statusToBeCreated = category.status;
	const todoToBeCreated = category.todo;

	const { data } = await axios.post(`${baseUrl}/category`, categoryToBeCreated);
	newCategoryState.id = data.id;
	newCategoryState.title = data.title;

	for (let status of statusToBeCreated) {
		const { data } = await axios.post(`${baseUrl}/status`, {
			title: status.title,
			categoryId: newCategoryState.id,
			color: status.color,
		});
		newCategoryState.status.push({
			id: data.id,
			title: data.title,
			color: data.color,
			flag: status.id,
		});
	}

	for (let todo of todoToBeCreated) {
		const statusId = newCategoryState.status.find(
			(s) => s.flag === todo.statusId
		);

		const { data } = await axios.post(`${baseUrl}/todo`, {
			title: todo.title,
			categoryId: newCategoryState.id,
			statusId: statusId?.id,
		});

		newCategoryState.todo.push({
			id: data.id,
			statusId: data.statusId,
			title: data.title,
		});
	}

	// remove flag from status, it was being utilized to match todos.
	newCategoryState = {
		...newCategoryState,
		status: newCategoryState.status.map((s) => ({
			id: s.id,
			title: s.title,
			color: s.color,
		})),
	};

	return newCategoryState;
};
