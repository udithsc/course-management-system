import cors from 'cors';

export default (app: any) => {
  const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = [
    ...configuredOrigins,
    'http://127.0.0.1:3000',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ];

  const isAllowedOrigin = (origin: string) => allowedOrigins.includes(origin);

  app.use(
    cors({
      origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Required for httpOnly cookies later
    }),
  );
};
