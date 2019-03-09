import { CommandModule } from "yargs";

const module: CommandModule = {
  command: 'build <entities>',
  aliases: 'b',
  describe: 'Compile',
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
