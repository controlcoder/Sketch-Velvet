import Canvas from "../../components/Canvas/Canvas";
import { useEffect } from "react";
import { socket } from "../../config/socket";
import { useParams } from "react-router-dom";

export default function Board() {
  const { id: boardId } = useParams();

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join:board", { boardId }, (response: any) => {
        if (!response.success) {
          console.error("Failed to join board:", response.message);
          return;
        }

        // console.log("Successfully joined board");
        // console.log("Role:", response);
      });
    };
    // const handleConnectError = (error: Error) => {
    //   console.error("Socket connection error:", error.message);
    // };
    socket.on("connect", handleConnect);
    // socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      // socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [boardId]);

  return (
    <>
      <Canvas boardId={boardId} />
    </>
  );
}
