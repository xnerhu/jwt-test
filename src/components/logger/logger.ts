export abstract class Logger {
  public abstract info(...args: any[]): void;

  public abstract warn(...args: any[]): void;

  public abstract error(...args: any[]): void;

  public abstract flush(): Promise<void>;
}
