import { authOptions } from "@/lib/auth_Options";
import { connectToDatabase } from "@/lib/DB";
import Video, { IVideo } from "@/Models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).lean();
    return NextResponse.json(videos || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    
    await connectToDatabase();
    const body: IVideo = await req.json();

    if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
      return NextResponse.json({ error: "Missing required Fields" }, { status: 400 });
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post Video ;(" }, { status: 500 });
  }
}
