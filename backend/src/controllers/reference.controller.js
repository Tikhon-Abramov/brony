import {
    getDepartmentsList,
    getEmployeesList,
} from '../services/reference.service.js';

export async function getDepartments(req, res, next) {
    try {
        const items = await getDepartmentsList();
        res.json(items);
    } catch (error) {
        next(error);
    }
}

export async function getEmployees(req, res, next) {
    try {
        const items = await getEmployeesList();
        res.json(items);
    } catch (error) {
        next(error);
    }
}