import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";

export type HiddenContentPayload = {
  algorithm: "aes-256-gcm";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};

const ITERATIONS = 120_000;
const KEY_LENGTH = 32;

const normalizeUnlockCode = (code: string) => code.trim().toLowerCase();

export const encryptHiddenContent = (html: string, unlockCode: string): HiddenContentPayload => {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(normalizeUnlockCode(unlockCode), salt, ITERATIONS, KEY_LENGTH, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(html, "utf8"), cipher.final(), cipher.getAuthTag()]);

  return {
    algorithm: "aes-256-gcm",
    iterations: ITERATIONS,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ciphertext: encrypted.toString("base64")
  };
};
