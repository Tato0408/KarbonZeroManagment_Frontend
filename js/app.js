import {startRouter} from './routes.js'

window.addEventListener('DOMContentLoaded', startRouter);
window.addEventListener('hashchange', startRouter)