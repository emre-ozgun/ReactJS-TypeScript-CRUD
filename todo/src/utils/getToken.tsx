export const getToken = () => {
	return JSON.parse(localStorage.getItem('user') || '{}');
};
