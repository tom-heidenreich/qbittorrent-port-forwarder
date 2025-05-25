import { $ } from "bun";
import Provider from ".";
import { type QBitConnection } from "../utils/qbit";

export default class Gluetun extends Provider {
  public constructor(qbit: QBitConnection, interval?: number) {
    super(qbit, interval || 45000);
  }

  protected async execute() {}
}
