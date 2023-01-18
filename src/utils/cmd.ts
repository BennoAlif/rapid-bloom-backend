import {spawn} from 'child_process';

function cmd(...command: string[]) {
  const p = spawn(command[0], command.slice(1));
  return new Promise(resolveFunc => {
    p.stdout.on('data', x => {
      resolveFunc(x.toString());
      process.stdout.write(x.toString());
    });
    p.stderr.on('data', x => {
      process.stderr.write(x.toString());
    });
    p.on('exit', code => {
      resolveFunc(code);
    });
  });
}

export default cmd;
