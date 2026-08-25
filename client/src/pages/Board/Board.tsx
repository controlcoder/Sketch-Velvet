import Canvas from "../../components/Canvas/Canvas";
import { useEffect } from "react";
import { socket } from "../../api/socket";
import { useParams } from "react-router-dom";

export default function Board() {
  const { id: boardId } = useParams();

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("Connected:", socket.id);
      socket.emit("join:board", { boardId });
    };
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Canvas boardId={boardId} />
    </>
  );
}
