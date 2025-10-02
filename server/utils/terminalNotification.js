// Terminal notification utilities for verification codes
import chalk from 'chalk';

// Display admin verification code in terminal
export const displayAdminVerificationCode = (email, code) => {
  const timestamp = new Date().toLocaleString();
  const border = '═'.repeat(60);
  
  console.log('\n' + chalk.cyan(border));
  console.log(chalk.yellow.bold('🔐 ADMIN VERIFICATION CODE'));
  console.log(chalk.cyan(border));
  console.log(chalk.white(`📧 Email: ${chalk.green(email)}`));
  console.log(chalk.white(`🔑 Code:  ${chalk.red.bold(code)}`));
  console.log(chalk.white(`⏰ Time:  ${chalk.blue(timestamp)}`));
  console.log(chalk.white(`⏳ Valid for: ${chalk.yellow('10 minutes')}`));
  console.log(chalk.cyan(border));
  console.log(chalk.gray('Enter this code in the verification step\n'));
};

// Display signup verification code in terminal
export const displaySignupVerificationCode = (email, code) => {
  const timestamp = new Date().toLocaleString();
  const border = '═'.repeat(60);
  
  console.log('\n' + chalk.green(border));
  console.log(chalk.blue.bold('📝 SIGNUP VERIFICATION CODE'));
  console.log(chalk.green(border));
  console.log(chalk.white(`📧 Email: ${chalk.cyan(email)}`));
  console.log(chalk.white(`🔑 Code:  ${chalk.magenta.bold(code)}`));
  console.log(chalk.white(`⏰ Time:  ${chalk.blue(timestamp)}`));
  console.log(chalk.white(`⏳ Valid for: ${chalk.yellow('10 minutes')}`));
  console.log(chalk.green(border));
  console.log(chalk.gray('Enter this code to complete registration\n'));
};

// Display signin verification code in terminal
export const displaySigninVerificationCode = (email, code) => {
  const timestamp = new Date().toLocaleString();
  const border = '═'.repeat(60);
  
  console.log('\n' + chalk.blue(border));
  console.log(chalk.green.bold('🔓 SIGNIN VERIFICATION CODE'));
  console.log(chalk.blue(border));
  console.log(chalk.white(`📧 Email: ${chalk.cyan(email)}`));
  console.log(chalk.white(`🔑 Code:  ${chalk.red.bold(code)}`));
  console.log(chalk.white(`⏰ Time:  ${chalk.blue(timestamp)}`));
  console.log(chalk.white(`⏳ Valid for: ${chalk.yellow('10 minutes')}`));
  console.log(chalk.blue(border));
  console.log(chalk.gray('Enter this code to complete sign in\n'));
};

// Display general notification in terminal
export const displayTerminalNotification = (title, message, type = 'info') => {
  const timestamp = new Date().toLocaleString();
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
  };
  
  const color = colors[type] || chalk.blue;
  const border = '─'.repeat(50);
  
  console.log('\n' + color(border));
  console.log(color.bold(`${title}`));
  console.log(color(border));
  console.log(chalk.white(message));
  console.log(chalk.gray(`Time: ${timestamp}`));
  console.log(color(border) + '\n');
};