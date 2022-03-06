import React from 'react';
import './Loader.css';

export const Loader: React.FC = () => {
	return (
		<>
			<main className='container'>
				<section className='section section-loader'>
					<div className='loader'></div>
				</section>
			</main>
		</>
	);
};
