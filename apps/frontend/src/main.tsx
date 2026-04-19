import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import './globals.scss';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
