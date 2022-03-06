import React from 'react';
import './AddCategoryForm.css';

type FormOverlayProps = {
	isAddCategoryFormOpen: boolean;
};

export const FormOverlay = ({ isAddCategoryFormOpen }: FormOverlayProps) => {
	return (
		<div
			className={`form-add__overlay ${isAddCategoryFormOpen && 'active'}`}
		></div>
	);
};
