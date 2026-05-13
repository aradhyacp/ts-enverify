export class EnverifyError extends Error {
  readonly failures: string[];

  constructor(failures: string[]) {
    const message = [
      "\n✗ ts-enverify validation failed:\n",
      ...failures.map((f) => `  → ${f}`),
      "\nFix the above environment variables before starting the app.\n",
    ].join("\n");

    super(message);
    this.name = "EnverifyError";
    this.failures = failures;
    this.stack = undefined;

    Object.setPrototypeOf(this, EnverifyError.prototype);
  }
}
