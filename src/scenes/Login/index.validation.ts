import { L } from 'lib/abpUtility';

const rules = {
    userNameOrEmailAddress: [
        {
            required: true,
            message: L('Trường này là bắt buộc'),
        },
    ],
    password: [{ required: true, message: L('Trường này là bắt buộc') }],
};

export default rules;
