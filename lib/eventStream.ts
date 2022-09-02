import { IncomingMessage, ServerResponse } from "http";
import { Writable } from "stream";
import { TypedEmitter } from "tiny-typed-emitter";
import EventEmitter from "events";

interface Payload {
  data: string;
  event?: string;
  id?: string | number;
}

interface EventStreamEvents {
  data: (payload: Payload) => void;
}

export class EventStream extends Writable {
  private readonly emitter: TypedEmitter<EventStreamEvents>;
  private readonly filter: (packet: string) => boolean;

  constructor(filter: (packet: string) => boolean = () => false) {
    super();
    this.filter = filter;
    this.emitter = new EventEmitter() as TypedEmitter<EventStreamEvents>;
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    return new Promise((resolve) => {
      let id = 0;
      this.setHeaders(req, res);

      this.emitter.setMaxListeners(this.emitter.getMaxListeners() + 2);

      const dataListener = (payload: Payload) => {
        if (this.filter(payload.data)) return;
        if (payload.id) {
          res.write(`id: ${payload.id}\n`);
        } else {
          res.write(`id: ${id}\n`);
          id += 1;
        }
        if (payload.event) {
          res.write(`event: ${payload.event}\n`);
        }
        res.write(`data: ${payload.data}\n\n`);
        // @ts-ignore
        res.flush();
      };

      this.emitter.on("data", dataListener);

      req.on("close", () => {
        this.emitter.removeListener("data", dataListener);
        this.emitter.setMaxListeners(this.emitter.getMaxListeners() - 2);
        resolve();
      });
    });
  }

  send(data: any, event?: string, id?: string | number) {
    if (typeof data !== "string") data = JSON.stringify(data);
    this.emitter.emit("data", { data, id, event });
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.send(chunk.toString());
    process.nextTick(callback);
  }

  private setHeaders(req: IncomingMessage, res: ServerResponse) {
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    if (req.httpVersion !== "2.0") {
      res.setHeader("Connection", "keep-alive");
    }
    res.flushHeaders();
  }
}
