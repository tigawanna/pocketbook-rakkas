import { parseEnv } from "znv";
import { z } from "zod";
import { Schema } from "./pb/db-types";

const collections: keyof Schema = "pocketbook_user"
export const { PB_URL,PB_AUTH_COLLECTION } = parseEnv(process.env, {
    PB_URL: z.string().min(1),
    PB_AUTH_COLLECTION: z.enum([collections])
});



export const pb_url = import.meta.env.RAKKAS_PB_URL
export const pb_auth_collection = import.meta.env.RAKKAS_PB_AUTH_COLLECTION
