export const departmentOptions = [
    { value: 'Разработка', label: 'Разработка' },
    { value: 'Маркетинг', label: 'Маркетинг' },
    { value: 'Продажи', label: 'Продажи' },
    { value: 'HR', label: 'HR' },
    { value: 'Финансы', label: 'Финансы' },
    { value: 'Поддержка', label: 'Поддержка' },
    { value: 'Дизайн', label: 'Дизайн' },
    { value: 'Аналитика', label: 'Аналитика' },
    { value: 'Юридический отдел', label: 'Юридический отдел' },
    { value: 'Операционный отдел', label: 'Операционный отдел' },
] as const;

export const employees = [
    { fullName: 'Алексей Смирнов', department: 'Разработка' },
    { fullName: 'Иван Иванов', department: 'Разработка' },
    { fullName: 'Мария Кузнецова', department: 'Маркетинг' },
    { fullName: 'Дмитрий Петров', department: 'Продажи' },
    { fullName: 'Анна Соколова', department: 'HR' },
    { fullName: 'Екатерина Волкова', department: 'Финансы' },
    { fullName: 'Сергей Николаев', department: 'Поддержка' },
    { fullName: 'Ольга Морозова', department: 'Дизайн' },
    { fullName: 'Павел Фёдоров', department: 'Аналитика' },
    { fullName: 'Наталья Орлова', department: 'Юридический отдел' },
    { fullName: 'Артём Васильев', department: 'Операционный отдел' },
    { fullName: 'Виктория Павлова', department: 'Маркетинг' },
    { fullName: 'Кирилл Зайцев', department: 'Разработка' },
    { fullName: 'Полина Лебедева', department: 'Дизайн' },
    { fullName: 'Роман Гусев', department: 'Продажи' },
] as const;

export const employeeOptions = employees.map((employee) => ({
    value: employee.fullName,
    label: employee.fullName,
}));

export const employeeDepartmentMap = Object.fromEntries(
    employees.map((employee) => [employee.fullName, employee.department]),
) as Record<string, string>;