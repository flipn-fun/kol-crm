import { useAuthStore } from "@/stores/auth";

interface RequestOptions<T> extends RequestInit {
  body?: RequestInit["body"] | any;
  retryCount?: number;
  timeout?: number;
  cacheTimeout?: number;
  pollingInterval?: number;
  maxPollingAttempts?: number;
  shouldStopPolling?: (response: T) => boolean;
}

const cache = new Map<string, { timestamp: number; data: any }>();

const defaultCacheTimeout = 3000;

let isRefreshing = false;

export default async function request<T>(
  url: string,
  options?: RequestOptions<T>
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: useAuthStore.getState().token || undefined,
  };

  const cacheTimeout = options?.cacheTimeout || defaultCacheTimeout;

  const headers = JSON.parse(
    JSON.stringify({
      ...defaultHeaders,
      ...options?.headers,
    })
  );

  let body = options?.body;
  if (
    headers["Content-Type"] === "application/json" &&
    body &&
    typeof body !== "string"
  ) {
    body = JSON.stringify(body);
  }

  const method = options?.method || "GET";
  const cacheKey = method.toUpperCase() === "GET" ? url : null;

  if (cacheKey) {
    const cached = cache.get(cacheKey);
    const isCacheValid = cached && Date.now() - cached.timestamp < cacheTimeout;
    if (isCacheValid) {
      return Promise.resolve(cached.data as T);
    }
  }

  const newOptions: RequestInit = {
    ...options,
    headers,
    body,
    method,
  };

  const retryCount = options?.retryCount ?? 1;

  const controller = new AbortController();
  const timeout = options?.timeout || 20000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...newOptions,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const status = res.status;
    if (status === 401) {
      useAuthStore.getState().setToken(undefined);
      if (!isRefreshing && typeof window !== "undefined") {
        alert("Authentication expired, please login again");
        isRefreshing = true;
        window.location.reload();
      }
      throw new Error("Unauthorized");
    }

    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();

    if (options?.shouldStopPolling) {
      if (options.shouldStopPolling(data)) {
        return data as T;
      }
      throw new Error("Polling should continue");
    }

    if (cacheKey) {
      cache.set(cacheKey, { timestamp: Date.now(), data });
      setTimeout(() => {
        cache.delete(cacheKey);
      }, cacheTimeout);
    }

    return data as T;
  } catch (err: any) {
    console.log(err.message);
    if (err.message === "Unauthorized") {
      throw err;
    }
    if (retryCount > 0) {
      console.log(`Retrying... attempts left: ${retryCount}`);
      return request(url, { ...options, retryCount: retryCount - 1 });
    } else if (options?.pollingInterval && options?.maxPollingAttempts) {
      if (options.maxPollingAttempts > 0) {
        console.log(`Polling... attempts left: ${options.maxPollingAttempts}`);
        await new Promise((resolve) =>
          setTimeout(resolve, options.pollingInterval)
        );
        return request(url, {
          ...options,
          maxPollingAttempts: options.maxPollingAttempts - 1,
          retryCount: retryCount,
        });
      }
    }
    throw err;
  }
}
