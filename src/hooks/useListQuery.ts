import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface UseListQueryOptions {
  endpoint: string;
  initialParams?: Record<string, any>;
  debounceMs?: number;
  skip?: boolean;
}

export function useListQuery<T>({
  endpoint,
  initialParams = {},
  debounceMs = 400,
  skip = false,
}: UseListQueryOptions) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = Number(initialParams.limit || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [customFilters, setCustomFilters] = useState<Record<string, any>>({});

  const initialParamsString = JSON.stringify(initialParams);
  const filters: Record<string, any> = useMemo(() => {
    const rest = JSON.parse(initialParamsString);
    delete rest.limit;
    return { ...rest, ...customFilters };
  }, [initialParamsString, customFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const requestCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (skip) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const currentRequestId = ++requestCountRef.current;
    setIsLoading(true);
    try {
      const queryParams: Record<string, any> = {
        page,
        limit,
        ...filters,
      };

      if (debouncedSearch.trim()) {
        queryParams.searchTerm = debouncedSearch.trim();
      }

      const res = await api.get(endpoint, queryParams);

      if (currentRequestId !== requestCountRef.current) {
        return;
      }

      if (res?.data) {
        let list: T[] = [];
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (res.data.users && Array.isArray(res.data.users)) {
          list = res.data.users;
        } else if (res.data.cases && Array.isArray(res.data.cases)) {
          list = res.data.cases;
        } else if (res.data.result && Array.isArray(res.data.result)) {
          list = res.data.result;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          list = res.data.data;
        }
        setData(list);

        const meta: any = res.meta || res.pagination || res.data?.meta || {};
        const total = meta.total || list.length;
        const pages = meta.totalPage || meta.totalPages || (limit > 0 ? Math.ceil(total / limit) : 1);
        setTotalPages(pages);
        setTotalItems(total);
      } else {
        setData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error(`Error loading data from ${endpoint}:`, error);
    } finally {
      if (currentRequestId === requestCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [endpoint, page, limit, debouncedSearch, filters, skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    const cleanedFilters: Record<string, any> = {};
    Object.keys(newFilters).forEach((key) => {
      const val = newFilters[key];
      if (val !== undefined && val !== null && val !== "") {
        cleanedFilters[key] = val;
      }
    });
    setCustomFilters(cleanedFilters);
    setPage(1);
  }, []);

  return {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalItems,
    filters,
    setFilters: updateFilters,
    refresh: fetchData,
  };
}
