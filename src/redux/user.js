import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetUser: null,
  targetUserFeeds: [],
  statistics: [],
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTargetUser: (state, action) => {
      state.targetUser = action.payload;
    },
    UpdateProcedurePrice: (state, action) => {
      const { index, newPrice } = action.payload;
      if (
        state.targetUser &&
        state.targetUser.procedures &&
        state.targetUser.procedures[index]
      ) {
        state.targetUser.procedures[index].price = newPrice;
      } else {
        console.error(`Error: Cannot update price at index ${index}`);
      }
    },
    UpdateWDHours: (state, action) => {
      const { index, newHours } = action.payload;
      if (
        state.targetUser &&
        state.targetUser.workingDays &&
        state.targetUser.workingDays[index]
      ) {
        state.targetUser.workingDays[index].hours = newHours;
      } else {
        console.error(`Error: Cannot update hours at index ${index}`);
      }
    },
    setTargetUserName: (state, action) => {
      state.targetUser.name = action.payload;
    },
    setTargetUsername: (state, action) => {
      state.targetUser.username = action.payload;
    },
    setTargetUserAddress: (state, action) => {
      state.targetUser.address[action.payload.index] = action.payload.data;
    },
    setTargetUserAddressRemove: (state, action) => {
      state.targetUser.address = state.targetUser.address.filter(
        (item) => item._id !== action.payload
      );
    },
    UpdateTargetUserPhone: (state, action) => {
      state.targetUser.phone = action.payload;
    },
    UpdateTargetUserWeb: (state, action) => {
      state.targetUser.media.web = action.payload;
    },
    UpdateTargetUserFacebook: (state, action) => {
      state.targetUser.media.facebook = action.payload;
    },
    UpdateTargetUserInstagram: (state, action) => {
      state.targetUser.media.instagram = action.payload;
    },
    UpdateTargetUserTiktok: (state, action) => {
      state.targetUser.media.tiktok = action.payload;
    },
    UpdateTargetUserYoutube: (state, action) => {
      state.targetUser.media.youtube = action.payload;
    },
    UpdateTargetUserWhatsapp: (state, action) => {
      if (state.targetUser.media.whatsapp) {
        state.targetUser.media.whatsapp = action.payload;
      } else {
        state.targetUser.media = {
          ...state.targetUser.media,
          whatsapp: action.payload,
        };
      }
    },
    UpdateTargetUserTelegram: (state, action) => {
      if (state.targetUser.media.telegram) {
        state.targetUser.media.telegram = action.payload;
      } else {
        state.targetUser.media = {
          ...state.targetUser.media,
          telegram: action.payload,
        };
      }
    },

    UpdateTargetUserActiveStatus: (state, action) => {
      state.targetUser.active = action.payload;
    },
    setTargetUserFeeds: (state, action) => {
      state.targetUserFeeds = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
  },
});

export const {
  setTargetUser,
  UpdateProcedurePrice,
  UpdateWDHours,
  setTargetUserName,
  setTargetUsername,
  setTargetUserAddress,
  setTargetUserAddressRemove,
  UpdateTargetUserPhone,
  UpdateTargetUserWeb,
  UpdateTargetUserFacebook,
  UpdateTargetUserInstagram,
  UpdateTargetUserTiktok,
  UpdateTargetUserYoutube,
  UpdateTargetUserWhatsapp,
  UpdateTargetUserTelegram,
  UpdateTargetUserActiveStatus,
  setTargetUserFeeds,
  setStatistics,
} = user.actions;
export default user.reducer;
