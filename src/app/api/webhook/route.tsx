import { WorkflowRunWebhookBody$inboundSchema as WebhookParser } from "comfydeploy/models/components";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parseData = WebhookParser.safeParse(await request.json());

  if (!parseData.success) {
    return NextResponse.json({ message: "error" }, { status: 400 });
  }

  const data = parseData.data;

  const { status, runId, outputs } = data;

  // Do your things
  console.log(status, runId, outputs);

  // Return success to ComfyDeploy
  return NextResponse.json({ message: "success" }, { status: 200 });
}
