import { Hono } from 'hono';
import { cors } from 'hono/cors';

import summarizeRoutes from './summarize';

const aiSummaryApp = new Hono();

aiSummaryApp.use('/*', cors());
aiSummaryApp.route('/summarize', summarizeRoutes);

export default aiSummaryApp;
