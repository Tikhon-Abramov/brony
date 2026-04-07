export function errorMiddleware(err, req, res, next) {
    console.error(err);

    if (err.code === 'ER_DATA_TOO_LONG') {
        if (err.sqlMessage?.includes('purpose')) {
            return res.status(400).json({
                message: 'Введённые данные в поле "Цель встречи" слишком длинные',
            });
        }

        if (err.sqlMessage?.includes('full_name')) {
            return res.status(400).json({
                message: 'Слишком длинное ФИО',
            });
        }

        return res.status(400).json({
            message: 'Введённые данные слишком длинные',
        });
    }

    // 🔹 ENUM ошибки (как у тебя было)
    if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' ||
        err.code === 'WARN_DATA_TRUNCATED') {
        return res.status(400).json({
            message: 'Некорректное значение одного из полей',
        });
    }

    // 🔹 свои ошибки (которые ты сам кидаешь)
    if (err.status) {
        return res.status(err.status).json({
            message: err.message,
        });
    }

    // 🔹 fallback
    return res.status(500).json({
        message: 'Внутренняя ошибка сервера',
    });
}