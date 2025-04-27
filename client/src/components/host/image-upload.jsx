import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, Move, Upload } from "lucide-react";

export default function ImageUpload({ initialImages = [], updateImages }) {
  const [images, setImages] = useState(initialImages);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      updateImages(updatedImages);
    },
    [images, updateImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (id) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    updateImages(updatedImages);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
    updateImages(items);
    setIsDragging(false);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-lg font-medium">Upload Property Photos</label>
        <p className="text-sm text-muted-foreground mb-4">
          Add high-quality photos to showcase your property. Drag to reorder -
          the first image will be your main photo.
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-500 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload
              className={`h-10 w-10 ${
                isDragActive ? "text-green-500" : "text-gray-400"
              }`}
            />
            <p className="text-lg font-medium">
              {isDragActive ? "Drop the files here" : "Drag & drop photos here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max 5MB per image)
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium">
              Your Photos ({images.length})
            </label>
            <p className="text-sm text-muted-foreground">Drag to reorder</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div
                  className={`overflow-hidden border-2 ${
                    index === 0 ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <div className="p-0 aspect-square relative">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                        Main Photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Move className="text-white h-6 w-6" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
