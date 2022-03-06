import axios from 'axios';

/* LOGIC : DELETE CATEGORY
 1. delete category by categoryId.
 2. statuses are automatically deleted but todos are not (categoryId remains null).
 3. How to delete todos ?
   a. get all todos
   b. filter todos by categoryId === null (since category is deleted)
   c. for each todo (that has categoryId:null) -> delete todo/:todoId
 */

export const DELETE_CATEGORY = async (categoryIdToBeDeleted: number) => {
	const baseUrl = process.env.REACT_APP_URL;

	try {
		await axios.delete(`${baseUrl}/category/${categoryIdToBeDeleted}`);
	} catch (error) {
		console.error(error);
	}

	const todoRes = await axios.get(`${baseUrl}/todo`);

	const todosToBeDeleted = [];

	for (let todo of todoRes.data) {
		if (todo.categoryId === null) {
			todosToBeDeleted.push(todo.id);
		}
	}

	for (let todoId of todosToBeDeleted) {
		try {
			await axios.delete(`${baseUrl}/todo/${todoId}`);
		} catch (error) {
			console.error(error);
		}
	}
};
