"use server";

import { getToken } from "./get-token";
import { config } from "@/config/env-config";

const getProfile = async () => {
  const token = await getToken();

  const res = await fetch(`${config.baseURL}/user/me`, {
    next: {
      tags: ["user-profile"],
    },
    headers: {
      Authorization: `Bearer ${token}`,
      accessToken: token || "",
      "Content-Type": "application/json",
    },
  });
  const data = await res?.json();
  return data?.data || data;
};

export default getProfile;
