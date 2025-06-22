import 'dotenv/config'; // load before anything else
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Blackjack server running at http://localhost:${PORT}`);
});
