const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://gadget-store-sigma.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin']
};

module.exports = corsOptions;