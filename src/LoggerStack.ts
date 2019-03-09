import debug from 'debug';
import { reduce, upperCase } from 'lodash';

type ILOG_LEVELS = 'info' | 'warn' | 'error' | 'debug';
interface ILoggerStack {
  scope: string;
  _loggers: Array<(msg) => void>;
  symbols: Map<Symbol, Function>;
  (logger: ILOG_LEVELS): Symbol;
}

/* @

/**
 * @example
 * ```js
 * const log = new LoggingStack('your-scope', ['debug', 'info', 'warn', 'error']);
 * log(log.INFO, 'your message text here!');
 * ```
 */
class LoggerStack implements ILoggerStack {

  static LOG_LEVELS = ['info', 'warn', 'error', 'debug'];
  _loggers = [];
  symbols = new Map();
  scope = 'DEBUG';


  constructor(scope, logLevels = LoggerStack.LOG_LEVELS) {
    this.scope = scope;
    this.buildLoggers(logLevels);
  }

  buildLoggers(levels) {
    Object.assign(this, reduce(levels, this.accumulateLoggers, {}));
  }

  accumulateLoggers(acc, level) {
    const upCasedLevel = upperCase(level);
    const token = this.addAccessToken(upCasedLevel);
    acc[token] = this.addLogger( token,`${this.scope}:${upCasedLevel}`);
    return acc;
  }

  send(levelToken, message) {
    return this._loggers[levelToken](message);
  }

  addAccessToken(tokenName) {
    const token = Symbol(tokenName);
    this.symbols[tokenName] = token;
    this[tokenName] = token;
    return this[tokenName];
  }

  addLogger(token, logScope) {
    this._loggers[token] = debug(logScope);
  }
}

export default LoggerStack;

