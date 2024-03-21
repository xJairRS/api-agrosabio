const allowedOrigins = ['http://localhost:4200'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por el CORS'));
    }
  }
};

module.exports = corsOptions;