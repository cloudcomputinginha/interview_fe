import { useState } from "react";
import type { UserProfile } from "../types/profile";

export function useProfileForm(initialData: UserProfile) {
  const [userData, setUserData] = useState<UserProfile>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(initialData);

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof UserProfile["notifications"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handlePrivacyChange = (
    field: keyof UserProfile["privacy"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    // 실제 서비스에서는 API 호출 필요
    alert("프로필이 성공적으로 저장되었습니다.");
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return {
    userData,
    formData,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleNotificationChange,
    handlePrivacyChange,
    handleSave,
    handleCancel,
  };
}
