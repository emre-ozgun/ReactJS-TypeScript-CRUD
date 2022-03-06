// export const idGenerator = () => {
// 	let S4 = function () {
// 		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
// 	};
// 	return (
// 		S4() +
// 		S4() +
// 		'-' +
// 		S4() +
// 		'-' +
// 		S4() +
// 		'-' +
// 		S4() +
// 		'-' +
// 		S4() +
// 		S4() +
// 		S4()
// 	);
// };

export const idGenerator = () => {
	return Date.now() + Math.random();
};
