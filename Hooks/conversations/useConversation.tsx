import {
  CreateConversations,
  DeleteMessages,
  GetConversationsById,
  UpdateConversationsState,
} from '@Apis/conversations.api';
import { MessagesNotifications } from '@Class/Notifications/MessagesNotifications';
import { CONVERSATIONS } from '@Constant/Conversations';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments';
import { ConverSations, ConversationsData, ConversationState, TypeConversation } from '@Types/Conversations';
import {
  DeletedMessages,
  GotConversations,
  UpdatedConversationsState,
} from '@Types/Conversations/conversations.api.type';
import { PaginationI } from '@Types/pagination.type';
import { queryClient } from 'pages/_app';
import { useMemo, useState } from 'react';

export function useConversation({ _idConversations, from }: GotConversations & { from: string }) {
  const { data, ...props } = useQuery<ConversationsData>({
    queryKey: [CONVERSATIONS, _idConversations],
    queryFn: async () => {
      const res = await GetConversationsById({ _idConversations, limit: 15, offset: 0 });
      const oldData = queryClient.getQueryData<ConversationsData>([CONVERSATIONS, _idConversations]);
      if (oldData) {
        return {
          conversations: [...(res.payload ?? []), ...oldData.conversations],
          type: 'straight',
          isFetching: false,
        };
      }
      return { conversations: res.payload ?? [], type: 'straight', isFetching: false };
    },
    enabled: _idConversations ? true : false,
    refetchOnMount: false,
  });
  const conversationsPending = useQuery<Map<string, string>>({
    queryKey: ['Pending', _idConversations],
    queryFn: () => {
      return new Map();
    },
  });
  const [isReload, setIsReload] = useState(false);

  const GetConversationsMutation = useMutation<FetchResponse<ConverSations[]>, unknown, PaginationI>({
    mutationFn: (props) => {
      return GetConversationsById({ _idConversations, ...props });
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      queryClient.setQueryData<ConversationsData>(
        [CONVERSATIONS, _idConversations],
        (prev = { conversations: [], isFetching: false, type: 'reverse' }) => ({
          ...prev,
          type: 'reverse',
          conversations: [...(res?.payload || []), ...prev.conversations],
          isFetching: false,
          isFull: !res.payload?.length ? true : false,
        })
      );
    },
  });

  const isFetchingMemo = useMemo(
    () => props.isFetching || GetConversationsMutation.isLoading,
    [props.isFetching, GetConversationsMutation.isLoading]
  );

  const AddConversationsMutation = useMutation<
    FetchResponse<{ conversation: ConverSations } & { toUID: string }>,
    unknown,
    { props: ConverSations; toUID: string }
  >({
    mutationFn: ({ props, toUID }) => {
      queryClient.setQueryData<ConversationsData>(
        [CONVERSATIONS, _idConversations],
        (prev = { conversations: [], type: 'straight', isFetching: false }) => {
          return {
            ...prev,
            type: 'straight',
            conversations: [...prev.conversations, props],
          };
        }
      );
      return CreateConversations(props, { toUID });
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      if (res.payload?.conversation && conversationsPending.data) {
        conversationsPending.data.delete(res.payload.conversation._textId);
        setIsReload((prev) => !prev);
        const instance = MessagesNotifications.getInstance();
        const { conversation } = res.payload;

        instance.create({
          toUID: res.payload.toUID,
          ...conversation,
        });
      }
    },
  });

  const UpdateConversationsStateMutation = useMutation<
    FetchResponse<unknown>,
    unknown,
    UpdatedConversationsState
  >({
    mutationFn: (props) => {
      queryClient.setQueryData<ConversationsData>(
        [CONVERSATIONS, _idConversations],
        (prev = { conversations: [], type: 'reverse', isFetching: false }) => {
          const messages = prev?.conversations?.map((message) => {
            if (message._state == ConversationState.Received) {
              message._state = ConversationState.Read;
            }
            return message;
          });
          return { ...prev, conversations: messages };
        }
      );
      return UpdateConversationsState(props);
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        throw new Error(res.message);
      }
    },
  });

  const DeleteMessageMutations = useMutation<FetchResponse<DeletedMessages>, unknown, DeletedMessages>({
    mutationFn: (props) => {
      return DeleteMessages(props);
    },
    onSettled: (res) => {
      if (conversationsPending.data && res?.payload) {
        conversationsPending.data.delete(res.payload._textId);
        // setIsReload((prev) => !prev);
        queryClient.setQueryData<ConversationsData>(
          [CONVERSATIONS, res?.payload._idConversations],
          (prev = { conversations: [], isFetching: false, type: 'straight' }) => {
            const newConversations = prev.conversations.map((message) => {
              if (message._textId === res.payload?._textId) {
                message._type = TypeConversation.Delete;
                message._content = '';
              }
              return message;
            });
            return { ...prev, conversations: newConversations };
          }
        );
      }
    },
  });

  const handleAddConversations = (props: ConverSations, { toUID }: { toUID: string }) => {
    if (conversationsPending.data) {
      conversationsPending.data.set(props._textId, 'pending');
    }
    AddConversationsMutation.mutate({ props, toUID });
  };
  const handleGetConversations = (props: PaginationI) => {
    GetConversationsMutation.mutate(props);
  };
  const handleDeleteMessages = (props: DeletedMessages) => {
    if (conversationsPending.data) {
      conversationsPending.data.set(props._textId, 'pending');
    }

    queryClient.setQueryData<ConversationsData>([CONVERSATIONS, props._idConversations], (prev) => {
      return prev;
    });

    DeleteMessageMutations.mutate(props);
  };
  const handleCreateGroupConversations = () => {};
  const handleUpdateConversationsState = (props: UpdatedConversationsState) => {
    UpdateConversationsStateMutation.mutateAsync(props);
  };

  return {
    data,
    ...props,
    handleAddConversations,
    handleUpdateConversationsState,
    handleGetConversations,
    handleDeleteMessages,
    conversationsPending,
    isFetchingMemo,
  };
}
