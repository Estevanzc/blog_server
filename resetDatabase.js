const { execSync } = require('child_process');

function run(command) {
  console.log(`\n▶ Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

try {
  run('npx sequelize-cli db:migrate:undo:all');
  run('npx sequelize-cli db:migrate');
  run('npx sequelize-cli db:seed:all');

  console.log('\n✅ Database reset completed successfully');
} catch (error) {
  console.error('\n❌ Error while resetting database');
  process.exit(1);
}
