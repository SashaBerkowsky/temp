type TextFieldProps = {
    className: string;
    handleEdit: Function;
    isEditing: boolean;
    onChange: Function;
    placeholder: string;
    value: string;
    variant?: string;
};

const TextField = ({
    className,
    handleEdit,
    isEditing,
    onChange,
    placeholder,
    value,
    variant,
}: TextFieldProps) => {
    const styling = {
        default: {
            input: `${className} outline outline-naranja outline-2 rounded-md focus:outline-naranja`,
            label: `${className} my-3 bg-inherit`,
            editIcon: 'cursor-pointer w-6 my-3',
        },
        sm: {
            input: `${className} outline outline-naranja outline-2 rounded-md focus:outline-naranja w-16`,
            label: `${className} bg-inherit truncate w-[76px]`,
            editIcon: 'cursor-pointer w-5 truncate',
        },
    };
    return (
        <div className="flex items-center justify-center gap-2">
            {isEditing ? (
                <input
                    type="text"
                    name="team-name"
                    id="team-name"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className={
                        variant === 'sm'
                            ? styling.sm.input
                            : styling.default.input
                    }
                />
            ) : (
                <div
                    className={
                        variant === 'sm'
                            ? styling.sm.label
                            : styling.default.label
                    }
                >
                    {value ? value : '-'}
                </div>
            )}

            <img
                src="../../logos - iconos/Editar 1.png"
                alt=""
                className={
                    variant === 'sm'
                        ? styling.sm.editIcon
                        : styling.default.editIcon
                }
                onClick={() => handleEdit(!isEditing)}
            />
        </div>
    );
};

export default TextField;
