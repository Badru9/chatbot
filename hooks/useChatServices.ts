import { QUERY_KEYS } from "@/constants";
import { sendAisnetChatMessage } from "@/services/aisnetChatService";
import {
  deleteSession,
  fetchSession,
  fetchSessions,
  saveSessionMessages,
  syncLocalSessions,
  type SessionMessage,
  type SessionSummary,
} from "@/services/sessionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChatServices = () => {
  const queryClient = useQueryClient();

  const invalidateSessions = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
  };

  const sendAisnetMessage = useMutation({
    mutationFn: sendAisnetChatMessage,
  });

  const sessionsQuery = useQuery<SessionSummary[]>({
    queryKey: QUERY_KEYS.sessions,
    queryFn: fetchSessions,
  });

  const saveSessionMutation = useMutation({
    mutationFn: ({
      id,
      title,
      messages,
      appendMessages,
    }: {
      id: string;
      title?: string;
      messages?: SessionMessage[];
      appendMessages?: SessionMessage[];
    }) => saveSessionMessages(id, { title, messages, appendMessages }),
    onSuccess: () => invalidateSessions(),
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => invalidateSessions(),
  });

  const syncLocalSessionsMutation = useMutation({
    mutationFn: syncLocalSessions,
    onSuccess: () => invalidateSessions(),
  });

  return {
    sendAisnetMessage,
    sessionsQuery,
    saveSessionMutation,
    deleteSessionMutation,
    syncLocalSessionsMutation,
    fetchSessionDetail: fetchSession,
  };
};
