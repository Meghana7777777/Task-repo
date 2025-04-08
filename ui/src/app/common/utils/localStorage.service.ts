
const avatarImg = process.env['REACT_APP_ASSETS_BUCKET'] + '/avatars/avatar5.webp';

const testUser = {
  userId: 1,
  firstName: 'Chris',
  lastName: 'Johnson',
  imgUrl: avatarImg,
  userName: 'admin',
  email: {
    name: 'chris.johnson@altence.com',
    verified: true,
  },
  phone: {
    number: '+18143519459',
    verified: false,
  },
  sex: 'male',
  birthday: '01/26/2022',
  lang: 'en',
  country: 'GB',
  city: 'London',
  address1: '14 London Road',
  zipcode: 5211,
  website: 'altence.com',
  socials: {
    twitter: '@altence_team',
    facebook: 'https://facebook.com/groups/1076577369582221',
    linkedin: 'https://linkedin.com/company/altence',
  },
  orgData: {
    unitCode: 'B3',
    companyCode: '5000'
  }
};

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string => {
  return localStorage.getItem('accessToken') || 'bearerToken';
};
//user: UserModel
export const persistUser = (user: any): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const readUser = (): any | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr && (userStr != 'undefined') ? JSON.parse(userStr) : testUser;
};

export const deleteToken = (): void => localStorage.removeItem('accessToken');
export const deleteUser = (): void => localStorage.removeItem('currentUser');
