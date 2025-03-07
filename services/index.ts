export { default as request } from "@/utils/request";

export interface WrapperResponse<T> {
  code: number;
  data?: T;
  message?: string;
}

export type PaginationResponse<T> = WrapperResponse<
  { list?: T[]; has_next_page: boolean } | undefined
>;

export const innerApiPrefix = (url: string) => {
  const host =
    process.env.NODE_ENV === "development"
      ? location.origin
      : process.env.NEXT_PUBLIC_API_URL;
  return host + "/api/v1" + url;
};
