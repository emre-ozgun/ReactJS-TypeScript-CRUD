type UserResponse = {
	id: number;
	username: string;
	token: string;
};

export const setToken = (obj: UserResponse | null) => {
	if (obj === null) {
		localStorage.clear();
		return;
	}

	localStorage.setItem('user', JSON.stringify(obj));
};
