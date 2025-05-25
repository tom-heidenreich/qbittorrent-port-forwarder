import { sleep } from "bun";
import type { QBitConnection } from "../utils/qbit";

export default abstract class Provider {
  private running: boolean = false;

  /**
   * Constructor of Provider
   * @param qbit The QBitConnection used for the API.
   * @param interval The interval the execute function is called while running in ms.
   */
  public constructor(
    protected readonly qbit: QBitConnection,
    protected readonly interval: number
  ) {}

  /**
   * Get the running state of the providier
   * @returns true if running, false if not
   */
  protected isRunning() {
    return this.running;
  }

  /**
   * Starts the provider.
   * Sets the running state to true and calls run.
   */
  public start() {
    this.running = true;
    this.run();
  }

  /**
   * Stops the provider.
   * Sets the running state to false.
   */
  public stop() {
    this.running = false;
  }

  /**
   * Calls execute repeatedly in the interval specified in the super constructor.
   */
  private async run() {
    // error interval is 20s or 70% of the execute interval if it is lower than 20s
    const errorInterval = this.interval >= 20000 ? 20000 : this.interval * 0.7;

    while (this.running) {
      try {
        this.execute();
        await sleep(this.interval);
      } catch (e) {
        console.log(
          `Encounter error: ${e}. Retrying in ${Math.floor(
            errorInterval / 1000
          )} seconds...`
        );
        await sleep(errorInterval);
      }
    }
  }

  /**
   * The execution function of the provider. It is called repeatedly while running in the interval specified in the super constructor.
   */
  protected abstract execute(): any;
}
