"use client";

import { FC, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/Command";
import { useRouter } from "next/navigation";
import { LuUsers } from "react-icons/lu";
import debounce from "lodash.debounce";

const SearchBar: FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

  const {
    data: queryResults,
    refetch,
    isFetched,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!search) return [];
      const { data } = await axios.get(`/api/search?q=${search}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 500);

  const debouncedRequest = useCallback(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Command className="relative rounded-md border max-w-lg z-50 overflow-visible">
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities"
        value={search}
        onValueChange={(text) => {
          setSearch(text);
          debouncedRequest();
        }}
      />

      {search.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(subredditName) => {
                    router.push(`/r/${subredditName}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <LuUsers size={20} className="mr-2" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
