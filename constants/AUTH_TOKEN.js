const AUTH_TOKEN =
    typeof window !== 'undefined'
        ? localStorage.getItem('token')
            ? `Bearer ${localStorage.getItem('token')}`
            : ''
        : '';

export default AUTH_TOKEN;
