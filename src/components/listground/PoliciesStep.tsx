import { VenueFormData } from "@/pages/ListGround";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const PoliciesStep = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Policies & Rules</h2>
        <p className="text-muted-foreground">
          Set clear expectations for your guests.
        </p>
      </div>

      {/* House Rules */}
      <div className="space-y-2">
        <Label htmlFor="house_rules">House Rules</Label>
        <Textarea
          id="house_rules"
          placeholder="e.g., No smoking, No outside food, Respect other players, Clean up after use"
          value={formData.house_rules}
          onChange={(e) => updateFormData({ house_rules: e.target.value })}
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Be specific about what guests can and cannot do
        </p>
      </div>

      {/* Age Restrictions */}
      <div className="space-y-2">
        <Label htmlFor="age_restriction">Age Restrictions</Label>
        <Select
          value={formData.age_restriction}
          onValueChange={(value) =>
            updateFormData({ age_restriction: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_ages">All Ages Welcome</SelectItem>
            <SelectItem value="16+">16+ Only</SelectItem>
            <SelectItem value="18+">18+ Only (Adults)</SelectItem>
            <SelectItem value="kids_only">Kids Only (Under 16)</SelectItem>
            <SelectItem value="supervised">
              Minors Must Be Supervised
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weather Policy */}
      <div className="space-y-2">
        <Label htmlFor="weather_policy">Weather Policy</Label>
        <Select
          value={formData.weather_policy}
          onValueChange={(value) =>
            updateFormData({ weather_policy: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select weather policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full_refund">
              Full Refund if Cancelled Due to Rain
            </SelectItem>
            <SelectItem value="reschedule">
              Reschedule to Another Day (No Refund)
            </SelectItem>
            <SelectItem value="no_refund">
              No Refund (Play in Any Weather)
            </SelectItem>
            <SelectItem value="partial_refund">
              50% Refund for Severe Weather
            </SelectItem>
            <SelectItem value="indoor">
              Indoor Venue - No Weather Issues
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
        <Textarea
          id="additional_notes"
          placeholder="Any other important information guests should know..."
          value={formData.additional_notes}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
            Clear policies protect both you and your guests
          </p>
          <p className="text-amber-700 dark:text-amber-300">
            Well-defined rules help prevent misunderstandings and create a better
            experience for everyone. Be firm but fair!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliciesStep;
