const infoSchema = {
    brand: {
        isString: {
            errorMessage: "Не відповідає дійсності"
        },
        notEmpty: {
            errorMessage: "Це поле не повинно бути порожнім"
        },
        trim: true,
        escape: true,
    },
    year: {
        isLength: {
            options: { min: 4, max: 4 },
            errorMessage: "Не відповідає дійсності"
        },
        isString: {
            errorMessage: "Не відповідає дійсності"
        },
        notEmpty: {
            errorMessage: "Це поле не повинно бути порожнім"
        },
        trim: true,
        escape: true,
    },
    number: {
        isString: {
            errorMessage: "Не відповідає дійсності"
        },
        notEmpty: {
            errorMessage: "Це поле не повинно бути порожнім"
        },
        trim: true,
        escape: true,
    },
    carImage: {
        custom: {
            options: (value, { req }) => {
                if (!req.file) {
                    throw new Error('Завантажте зображення');
                }
                return true;
            },
        }
    }
};

export default infoSchema;