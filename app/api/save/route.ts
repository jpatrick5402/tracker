import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  // filter body into database

  return NextResponse.json(
    { message: "User information updated" },
    { status: 200 }
  );
});
