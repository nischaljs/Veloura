import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { MapPin, Plus, Edit } from 'lucide-react';
import { addAddress, updateAddress } from '../../services/user';
import { toast } from 'sonner';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: any | null;
  onSuccess: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  address,
  onSuccess
}) => {
  const isEditing = !!address;
  
  const [formData, setFormData] = useState({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    country: 'Nepal',
    postalCode: '',
    phone: '',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        recipientName: address.recipientName || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || 'Nepal',
        postalCode: address.postalCode || '',
        phone: address.phone || '',
        isDefault: address.isDefault || false
      });
    } else {
      setFormData({
        recipientName: '',
        street: '',
        city: '',
        state: '',
        country: 'Nepal',
        postalCode: '',
        phone: '',
        isDefault: false
      });
    }
  }, [address, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isDefault: checked }));
  };

  const validateForm = () => {
    if (!formData.recipientName.trim()) {
      toast.error('Recipient name is required');
      return false;
    }
    if (!formData.street.trim()) {
      toast.error('Street address is required');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!formData.state.trim()) {
      toast.error('State is required');
      return false;
    }
    if (!formData.postalCode.trim()) {
      toast.error('Postal code is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing && address) {
        await updateAddress(address.id, formData);
        toast.success('Address updated successfully');
      } else {
        await addAddress(formData);
        toast.success('Address added successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your delivery address information.' : 'Add a new delivery address to your account.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
          <div className="space-y-4 pb-4">
            {/* Recipient Name */}
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
                placeholder="Full name of recipient"
              />
            </div>
            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                placeholder="House number, street name, locality"
              />
            </div>
            {/* City and State */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  placeholder="State or province"
                />
              </div>
            </div>
            {/* Country and Postal Code */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="Postal/ZIP code"
                />
              </div>
            </div>
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+977 98XXXXXXXX"
              />
            </div>
            {/* Default Address Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isDefault" className="text-sm">
                Set as default delivery address
              </Label>
            </div>
            {/* Address Preview */}
            {formData.recipientName && formData.street && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address Preview
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{formData.recipientName}</p>
                  <p>{formData.street}</p>
                  <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                  <p>{formData.country}</p>
                  <p>Phone: {formData.phone}</p>
                  {formData.isDefault && (
                    <p className="text-indigo-600 font-medium">✓ Default address</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Sticky Action Buttons */}
          <div className="sticky bottom-0 left-0 bg-white pt-4 pb-2 flex justify-end gap-3 border-t border-gray-100 z-10">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;