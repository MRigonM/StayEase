import api from "./AxiosInstance";
import { getAccessToken } from "./TokenService";
import { jwtDecode } from "jwt-decode";

const CLAIM_KEYS = [
    "nameid",
    "sub",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    "uid",
    "userId",
    "userid",
];

export function getUserIdFromToken() {
    let token = getAccessToken();
    if (!token) return null;

    if (token.startsWith("Bearer ")) token = token.slice(7);

    try {
        const decoded = jwtDecode(token);
        for (const k of CLAIM_KEYS) {
            if (decoded?.[k]) return decoded[k];
        }
    } catch (e) {
        console.error("JWT decode failed:", e);
    }
    return null;
}

export function getUserNameFromToken() {
    let token = getAccessToken();
    if (!token) return null;

    if (token.startsWith("Bearer ")) token = token.slice(7);

    try {
        const decoded = jwtDecode(token);
        return (
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            decoded["unique_name"] ||
            decoded["name"] ||
            null
        );
    } catch (e) {
        console.error("JWT decode failed:", e);
        return null;
    }
}

async function tryGet(path) {
    try {
        const res = await api.get(path);
        if (res?.data?.isSuccess && res?.data?.data) return res.data.data;
        return null;
    } catch (err) {
        if (err?.response?.status === 404) return null;
        console.error("Get user failed:", err?.response?.data || err.message);
        throw err;
    }
}

export async function getUserById(Id) {
    const candidates = [
        `/Users/GetUserById/${Id}`
    ];
    for (const path of candidates) {
        const user = await tryGet(path);
        if (user) return user;
    }
    return null;
}

export async function getCurrentUserName() {
    const id = getUserIdFromToken();
    if (!id) return getUserNameFromToken(); // fallback

    const user = await getUserById(id);
    if (user) {
        return user.username || user.fullName || getUserNameFromToken();
    }

    return getUserNameFromToken();
}
