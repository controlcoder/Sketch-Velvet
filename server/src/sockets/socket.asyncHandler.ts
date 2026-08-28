import { socketErrorHandler } from "./socket.errorHandler";

type SocketCallback = (response: any) => void;

export function socketHandler(handler: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    const callback = args.pop();

    if (typeof callback !== "function") {
      console.error("Socket event requires an acknowledgement callback");
      return;
    }

    try {
      const result = await handler(...args);

      callback({
        success: true,
        data: result,
      });
    } catch (error) {
      callback(socketErrorHandler(error));
    }
  };
}
