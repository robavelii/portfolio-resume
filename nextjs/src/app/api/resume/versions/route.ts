import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const versions = await prisma.resumeVersion.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        isActive: true,
        comment: true
      }
    });
    
    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load versions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { versionId } = await request.json();
    
    // Deactivate all versions
    await prisma.resumeVersion.updateMany({
      data: { isActive: false }
    });
    
    // Activate selected version
    const version = await prisma.resumeVersion.update({
      where: { id: versionId },
      data: { isActive: true }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to revert version" }, { status: 500 });
  }
}