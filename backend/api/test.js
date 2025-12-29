export default function handler(req, res) {
  try {
    res.status(200).json({ 
      message: "API is working",
      method: req.method,
      url: req.url,
      env: {
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}