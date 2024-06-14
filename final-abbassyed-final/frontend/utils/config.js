let API_BASE_URL = '';

if (process.env.NODE_ENV === 'production') {
    API_BASE_URL = 'https://final-abbassyed-finalproject-deploy.onrender.com';
} else {
    API_BASE_URL = 'http://localhost:3003';
}

export {API_BASE_URL};