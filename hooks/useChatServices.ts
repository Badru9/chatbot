import { sendAisnetChatMessage } from "@/services/aisnetChatService";
import { useMutation } from "@tanstack/react-query";

export const useChatServices = () => {
  const sendAisnetMessage = useMutation({
    mutationFn: sendAisnetChatMessage,
  });

  return { sendAisnetMessage };
};
