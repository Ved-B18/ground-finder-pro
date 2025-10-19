import { VenueFormData } from "@/pages/ListGround";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ImageUpload";
import { Image, Video } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const MediaStep = ({ formData, updateFormData }: Props) => {
  const handleImageUpload = (url: string) => {
    updateFormData({
      images: [...(formData.images || []), url],
    });
  };

  const handleCoverPhotoUpload = (url: string) => {
    updateFormData({ cover_photo: url });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Photos & Media</h2>
        <p className="text-muted-foreground">
          High-quality photos attract more bookings. Show off your venue!
        </p>
      </div>

      {/* Cover Photo */}
      <div className="space-y-3">
        <Label className="text-lg font-bold">
          <Image className="w-5 h-5 inline mr-2" />
          Cover Photo (Primary Image)
        </Label>
        <p className="text-sm text-muted-foreground">
          This will be the main image displayed in search results
        </p>
        {formData.cover_photo ? (
          <div className="relative">
            <img
              src={formData.cover_photo}
              alt="Cover"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={() => updateFormData({ cover_photo: "" })}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-sm hover:opacity-90"
            >
              Remove
            </button>
          </div>
        ) : (
          <ImageUpload
            bucket="venue-images"
            onUploadComplete={handleCoverPhotoUpload}
            label="Upload Cover Photo"
          />
        )}
      </div>

      {/* Additional Photos */}
      <div className="space-y-3">
        <Label className="text-lg font-bold">
          Venue Photos (Minimum 3 recommended)
        </Label>
        <p className="text-sm text-muted-foreground">
          Upload multiple angles and views of your venue
        </p>

        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Venue ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    const newImages = formData.images.filter((_, i) => i !== index);
                    updateFormData({ images: newImages });
                  }}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <ImageUpload
          bucket="venue-images"
          onUploadComplete={handleImageUpload}
          label={`Upload Photo ${(formData.images?.length || 0) + 1}`}
        />

        <p className="text-sm text-muted-foreground">
          {formData.images?.length || 0} photo(s) uploaded
        </p>
      </div>

      {/* Video Link */}
      <div className="space-y-3">
        <Label htmlFor="video_url">
          <Video className="w-5 h-5 inline mr-2" />
          Video Link (Optional)
        </Label>
        <p className="text-sm text-muted-foreground">
          Add a YouTube or Vimeo link to showcase your venue
        </p>
        <Input
          id="video_url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.video_url}
          onChange={(e) => updateFormData({ video_url: e.target.value })}
        />
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          📸 Photography Tips:
        </p>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Use natural lighting for outdoor venues</li>
          <li>Show different angles and perspectives</li>
          <li>Include action shots if possible</li>
          <li>Highlight unique features and amenities</li>
          <li>Ensure images are high resolution (min 1920x1080)</li>
        </ul>
      </div>
    </div>
  );
};

export default MediaStep;
