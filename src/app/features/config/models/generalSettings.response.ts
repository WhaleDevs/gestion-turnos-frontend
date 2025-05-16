export interface GeneralSettingsResponse {
  address?: string;
  email?: string;
  phoneNumber?: string;
  limitDaysToReserve?: number;
}

export const INITIAL_GENERAL_SETTINGS: GeneralSettingsResponse = {
  address: '',
  email: '',
  phoneNumber: '',
  limitDaysToReserve: 0,
};

