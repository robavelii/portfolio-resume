import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

const RESUME_PATH = path.join(process.cwd(), "src/data/resume.json");

export async function GET() {
  try {
    // Try to get active version from database first
    const activeVersion = await prisma.resumeVersion.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (activeVersion) {
      return NextResponse.json(JSON.parse(activeVersion.data));
    }
    
    // Fallback to original file system data
    const data = await fs.readFile(RESUME_PATH, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: resumeData, comment } = await request.json();
    
    // Deactivate current active version
    await prisma.resumeVersion.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    
    // Create new version (don't update original file)
    const newVersion = await prisma.resumeVersion.create({
      data: {
        data: JSON.stringify(resumeData),
        isActive: true,
        comment: comment || `Updated at ${new Date().toISOString()}`
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}