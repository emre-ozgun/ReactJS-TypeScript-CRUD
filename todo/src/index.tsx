import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { CategoryProvider } from './context/category-context';
import { AuthContextProvider } from './context/auth-context';

// Filter Context -> final functionality after crud.

ReactDOM.render(
	<AuthContextProvider>
		<BrowserRouter>
			<CategoryProvider>
				<App />
			</CategoryProvider>
		</BrowserRouter>
	</AuthContextProvider>,
	document.getElementById('root')
);
