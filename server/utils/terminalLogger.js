import chalk from 'chalk';

// Terminal verification code display utility
export const displayVerificationCode = (type, email, code) => {
  const timestamp = new Date().toLocaleString();
  
  console.log('\n' + '='.repeat(80));
  console.log(chalk.bold.cyan('🔐 VERIFICATION CODE GENERATED'));
  console.log('='.repeat(80));
  console.log(chalk.yellow('Timestamp:'), chalk.white(timestamp));
  console.log(chalk.yellow('Type:'), chalk.white(type.toUpperCase()));
  console.log(chalk.yellow('Email:'), chalk.white(email));
  console.log(chalk.yellow('Code:'), chalk.bold.green(code));
  console.log('='.repeat(80));
  console.log(chalk.gray('This code will expire in 10 minutes'));
  console.log('='.repeat(80) + '\n');
};

// Admin login terminal display
export const displayAdminLogin = (email, code) => {
  console.log('\n' + '🔴'.repeat(25));
  console.log(chalk.bold.red('ADMIN LOGIN VERIFICATION'));
  console.log('🔴'.repeat(25));
  console.log(chalk.yellow('Admin Email:'), chalk.white(email));
  console.log(chalk.yellow('Verification Code:'), chalk.bold.green(code));
  console.log(chalk.red('⚠️  ADMIN ACCESS ONLY'));
  console.log('🔴'.repeat(25) + '\n');
};

// User signup terminal display
export const displayUserSignup = (email, code) => {
  console.log('\n' + '🟢'.repeat(25));
  console.log(chalk.bold.green('USER SIGNUP VERIFICATION'));
  console.log('🟢'.repeat(25));
  console.log(chalk.yellow('User Email:'), chalk.white(email));
  console.log(chalk.yellow('Verification Code:'), chalk.bold.green(code));
  console.log(chalk.green('✅ New User Registration'));
  console.log('🟢'.repeat(25) + '\n');
};

// General success message
export const displaySuccess = (message) => {
  console.log(chalk.bold.green('✅ ' + message));
};

// General error message
export const displayError = (message) => {
  console.log(chalk.bold.red('❌ ' + message));
};