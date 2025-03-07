import { generateUrl } from "@/utils";
import { innerApiPrefix, request, WrapperResponse } from ".";
import { useAuthStore } from "@/stores/auth";

export const authService = {
  async auth() {
    if (!window.solanaWallet) return;
    const token = useAuthStore.getState().token;
    if (token) return token;
    console.log("authenticating...");
    try {
      const time = Date.now();
      const msg = `login FlipN,time:${time}`;
      const encodeMsg = new TextEncoder().encode(msg);
      const signature = await window.solanaWallet.signMessage!(encodeMsg);
      const signatureBase64 = await bufferToBase64(signature);
      const { data } = await request<WrapperResponse<string>>(
        generateUrl(innerApiPrefix("/account/token"), {
          address: window.solanaWallet.account,
          signature: signatureBase64,
          time,
        })
      );
      useAuthStore.getState().setToken(data);
      return data;
    } catch (error) {
      console.error(error);
      useAuthStore.getState().setToken(undefined);
      return;
    } 
  },
};

async function bufferToBase64(buffer: Uint8Array) {
  const base64url: any = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([buffer]));
  });
  return base64url.slice(base64url.indexOf(",") + 1);
}
