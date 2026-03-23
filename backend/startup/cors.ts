import cors from 'cors';

export default (app: any) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Required for httpOnly cookies later
    }),
  );
};
