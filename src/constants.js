// ============================================================================
//                                 USER MODEL
// ============================================================================

// User roles

const UserRoleEnum = Object.freeze({
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  USER: "USER",
});

const AvailableUserRoles = Object.freeze(Object.values(UserRoleEnum));

// User logins

const UserLoginEnum = Object.freeze({
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
});

const AvailableUserLogins = Object.freeze(Object.values(UserLoginEnum));

// User status

const UserStatusEnum = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

const AvailableUserStatus = Object.freeze(Object.values(UserStatusEnum));

// User genders
const UserGenderEnum = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
});

const AvailableUserGenders = Object.freeze(Object.values(UserGenderEnum));

export {
  UserRoleEnum,
  AvailableUserRoles,
  UserLoginEnum,
  AvailableUserLogins,
  UserStatusEnum,
  AvailableUserStatus,
  UserGenderEnum,
  AvailableUserGenders,
};
