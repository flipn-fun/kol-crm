import { generateUrl } from "@/utils";
import request from "@/utils/request";
import { innerApiPrefix, PaginationResponse, WrapperResponse } from ".";
import dayjs from "@/utils/dayjs";
import Big from "big.js";

interface QuerySummaryResponse {
  address: string;
  created_at: string;
  id: number;
  invite_total: number;
  link_clicks: number;
  referral_fee: number;
  sol_amount: number;
  transactions: number;
  updated_at: string;
}

interface QueryReferralUsersResponse {
  address: string;
  created_at: string;
  id: number;
  referral_account: string;
  time: number;
  transactions: number;
  update_time: number;
  updated_at: string;
}

interface QueryRecentTransactionsResponse {
  address: string;
  created_at: string;
  icon: string;
  id: number;
  name: string;
  project_id: number;
  protocol_fee: number;
  proxy: string;
  proxy_fee: number;
  referral: string;
  referral_fee: string;
  sol_amount: number;
  time: number;
  token: string;
  token_amount: number;
  token_symbol: string;
  tx_hash: string;
  type: string;
  updated_at: string;
  price: string;
}

const SOL_DECIMALS = 9;
const TOKEN_DECIMALS = 6;
const MAX_LIMIT = 1000;

export const referralService = {
  async queryReferralLink() {
    const account = window.solanaWallet?.account;
    if (!account) return;

    const link = `${window.location.origin}/r/${account}`;

    return link;
  },
  async queryReferralCodes() {
    const { data } = await request<WrapperResponse<{ code: string,being_invited_account_id:string; }[]>>(
      innerApiPrefix("/airdrop/code")
    );
    return data;
  },
  async querySolPrice() {
    const { data } = await request<WrapperResponse<{ SolPrice: number }>>(
      innerApiPrefix("/config")
    );
    return data?.SolPrice;
  },
  async querySummary() {
    const { data } = await request<WrapperResponse<QuerySummaryResponse>>(
      innerApiPrefix("/referral/data")
    );
    if (data?.sol_amount) {
      data.sol_amount = data.sol_amount / 10 ** SOL_DECIMALS;
    }
    if (data?.referral_fee) {
      data.referral_fee = data.referral_fee / 10 ** SOL_DECIMALS;
    }
    return data;
  },
  async queryReferralUsers() {
    const { data } = await request<
      PaginationResponse<QueryReferralUsersResponse>
    >(generateUrl(innerApiPrefix("/referral/account"), { limit: MAX_LIMIT }));
    return data;
  },
  async queryRecentTransactions(offset: number = 0, limit: number = MAX_LIMIT) {
    const { data } = await request<
      PaginationResponse<QueryRecentTransactionsResponse>
    >(generateUrl(innerApiPrefix("/referral/trade"), { offset, limit }));
    if (data?.list) {
      data.list.forEach((item) => {
        if (item.sol_amount) {
          item.sol_amount = item.sol_amount / 10 ** SOL_DECIMALS;
        }
        if (item.token_amount) {
          item.token_amount = item.token_amount / 10 ** TOKEN_DECIMALS;
        }
        if (item.referral_fee) {
          item.referral_fee = new Big(item.referral_fee)
            .div(10 ** SOL_DECIMALS)
            .toFixed();
        }
        item.price = new Big(item.sol_amount)
          .div(item.token_amount)
          .toFixed(12);
      });
    }
    return data;
  },
  async queryTrend(type: "invited" | "transactions" | "volume") {
    const url = type === "invited" ? "invited/account" : type;
    const { data } = await request<
      WrapperResponse<
        {
          date: string;
          invite_count?: number;
          trade_count?: number;
          sol_amount?: number;
        }[]
      >
    >(generateUrl(innerApiPrefix(`/referral/trend/${url}`), { day: 7 }));
    const result = data?.map((item) => ({
      date: dayjs(item.date).format("MM-DD"),
      value:
        item.invite_count ??
        item.trade_count ??
        (item.sol_amount ?? 0) / 10 ** SOL_DECIMALS,
    }));

    if (!result?.length) {
      const res = Array.from({ length: 7 }, (_, index) => ({
        date: dayjs().subtract(index, "day").format("MM-DD"),
        value: 0,
      })).reverse();
      return res;
    }
    return result;
  },
};
