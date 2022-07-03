import { createRoot } from 'react-dom/client';
import App from 'components/App';

const container = document.getElementById('root')
if (!container) throw new Error('Container not exists in the root');
const root = createRoot(container);

import 'styles/base.css'
import 'styles/colors.css'

root.render(<App />, )
