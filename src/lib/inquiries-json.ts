import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  option: string;
  message: string | null;
  createdAt: string;
};

const DATA_FILE = process.env.INQUIRIES_FILE
  ? path.resolve(process.env.INQUIRIES_FILE)
  : path.join(process.cwd(), "data", "inquiries.json");

let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function readInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Inquiry[]) : [];
  } catch {
    return [];
  }
}

export async function appendInquiry(
  input: Omit<Inquiry, "id" | "createdAt">
): Promise<Inquiry> {
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    option: input.option,
    message: input.message ?? null,
    createdAt: new Date().toISOString(),
  };

  await serialize(async () => {
    const inquiries = await readInquiries();
    inquiries.push(inquiry);

    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(inquiries, null, 2), "utf8");
    await fs.rename(tmp, DATA_FILE);
  });

  return inquiry;
}
