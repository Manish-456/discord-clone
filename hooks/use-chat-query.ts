import { useSocket } from '@/providers/socket-provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import qs from 'query-string';

interface ChatQueryProps {
    queryKey : string;
    apiUrl : string;
    paramKey : "channelId" | "conversationId";
    paramValue : string;
}

export const useChatQuery = ({
 queryKey,
 apiUrl,
 paramKey,
 paramValue
} : ChatQueryProps) => {
    const {isConnected} = useSocket();
    const fetchMessages = async ({pageParams = undefined}) => {
        const url = qs.stringifyUrl({
            url : apiUrl,
            query : {
                cursor : pageParams,
                [paramKey] : paramValue
            }
        }, {skipNull : true})

        const res = await fetch(url);
        return res.json();
    };

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery({
        queryKey : [queryKey],
        queryFn : ({ pageParam = 1}) => fetchMessages(pageParam),
        getNextPageParam : (lastPage) => lastPage?.nextCursor,
        refetchInterval : isConnected ? false : 1000
    })
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}