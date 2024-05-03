import axios from "axios";
import { useState } from "react";

export default function Room() {
  const [roomId, setRoomId] = useState<string>();

  // 채팅방 생성 api
  async function creatChatroom() {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/chat/rooms",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoomId(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("에러 메시지:", error.response?.data?.errorMessage);
      } else {
        console.error(error);
      }
    }
  }

  return <>채팅방 생성</>;
}
