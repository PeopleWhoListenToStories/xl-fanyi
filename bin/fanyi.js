#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const Printer = require('@darkobits/lolcatjs');
const pkg = require('../package.json');
// const config = require('../lib/config');
const { youDaoTranslator, Languages } = require('../lib/index.js')
// const { searchList } = require('../lib/searchHistory');

updateNotifier({ pkg }).notify();

const isBoolean = option => Object.prototype.toString.call(option) === '[object Boolean]'

const resolveOptions = (options) => {
  const opts = {}
  Object.keys(options)
    .filter(key => isBoolean(options[key]) || typeof options[key] === 'string')
    .map(key => opts[key] = options[key]);
  return opts;
}

const runFY = async (options = {}) => {
  // const defaultOptions = await config.load();
  // const mergedOptions = {...defaultOptions, ...options}
  // fanyi(, mergedOptions)
  const query = program.args.join(' ')
  const result = await youDaoTranslator({ text: query || '', from: Languages.EN, to: Languages.ZH })
  console.log(`\n  ${chalk.cyanBright.underline('在线翻译  𝑜𝑛𝑙𝑖𝑛𝑒 𝑓𝑎𝑛𝑦𝑖 - 𝑥𝑢𝑙𝑎𝑖')}   \n${Printer.default.fromString(`\n ${result}`)}`)
}

program
  .version(pkg.version)
  .option('-s, --say', 'Turn on the pronunciation')
  .option('-S, --no-say', 'Turn off the pronunciation')
  .action(args => {
    // If the input is "fanyi", no parameters, ignore.
    if (process.argv.length > 2) {
      const { say } = args;
      const options = resolveOptions({ say });
      return runFY(options);
    }
  });

program
  .command('config')
  .description('Set the global options')
  .option('-c, --color', 'Output with color')
  .option('-C, --no-color', 'Output without color')
  .option('-i, --iciba', 'Enable the iciba translation engine')
  .option('-I, --no-iciba', 'Disable the iciba translation engine')
  .option('-y, --youdao', 'Enable the youdao translation engine')
  .option('-Y, --no-youdao', 'Disable the youdao translation engine')
  .option('-d, --dictionaryapi', 'Enable the dictionary translation engine')
  .option('-D, --no-dictionaryapi', 'Disable the dictionary translation engine')
  .option('-s, --say', 'Turn on the pronunciation')
  .option('-S, --no-say', 'Turn off the pronunciation')
  .option('-o, --openai-api-key <apikey>', 'set openai api key')
  .option('-host, --openai-api-host <apiHost>', 'set openai api host')
  .action(args => {
    // hack
    // If the input is "fanyi config", then translate the word config.
    if (process.argv.length === 3) {
      return runFY();
    }
    const { color, iciba, youdao, dictionaryapi, openaiApiKey, openaiApiHost } = args;
    const { say } = program.opts();
    const options = resolveOptions({ color, iciba, youdao, dictionaryapi, say, openaiApiKey, openaiApiHost });
    console.log('options...', options)
    return config.write(options);
  });

// program
//   .command('list')
//   .option('-d, --someDay <char>', '查看指定某天的查询记录')
//   .option('-r, --recentDays [number]', '查看最近几天内的数据', 0)
//   .option('-all --show-file [boolean]', '查看全部数据，即单词存放的位置', false)
//   .action(args => {
//     searchList(args);
//   });

program.on('--help', function () {
  console.log('');
  console.log(chalk.gray('Examples:'));
  console.log(chalk.cyan('  $ ') + 'fanyi word');
  console.log(chalk.cyan('  $ ') + 'fanyi world peace');
  console.log(chalk.cyan('  $ ') + 'fanyi chinglish');
  console.log('');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
