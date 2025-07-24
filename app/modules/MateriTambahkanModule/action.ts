import type { ActionFunctionArgs } from "react-router";
import { PdfReader } from "pdfreader";
import { extractTextFromPDF, validatePDFFile } from "~/utils/pdfparse.server";

export async function MateriTambahkanAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf-file") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    const validationError = validatePDFFile(file);
    if (validationError) {
      return Response.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await extractTextFromPDF(buffer, file.name);

    if (!result.success) {
      return Response.json(result, { status: 500 });
    }

    console.log(`Successfully extracted text from ${file.name}:`, {
      pages: result.data?.totalPages,
      textLength: result.data?.extractedText.length,
      items: result.data?.metadata.textItems,
    });

    console.log(result.data?.extractedText);

    return Response.json({
      success: true,
      message: "PDF berhasil diproses dan teks berhasil diekstrak",
      data: result.data,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan internal saat memproses file",
      },
      { status: 500 }
    );
  }
}
