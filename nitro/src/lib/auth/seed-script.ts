import { seedDatabase } from './seed';

// Ejecutar la siembra de datos cuando se invoque este script
seedDatabase()
  .then(() => {
    console.log('\n🚀 Siembra de datos iniciales completada exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error durante la siembra de datos:', error);
    process.exit(1);
  });
