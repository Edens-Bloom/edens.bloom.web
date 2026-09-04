import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "design-requests",
          resource_type: "auto",
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          if (!uploadResult?.secure_url) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve(uploadResult as { secure_url: string });
        },
      );

      uploadStream.end(buffer);
    },
  );

  return result.secure_url;
};

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  const formData = contentType.includes("multipart/form-data")
    ? await req.formData()
    : null;

  const full_name = formData
    ? formData.get("full_name")?.toString().trim() || ""
    : "";
  const phone = formData ? formData.get("phone")?.toString().trim() || "" : "";
  const email = formData
    ? formData.get("email")?.toString().trim() || null
    : null;
  const description = formData
    ? formData.get("description")?.toString().trim() || ""
    : "";
  const image = formData ? formData.get("image") : null;

  if (!full_name || !phone || !description) {
    return NextResponse.json(
      {
        status: "fail",
        message: "full_name, phone, and description are required",
      },
      { status: 400 },
    );
  }

  let image_url: string | null = null;

  if (image instanceof File) {
    try {
      image_url = await uploadFileToCloudinary(image);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        {
          status: "fail",
          message: "Error uploading image to Cloudinary",
        },
        { status: 500 },
      );
    }
  }

  const [designRequest] = await db("design_requests")
    .insert({
      full_name,
      phone,
      email: email || null,
      description,
      image_url,
      status: "pending",
    })
    .returning("*");

  return NextResponse.json(
    {
      status: "success",
      message: "Design request submitted successfully",
      data: {
        designRequest,
      },
    },
    { status: 201 },
  );
}
