"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";

interface FilePreviewProps {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
}

export function FilePreview({
  fileName,
  fileUrl,
  fileType,
  fileSize,
}: FilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const canPreview =
    fileType.startsWith("image/") || fileType === "application/pdf";

  const renderPreview = () => {
    if (fileType.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      );
    }

    if (fileType === "application/pdf") {
      return (
        <div className="w-full h-96">
          <iframe
            src={fileUrl}
            className="w-full h-full border rounded-lg"
            title={fileName}
          />
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="h-12 w-12 mx-auto mb-2" />
        <p>Preview not available for this file type</p>
        <p className="text-sm">Click download to view the file</p>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getFileIcon(fileType)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {fileType.split("/")[1]?.toUpperCase() || "FILE"}
            </Badge>
            {fileSize && <span>{formatFileSize(fileSize)}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {canPreview && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{fileName}</DialogTitle>
                <DialogDescription>
                  {fileType} • {fileSize && formatFileSize(fileSize)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">{renderPreview()}</div>
            </DialogContent>
          </Dialog>
        )}

        <Button variant="ghost" size="sm" asChild>
          <a href={fileUrl} download={fileName}>
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
