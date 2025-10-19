import { VenueFormData } from "@/pages/ListGround";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Clock } from "lucide-react";

interface Props {
  formData: VenueFormData;
  updateFormData: (updates: Partial<VenueFormData>) => void;
}

const PricingStep = ({ formData, updateFormData }: Props) => {
  // Calculate estimated monthly earnings (assuming 5 bookings/week)
  const weeklyBookings = 5;
  const avgBookingHours = 2;
  const rate = formData.hourly_rate || 0;
  const estimatedMonthly = weeklyBookings * avgBookingHours * rate * 4.3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold italic mb-4">Pricing & Availability</h2>
        <p className="text-muted-foreground">
          Set competitive prices and define when your venue is available.
        </p>
      </div>

      {/* Hourly Rate */}
      <div className="space-y-2">
        <Label htmlFor="hourly_rate" className="required">
          Hourly Rate (£) *
        </Label>
        <Input
          id="hourly_rate"
          type="number"
          step="0.01"
          placeholder="e.g., 50.00"
          value={formData.hourly_rate || ""}
          onChange={(e) =>
            updateFormData({ hourly_rate: parseFloat(e.target.value) || null })
          }
          className="text-lg font-bold"
        />
      </div>

      {/* Weekend Rate */}
      <div className="space-y-3 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Different Weekend Rate</Label>
            <p className="text-sm text-muted-foreground">
              Charge a different rate for weekends
            </p>
          </div>
          <Switch
            checked={!!formData.weekend_rate}
            onCheckedChange={(checked) =>
              updateFormData({ weekend_rate: checked ? formData.hourly_rate : null })
            }
          />
        </div>
        {formData.weekend_rate !== null && (
          <Input
            type="number"
            step="0.01"
            placeholder="Weekend rate"
            value={formData.weekend_rate || ""}
            onChange={(e) =>
              updateFormData({ weekend_rate: parseFloat(e.target.value) || null })
            }
          />
        )}
      </div>

      {/* Long Booking Discount */}
      <div className="space-y-3 p-4 border rounded-lg">
        <Label>Long Booking Discount</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Offer a discount for extended bookings (3+ hours)
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="50"
            placeholder="0"
            value={formData.discount_percentage || ""}
            onChange={(e) =>
              updateFormData({
                discount_percentage: parseInt(e.target.value) || 0,
              })
            }
            className="w-24"
          />
          <span className="text-muted-foreground">% off</span>
        </div>
      </div>

      {/* Deposit */}
      <div className="space-y-3 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Require Deposit</Label>
            <p className="text-sm text-muted-foreground">
              Upfront payment to confirm booking
            </p>
          </div>
          <Switch
            checked={formData.deposit_required}
            onCheckedChange={(checked) =>
              updateFormData({ deposit_required: checked })
            }
          />
        </div>
        {formData.deposit_required && (
          <Input
            type="number"
            step="0.01"
            placeholder="Deposit amount (£)"
            value={formData.deposit_amount || ""}
            onChange={(e) =>
              updateFormData({ deposit_amount: parseFloat(e.target.value) || null })
            }
          />
        )}
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-2">
        <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
        <Select
          value={formData.cancellation_policy}
          onValueChange={(value) =>
            updateFormData({ cancellation_policy: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flexible">
              Flexible - Full refund 24h before
            </SelectItem>
            <SelectItem value="moderate">
              Moderate - Full refund 48h before
            </SelectItem>
            <SelectItem value="strict">
              Strict - Full refund 7 days before
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Operating Hours */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours_start">
            <Clock className="w-4 h-4 inline mr-1" />
            Opening Time
          </Label>
          <Input
            id="hours_start"
            type="time"
            value={formData.operating_hours_start}
            onChange={(e) =>
              updateFormData({ operating_hours_start: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hours_end">
            <Clock className="w-4 h-4 inline mr-1" />
            Closing Time
          </Label>
          <Input
            id="hours_end"
            type="time"
            value={formData.operating_hours_end}
            onChange={(e) =>
              updateFormData({ operating_hours_end: e.target.value })
            }
          />
        </div>
      </div>

      {/* Estimated Earnings */}
      {formData.hourly_rate && (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <Label className="text-green-900 dark:text-green-100 font-bold">
              Estimated Monthly Earnings
            </Label>
          </div>
          <p className="text-3xl font-bold text-green-600">
            £{estimatedMonthly.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {weeklyBookings} bookings/week × {avgBookingHours}h each
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingStep;
