import app from './index';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`Servidor escuchando en puerto ${config.port}`);
});
