import { CommandModule } from "yargs";

const module: CommandModule = {
  command: 'watch <entities>',
  aliases: 'w',
  describe: 'Watching for entry points and tree',
  builder: {
    root: {
      default: '.'
    },
    config: {
      default: '.socotrarc'
    }
  },
  handler: () => {
    console.log('aaa');
  }
};

export default module;
